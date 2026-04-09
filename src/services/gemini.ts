import { UserIdentity, PathChoice, SimulationResultData, ChoiceNode, UniversityTier } from "../types";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

async function callDeepSeekAPI(prompt: string): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: {
        type: "json_object",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateNextChoice(
  identity: UserIdentity,
  previousChoices: PathChoice[],
  stepCount: number
): Promise<ChoiceNode> {
  const prompt = `
    你是一个冷静、理性的职业路径模拟专家。基于用户的身份和已有的选择，生成下一个关键的抉择节点。
    
    用户身份:
    - 专业: ${identity.major}
    - 院校档次: ${identity.universityTier} (TOP: 985/C9, HIGH: 211, NORMAL: 普通本科, OTHER: 其他/专科)
    - 当前年级: ${identity.grade}
    - 当前绩点: ${identity.gpa}
    - 过往经历/奖项: ${identity.achievements}
    - 已掌握技能: ${identity.skills}
    - 兴趣: ${identity.interests.join(", ")}
    - 理想的梦中状态: ${identity.idealDreamState}
    - 风险偏好: ${identity.riskTolerance}
    - 稳定性偏好: ${identity.stabilityPreference}
    
    已有的选择历史:
    ${previousChoices.map((c, i) => `步骤 ${i + 1}: ${c.nodeId} -> ${c.optionId}`).join("\n")}
    
    当前是第 ${stepCount + 1} 个抉择（共 5 个）。
    
    **核心原则：现实主义与克制**
    1. 考虑到用户能力有限，社会竞争激烈，院校档次对初期机会有巨大影响。
    2. 选项应包含现实中的无奈、妥协或平凡的选择，而不仅仅是光鲜亮丽的成功路径。
    3. 语气应冷静、客观，避免煽情或过度理想化。
    4. 抉择应具有逻辑连贯性，并紧密结合用户的当前年级（例如大一侧重基础与探索，大四侧重就业与深造）。
    5. **权重调整**：在生成选项时，大幅增加用户的“兴趣”和“技能点”的权重，确保选项与这些属性高度相关。
    6. **多样化分支**：生成选项时，必须确保分支具有显著的多样性（例如：一条稳健路径、一条激进路径、一条基于兴趣的非主流路径、一条基于技能的专业路径），避免选项过于雷同。
    
    必须使用中文生成。
    输出格式为 JSON，包含以下字段：
    {
      "id": "节点ID",
      "question": "问题描述",
      "options": [
        {
          "id": "选项ID",
          "label": "选项标签",
          "description": "选项描述",
          "consequence": "选项后果"
        }
      ]
    }
  `;

  const responseText = await callDeepSeekAPI(prompt);
  return JSON.parse(responseText || "{}") as ChoiceNode;
}

export async function simulateOutcome(
  identity: UserIdentity,
  choices: PathChoice[]
): Promise<SimulationResultData> {
  const prompt = `
    你是一个冷静、理性的职业路径模拟专家。基于以下用户身份和职业选择，模拟他们5年后的生活状态。
    
    用户身份:
    - 专业: ${identity.major}
    - 院校档次: ${identity.universityTier}
    - 当前年级: ${identity.grade}
    - 当前绩点: ${identity.gpa}
    - 过往经历/奖项: ${identity.achievements}
    - 已掌握技能: ${identity.skills}
    - 兴趣: ${identity.interests.join(", ")}
    - 理想的梦中状态: ${identity.idealDreamState}
    - 风险偏好: ${identity.riskTolerance}
    - 稳定性偏好: ${identity.stabilityPreference}
    
    抉择历史:
    ${choices.map((c) => `- ${c.nodeId}: 选择了 ${c.optionId}`).join("\n")}
    
    **核心原则：现实主义与克制**
    1. 不要生成“人生赢家”式的结局，除非路径极其合理且概率极高。
    2. 考虑到院校档次、个人能力限制和行业大环境。大多数人的生活是平凡、忙碌且带有遗憾的。
    3. 收入水平必须符合现实（例如：普通本科在非一线城市工作5年后，月入过万并非易事）。
    4. 语气应冷静、客观、克制。
    5. 提供 3-4 条基于该路径的 AI 建议，帮助用户在现实中避坑或提升。
    6. 生成 5 年的年度数据趋势（yearlyStats），包括收入、财富、健康、自由度和成长值。**特别注意**：在模拟过程中随机插入 1-2 个“突发事件”（如裁员、健康危机、意外灵感等），这些事件应显著影响当年的核心属性，并在 eventDescription 字段中简要描述该事件及其影响。
    7. 总结这 5 次关键抉择的回顾（choiceHistory），包含当时的问题、用户的选择及其直接后果。
    8. **评估用户的性格偏好**：基于用户的 5 次选择，评估其表现出的“风险接受程度”（evaluatedRisk: LOW/MEDIUM/HIGH）和“稳定性偏好”（evaluatedStability: STABLE/FLEXIBLE/DYNAMIC）。
    9. **提供真实参考数据 (benchmarks)**：基于用户的学校 (${identity.universityName}, ${identity.universityTier}) 和专业 (${identity.major})，提供 2-3 条“真实世界”中同校校友或同专业从业者的参考数据。这些数据应包含他们的职位、工作年限、月薪、所在城市、一段简短的生活/职场感悟以及职业满意度。这有助于用户比对并减轻迷茫。
    
    所有文本内容必须使用中文。
    输出格式为 JSON，包含以下字段：
    {
      "pathName": "路径名称",
      "incomeRange": [最低月收入, 最高月收入],
      "dailySchedule": [
        {
          "time": "时间点",
          "activity": "活动名称",
          "description": "活动细节"
        }
      ],
      "stressIndex": 压力指数,
      "socialStructure": [
        {
          "category": "社交类别",
          "value": 数值
        }
      ],
      "livingEnvironment": "居住环境描述",
      "narrative": "核心叙事总结",
      "sceneType": "场景类型",
      "evaluatedRisk": "风险评估",
      "evaluatedStability": "稳定性评估",
      "stats": {
        "wealth": 财富值,
        "health": 健康值,
        "freedom": 自由度,
        "growth": 成长值
      },
      "yearlyStats": [
        {
          "year": 年份,
          "income": 收入,
          "wealth": 财富,
          "health": 健康,
          "freedom": 自由度,
          "growth": 成长值,
          "eventDescription": "事件描述"
        }
      ],
      "choiceHistory": [
        {
          "question": "问题",
          "choiceLabel": "选择标签",
          "consequence": "后果"
        }
      ],
      "lifeLog": [
        {
          "year": 年份,
          "event": "事件"
        }
      ],
      "suggestions": ["建议1", "建议2"],
      "benchmarks": [
        {
          "role": "职位",
          "yearsOfExperience": 工作年限,
          "monthlySalary": 月薪,
          "location": "所在城市",
          "lifeExperience": "生活感悟",
          "satisfaction": 满意度
        }
      ]
    }
  `;

  const responseText = await callDeepSeekAPI(prompt);
  const result = JSON.parse(responseText || "{}");
  return result as SimulationResultData;
}

export async function determineUniversityTier(universityName: string): Promise<UniversityTier> {
  const prompt = `请判断大学 "${universityName}" 的档次。
    规则：
    - 985/C9 高校 -> TOP
    - 211 高校 -> HIGH
    - 普通本科 -> NORMAL
    - 其他/高职 -> OTHER
    只返回对应的枚举值，不要有其他文字。
    输出格式为 JSON：{"tier": "枚举值"}`;

  const responseText = await callDeepSeekAPI(prompt);
  const data = JSON.parse(responseText || "{}");
  const text = data.tier as UniversityTier;
  return Object.values(UniversityTier).includes(text) ? text : UniversityTier.NORMAL;
}
