import { ChoiceNode } from "./types";

export const NARRATIVE_NODES: ChoiceNode[] = [
  // --- University Era ---
  {
    id: "uni_focus",
    question: "大二学年，你决定将主要的精力投入到哪个方向？",
    options: [
      {
        id: "gpa_king",
        label: "学术绩点 (GPA)",
        description: "追求极致的成绩排名，为保研或申请名校铺路。",
        consequence: "学术底色",
      },
      {
        id: "skill_master",
        label: "实践技能/竞赛",
        description: "参加大厂实习、技术竞赛或社团，提前接触行业规则。",
        consequence: "实战底色",
      },
    ],
  },
  {
    id: "social_style",
    question: "关于大学里的社交与人脉，你的态度是？",
    options: [
      {
        id: "deep_bond",
        label: "深度社交",
        description: "与少数志同道合的朋友建立极深的情感连接。",
        consequence: "稳定社交圈",
      },
      {
        id: "wide_net",
        label: "广撒网式社交",
        description: "活跃于各种圈子，积累跨行业的潜在人脉资源。",
        consequence: "资源型社交",
      },
    ],
  },
  // --- Graduation Crossroads ---
  {
    id: "grad_school",
    question: "毕业之际，你面临第一个重大抉择：是继续深造还是直接就业？",
    options: [
      {
        id: "grad_yes",
        label: "考研/出国深造",
        description: "选择在学术或专业领域进一步钻研，推迟进入社会的时间。",
        consequence: "学术深造",
      },
      {
        id: "grad_no",
        label: "直接就业",
        description: "尽早积累职场经验，开始经济独立的生活。",
        consequence: "职场起步",
      },
    ],
  },
  {
    id: "career_track",
    question: "如果选择就业，你更倾向于哪种职业赛道？",
    options: [
      {
        id: "stable_system",
        label: "体制内/国企",
        description: "追求长期的稳定与社会保障，节奏相对可控。",
        consequence: "体制路径",
      },
      {
        id: "market_driven",
        label: "市场化大厂/外企",
        description: "高薪酬、高强度、高竞争，追求快速的职场晋升。",
        consequence: "市场路径",
      },
      {
        id: "creative_freelance",
        label: "自由职业/创业",
        description: "完全掌控自己的时间，但需独自承担所有经营风险。",
        consequence: "自由路径",
      },
    ],
  },
  {
    id: "city_vibe",
    question: "关于定居城市的选择，你的核心考量是？",
    options: [
      {
        id: "ambition_city",
        label: "野心之都 (一线)",
        description: "为了最顶级的资源，愿意忍受高房价和通勤压力。",
        consequence: "一线拼搏",
      },
      {
        id: "quality_city",
        label: "宜居之城 (新一线/二线)",
        description: "在职业发展与生活品质之间寻找一个黄金平衡点。",
        consequence: "生活平衡",
      },
    ],
  },
  // --- Early Career Choice ---
  {
    id: "work_life_balance",
    question: "入职第一年，面对高强度的工作压力，你会选择？",
    options: [
      {
        id: "all_in",
        label: "全力以赴 (All-in)",
        description: "牺牲个人生活，换取最快的成长速度和领导信任。",
        consequence: "加速晋升",
      },
      {
        id: "boundary_setter",
        label: "边界守护",
        description: "坚持工作与生活的界限，利用业余时间发展副业或爱好。",
        consequence: "多元生活",
      },
    ],
  },
];
