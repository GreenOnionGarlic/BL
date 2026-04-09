import React, { useState } from "react";
import { motion } from "motion/react";
import { UserIdentity, RiskTolerance, StabilityPreference, UniversityTier } from "../types";
import { determineUniversityTier } from "../services/gemini";
import { ChevronRight, User, Target, Shield, Zap, GraduationCap, Loader2 } from "lucide-react";

interface IdentitySetupProps {
  onComplete: (identity: UserIdentity) => void;
}

export const IdentitySetup: React.FC<IdentitySetupProps> = ({ onComplete }) => {
  const [identity, setIdentity] = useState<UserIdentity>({
    major: "",
    universityName: "",
    universityTier: UniversityTier.NORMAL,
    grade: "大一",
    gpa: "",
    achievements: "",
    skills: "",
    interests: [],
    idealDreamState: "",
    riskTolerance: RiskTolerance.MEDIUM,
    stabilityPreference: StabilityPreference.STABLE,
  });

  const [isSearchingTier, setIsSearchingTier] = useState(false);
  const [interestInput, setInterestInput] = useState("");

  const handleUniversityNameUpdate = (name: string) => {
    setIdentity({ ...identity, universityName: name });
  };

  const handleSearchTier = async () => {
    if (identity.universityName.length > 3) {
      setIsSearchingTier(true);
      try {
        const tier = await determineUniversityTier(identity.universityName);
        setIdentity((prev) => ({ ...prev, universityTier: tier }));
      } catch (e) {
        console.error("Failed to determine tier", e);
      } finally {
        setIsSearchingTier(false);
      }
    }
  };

  const handleAddInterest = () => {
    if (interestInput && !identity.interests.includes(interestInput)) {
      setIdentity({ ...identity, interests: [...identity.interests, interestInput] });
      setInterestInput("");
    }
  };

  const tierLabels = {
    [UniversityTier.TOP]: "顶尖 (985/C9)",
    [UniversityTier.HIGH]: "重点 (211)",
    [UniversityTier.NORMAL]: "普通本科",
    [UniversityTier.OTHER]: "其他/专科",
  };

  const grades = ["大一", "大二", "大三", "大四", "研一", "研二", "研三", "其他"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8 p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-medium tracking-tight text-white">设定你的起点</h2>
        <p className="text-slate-400 text-sm">这些属性将作为你模拟人生的基础参数。请真实填写，模拟器将基于此生成更具现实参考性的路径。</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Major */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-2">
              <User size={14} /> 专业方向
            </label>
            <input
              type="text"
              value={identity.major}
              onChange={(e) => setIdentity({ ...identity, major: e.target.value })}
              placeholder="例如：计算机、会计..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* University Name */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-2">
              <GraduationCap size={14} /> 院校名称
            </label>
            <input
              type="text"
              value={identity.universityName}
              onChange={(e) => handleUniversityNameUpdate(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchTier()}
              placeholder="输入大学名称，按回车判断档次"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* University Tier */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-2">
              {isSearchingTier ? <Loader2 size={14} className="animate-spin" /> : <GraduationCap size={14} />} 院校档次
            </label>
            <select
              value={identity.universityTier}
              onChange={(e) => setIdentity({ ...identity, universityTier: e.target.value as UniversityTier })}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
            >
              {Object.entries(tierLabels).map(([value, label]) => (
                <option key={value} value={value} className="bg-slate-900">{label}</option>
              ))}
            </select>
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-2">
              当前年级
            </label>
            <select
              value={identity.grade}
              onChange={(e) => setIdentity({ ...identity, grade: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
            >
              {grades.map((g) => (
                <option key={g} value={g} className="bg-slate-900">{g}</option>
              ))}
            </select>
          </div>

          {/* GPA */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-2">
              当前绩点 (GPA)
            </label>
            <input
              type="text"
              value={identity.gpa}
              onChange={(e) => setIdentity({ ...identity, gpa: e.target.value })}
              placeholder="例如：3.8/4.0"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-2">
            经历 / 奖项 / 竞赛 / 项目
          </label>
          <textarea
            value={identity.achievements}
            onChange={(e) => setIdentity({ ...identity, achievements: e.target.value })}
            placeholder="简要描述你的过往经历，如：ACM省赛二等奖、某互联网大厂实习、学生会主席..."
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-2">
            当前掌握的技能点
          </label>
          <textarea
            value={identity.skills}
            onChange={(e) => setIdentity({ ...identity, skills: e.target.value })}
            placeholder="例如：Python 爬虫、React 前端开发、雅思 7.5、视频剪辑..."
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
          />
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-2">
            <Target size={14} /> 兴趣倾向
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
              placeholder="输入兴趣并按回车"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <button
              onClick={handleAddInterest}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
              添加
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {identity.interests.map((interest) => (
              <span
                key={interest}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs"
              >
                {interest}
                <button
                  onClick={() => setIdentity({ ...identity, interests: identity.interests.filter(i => i !== interest) })}
                  className="hover:text-emerald-300 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Ideal Dream State */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-2">
            <Target size={14} /> 最理想的梦中状态
          </label>
          <textarea
            value={identity.idealDreamState}
            onChange={(e) => setIdentity({ ...identity, idealDreamState: e.target.value })}
            placeholder="描述一下你心目中最理想的生活状态、职业成就或人生境界..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
          />
        </div>
      </div>

      <button
        onClick={() => onComplete(identity)}
        disabled={!identity.major || identity.interests.length === 0}
        className="w-full py-4 bg-white text-black font-semibold rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        进入分支叙事 <ChevronRight size={18} />
      </button>
    </motion.div>
  );
};
