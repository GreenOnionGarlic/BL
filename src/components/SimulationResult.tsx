import React from "react";
import { motion } from "motion/react";
import { SimulationResultData } from "../types";
import { VisualScene } from "./VisualScene";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Users, MapPin, Heart, Coins, Wind, Rocket, Calendar, Clock, BrainCircuit, TrendingUp, History as HistoryIcon, Shield, Zap, Briefcase, Quote, Star } from "lucide-react";
import { RiskTolerance, StabilityPreference } from "../types";

interface SimulationResultProps {
  data: SimulationResultData;
  onCompare?: () => void;
  onRestart?: () => void;
  onBacktrack?: (nodeIndex: number) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl space-y-3 max-w-[240px]">
        <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Year {label}</div>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-[10px] text-slate-400" style={{ color: entry.color }}>{entry.name}</span>
              <span className="text-xs font-mono text-white">
                {entry.value}{entry.dataKey === 'income' ? 'k/月' : '%'}
              </span>
            </div>
          ))}
        </div>
        {data.eventDescription && (
          <div className="pt-2 border-t border-white/5">
            <div className="text-[10px] text-slate-500 uppercase tracking-tighter mb-1">年度关键事件</div>
            <p className="text-[11px] text-slate-300 leading-relaxed italic">
              {data.eventDescription}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const SimulationResult: React.FC<SimulationResultProps> = ({ data, onCompare, onRestart, onBacktrack }) => {
  const statItems = [
    { label: "财富积累", value: data.stats.wealth, icon: <Coins size={16} />, color: "text-amber-400" },
    { label: "身心健康", value: data.stats.health, icon: <Heart size={16} />, color: "text-rose-400" },
    { label: "时间自由", value: data.stats.freedom, icon: <Wind size={16} />, color: "text-sky-400" },
    { label: "自我成长", value: data.stats.growth, icon: <Rocket size={16} />, color: "text-emerald-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-12 py-12 px-4"
    >
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.4em] text-emerald-500 font-bold">五年后的生活状态</span>
            <h2 className="text-5xl font-medium text-white tracking-tight">{data.pathName}</h2>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            {data.narrative}
          </p>
          
          {/* Core Stats Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {statItems.map((stat) => (
              <div key={stat.label} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center space-y-2">
                <div className={`flex justify-center ${stat.color}`}>{stat.icon}</div>
                <div className="text-xs text-slate-500 uppercase tracking-tighter">{stat.label}</div>
                <div className="text-xl font-mono text-white">{stat.value}%</div>
              </div>
            ))}
          </div>
        </div>
        <VisualScene type={data.sceneType} className="aspect-video lg:aspect-square" />
      </div>

      {/* Five-Year Trend Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Trend */}
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={16} /> 五年收入趋势 (k/月)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.yearlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickFormatter={(val) => `Year ${val}`}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  name="月收入"
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Trend */}
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={16} /> 核心指标演变
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.yearlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickFormatter={(val) => `Year ${val}`}
                />
                <YAxis stroke="#64748b" fontSize={12} hide />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="wealth" name="财富" stroke="#fbbf24" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="health" name="健康" stroke="#f87171" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="freedom" name="自由" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="growth" name="成长" stroke="#34d399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Life Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Social Structure */}
        <div className="lg:col-span-1 p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Users size={16} /> 社交结构
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.socialStructure}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar
                  name="Social"
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="lg:col-span-2 p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock size={16} /> 典型日作息表
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {data.dailySchedule.map((item, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded whitespace-nowrap mt-0.5">
                  {item.time}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">{item.activity}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Life Log & Environment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Suggestions */}
        <div className="p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 space-y-6">
          <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <BrainCircuit size={16} /> AI 深度建议
          </h3>
          <div className="space-y-4">
            {data.suggestions.map((suggestion, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed italic">“{suggestion}”</p>
              </div>
            ))}
          </div>
        </div>

        {/* Life Log */}
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={16} /> 五年大事记
          </h3>
          <div className="space-y-4">
            {data.lifeLog.map((log, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="text-sm font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded">Year {log.year}</div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">{log.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Choice History Timeline */}
      <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-8">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <HistoryIcon size={16} /> 关键抉择回顾
        </h3>
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
          {data.choiceHistory.map((item, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="text-xs font-bold">{i + 1}</span>
              </div>
              {/* Content */}
              <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-2xl border border-white/5 bg-white/5 space-y-2">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-200 text-xs">{item.question}</div>
                  {onBacktrack && (
                    <button
                      onClick={() => onBacktrack(i)}
                      className="text-[10px] text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0"
                    >
                      <HistoryIcon size={10} /> 从此处重试
                    </button>
                  )}
                </div>
                <div className="text-emerald-400 text-sm font-medium">
                  选择了：{item.choiceLabel}
                </div>
                <div className="text-slate-500 text-xs leading-relaxed">
                  {item.consequence}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personality Evaluation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-emerald-500" size={20} />
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest">风险偏好评估</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-medium text-white">
              {data.evaluatedRisk === RiskTolerance.LOW ? "保守型" : data.evaluatedRisk === RiskTolerance.MEDIUM ? "稳健型" : "激进型"}
            </span>
            <div className="flex gap-1">
              {[RiskTolerance.LOW, RiskTolerance.MEDIUM, RiskTolerance.HIGH].map((r) => (
                <div 
                  key={r}
                  className={`w-8 h-2 rounded-full ${data.evaluatedRisk === r ? 'bg-emerald-500' : 'bg-white/10'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">基于你在模拟过程中的 5 次关键抉择，AI 评估你表现出了{data.evaluatedRisk === RiskTolerance.LOW ? "较低" : data.evaluatedRisk === RiskTolerance.MEDIUM ? "中等" : "较高"}的风险承受能力。</p>
        </div>

        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-violet-500" size={20} />
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest">稳定性偏好评估</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-medium text-white">
              {data.evaluatedStability === StabilityPreference.STABLE ? "追求稳定" : data.evaluatedStability === StabilityPreference.FLEXIBLE ? "灵活平衡" : "拥抱多变"}
            </span>
            <div className="flex gap-1">
              {[StabilityPreference.STABLE, StabilityPreference.FLEXIBLE, StabilityPreference.DYNAMIC].map((s) => (
                <div 
                  key={s}
                  className={`w-8 h-2 rounded-full ${data.evaluatedStability === s ? 'bg-violet-500' : 'bg-white/10'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">你的选择路径显示出你更倾向于{data.evaluatedStability === StabilityPreference.STABLE ? "稳定的生活节奏" : data.evaluatedStability === StabilityPreference.FLEXIBLE ? "灵活的工作模式" : "充满变数与挑战的环境"}。</p>
        </div>
      </div>

      {/* Environment */}
      <div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl">
              <MapPin className="text-emerald-500" size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold">生活环境风格</h4>
              <p className="text-xl text-white font-medium">{data.livingEnvironment}</p>
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>收入区间</span>
              <span className="text-white">¥{data.incomeRange[0]}k - ¥{data.incomeRange[1]}k</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>压力等级</span>
              <span className={data.stressIndex > 70 ? "text-rose-400" : "text-emerald-400"}>{data.stressIndex}%</span>
            </div>
          </div>
        </div>

      {/* Career Benchmarks */}
      {data.benchmarks && data.benchmarks.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Briefcase className="text-emerald-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">真实职业/校友参考</h3>
              <p className="text-xs text-slate-500">基于你的学校与专业，AI 模拟了现实中前辈们的真实人生路径</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.benchmarks.map((benchmark, idx) => (
              <div key={idx} className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote size={48} />
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-bold text-lg">{benchmark.role}</h4>
                    <p className="text-xs text-slate-400">{benchmark.location} · {benchmark.yearsOfExperience}年经验</p>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-mono font-bold">¥{benchmark.monthlySalary}k/月</div>
                    <div className="flex items-center gap-1 justify-end">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-slate-500">满意度 {benchmark.satisfaction}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 relative">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{benchmark.lifeExperience}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-8">
        <button
          onClick={onCompare}
          className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all border border-white/10"
        >
          对比其他路径
        </button>
        <button
          onClick={onRestart}
          className="flex-1 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-slate-200 transition-all"
        >
          重新开启人生
        </button>
      </div>
    </motion.div>
  );
};
