import React, { useState } from "react";
import { motion } from "motion/react";
import { ChoiceNode } from "../types";
import { ArrowRight, RefreshCw, Plus } from "lucide-react";

interface NarrativeNodeProps {
  node: ChoiceNode;
  onChoice: (optionId: string) => void;
  onRefresh: () => void;
  onCustomChoice: (label: string) => void;
}

export const NarrativeNode: React.FC<NarrativeNodeProps> = ({ node, onChoice, onRefresh, onCustomChoice }) => {
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-3xl mx-auto space-y-12 py-12"
    >
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-500 font-bold">抉择节点</span>
          <button 
            onClick={onRefresh}
            className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-emerald-400 transition-all flex items-center gap-1 text-[10px] uppercase tracking-widest"
            title="换一批选项"
          >
            <RefreshCw size={12} /> 换一批
          </button>
        </div>
        <h2 className="text-4xl font-medium text-white leading-tight">{node.question}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {node.options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onChoice(option.id)}
            className="group relative p-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-3xl text-left transition-all duration-300 overflow-hidden"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-medium text-white group-hover:text-emerald-400 transition-colors">
                  {option.label}
                </span>
                <ArrowRight size={20} className="text-slate-600 group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {option.description}
              </p>
            </div>
            {/* Hover Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}

        {/* Custom Input Option */}
        {!showCustom ? (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: node.options.length * 0.1 }}
            onClick={() => setShowCustom(true)}
            className="group relative p-8 bg-white/5 hover:bg-white/10 border border-dashed border-white/10 hover:border-white/20 rounded-3xl text-left transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Plus size={20} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
            <span className="text-slate-400 group-hover:text-white transition-colors">自定义选项</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white/5 border border-emerald-500/30 rounded-3xl space-y-4"
          >
            <textarea
              autoFocus
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="输入你的自定义选择..."
              className="w-full bg-transparent border-none text-white focus:outline-none resize-none text-sm"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCustom(false)}
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                取消
              </button>
              <button 
                disabled={!customInput.trim()}
                onClick={() => onCustomChoice(customInput)}
                className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                确认选择
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
