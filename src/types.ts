export enum RiskTolerance {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum StabilityPreference {
  STABLE = "STABLE",
  FLEXIBLE = "FLEXIBLE",
  DYNAMIC = "DYNAMIC",
}

export enum UniversityTier {
  TOP = "TOP", // C9/985
  HIGH = "HIGH", // 211
  NORMAL = "NORMAL", // 普通本科
  OTHER = "OTHER", // 其他/高职
}

export interface UserIdentity {
  major: string;
  universityName: string;
  universityTier: UniversityTier;
  grade: string; // 大一, 大二, 大三, 大四, 研一...
  gpa: string;
  achievements: string; // 经历/奖项/竞赛/项目
  skills: string; // 已掌握的技能
  interests: string[];
  idealDreamState: string; // 理想的梦中状态
  riskTolerance: RiskTolerance;
  stabilityPreference: StabilityPreference;
}

export interface ChoiceNode {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    description: string;
    consequence: string;
  }[];
}

export interface PathChoice {
  nodeId: string;
  optionId: string;
}

export interface YearlyStat {
  year: number;
  income: number; // 月收入（千元）
  wealth: number; // 0-100
  health: number; // 0-100
  freedom: number; // 0-100
  growth: number; // 0-100
  eventDescription?: string; // 该年份发生的关键事件或变化原因
}

export interface ChoiceHistoryItem {
  question: string;
  choiceLabel: string;
  consequence: string;
}

export interface CareerBenchmark {
  role: string;
  yearsOfExperience: number;
  monthlySalary: number; // 千元
  location: string;
  lifeExperience: string;
  satisfaction: number; // 0-100
}

export interface SimulationResultData {
  id: string; // Added ID for history tracking
  timestamp: number; // Added timestamp
  pathName: string;
  incomeRange: [number, number]; // [min, max] in thousands
  dailySchedule: { time: string; activity: string; description: string }[];
  stressIndex: number; // 0-100
  socialStructure: { category: string; value: number }[];
  livingEnvironment: string;
  narrative: string;
  sceneType: "OFFICE" | "LIBRARY" | "STUDIO" | "REMOTE" | "FIELD";
  evaluatedRisk: RiskTolerance;
  evaluatedStability: StabilityPreference;
  benchmarks?: CareerBenchmark[]; // 新增：真实职业/校友参考数据
  stats: {
    wealth: number; // 0-100
    health: number; // 0-100
    freedom: number; // 0-100
    growth: number; // 0-100
  };
  yearlyStats: YearlyStat[];
  choiceHistory: ChoiceHistoryItem[];
  fullChoiceHistory?: { node: ChoiceNode; choice: PathChoice }[]; // Added for backtracking
  identity?: UserIdentity; // Added for backtracking from history
  lifeLog: { year: number; event: string }[];
  suggestions: string[];
}
