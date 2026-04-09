import React from "react";
import { motion } from "motion/react";
import { SimulationResultData } from "../types";
import { VisualScene } from "./VisualScene";
import { X, Coins, Heart, Wind, Rocket } from "lucide-react";

interface ComparisonViewProps {
  results: SimulationResultData[];
  onClose: () => void;
  onLoadResult?: (result: SimulationResultData) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ results, onClose, onLoadResult }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto p-8"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-medium text-white">路径对比</h2>
            <p className="text-slate-400">直观感受不同选择带来的结构性差异。</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((result, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6 p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col"
            >
              <VisualScene type={result.sceneType} className="aspect-video" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                  {new Date(result.timestamp).toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  ID: {result.id}
                </span>
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-medium text-white">{result.pathName}</h3>
                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                  {result.narrative}
                </p>
              </div>

              {/* Stats Comparison */}
              <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/5">
                <div className="flex items-center gap-2 text-xs text-amber-400/80">
                  <Coins size={12} /> 财富: {result.stats.wealth}%
                </div>
                <div className="flex items-center gap-2 text-xs text-rose-400/80">
                  <Heart size={12} /> 健康: {result.stats.health}%
                </div>
                <div className="flex items-center gap-2 text-xs text-sky-400/80">
                  <Wind size={12} /> 自由: {result.stats.freedom}%
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400/80">
                  <Rocket size={12} /> 成长: {result.stats.growth}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">月收入</span>
                  <div className="text-lg text-emerald-400">¥{result.incomeRange[0]}k+</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">压力值</span>
                  <div className="text-lg text-rose-400">{result.stressIndex}%</div>
                </div>
              </div>

              <div className="space-y-1 pt-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">生活环境</span>
                <div className="text-sm text-slate-300 truncate">{result.livingEnvironment}</div>
              </div>

              {onLoadResult && (
                <button
                  onClick={() => onLoadResult(result)}
                  className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-2xl text-sm font-medium transition-colors mt-4"
                >
                  查看此路径
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
