import React from "react";
import { motion } from "motion/react";

interface VisualSceneProps {
  type: "OFFICE" | "LIBRARY" | "STUDIO" | "REMOTE" | "FIELD";
  className?: string;
}

export const VisualScene: React.FC<VisualSceneProps> = ({ type, className }) => {
  const renderScene = () => {
    switch (type) {
      case "OFFICE":
        return (
          <div className="relative w-full h-full bg-slate-900 overflow-hidden">
            {/* Office Windows */}
            <div className="absolute inset-0 grid grid-cols-4 gap-4 p-8 opacity-20">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-blue-400/30 rounded-sm" />
              ))}
            </div>
            {/* Desk Silhouette */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 bg-slate-800 rounded-t-xl border-t border-slate-700" />
            {/* Monitor Glow */}
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-32 h-20 bg-blue-500/20 blur-xl" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-24 h-16 bg-blue-400/40 rounded-sm border border-blue-300/30" />
          </div>
        );
      case "LIBRARY":
        return (
          <div className="relative w-full h-full bg-stone-900 overflow-hidden">
            {/* Bookshelves */}
            <div className="absolute inset-y-0 left-0 w-1/4 bg-stone-800/50 border-r border-stone-700/30 flex flex-col gap-2 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-stone-700/40 rounded-sm" />
              ))}
            </div>
            {/* Warm Lamp */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/4 bg-stone-800 rounded-t-lg border-t border-stone-700" />
          </div>
        );
      case "STUDIO":
        return (
          <div className="relative w-full h-full bg-zinc-900 overflow-hidden">
            {/* Creative Chaos */}
            <div className="absolute top-10 left-10 w-16 h-16 border-2 border-emerald-500/20 rotate-12" />
            <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-violet-500/20 -rotate-12" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-500/5 to-violet-500/5 rounded-full blur-2xl" />
            </div>
          </div>
        );
      case "REMOTE":
        return (
          <div className="relative w-full h-full bg-neutral-900 overflow-hidden">
            {/* Coffee Cup & Laptop */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-neutral-800/50 border-t border-neutral-700" />
            <div className="absolute bottom-10 left-1/4 w-8 h-8 bg-stone-700 rounded-full" />
            <div className="absolute bottom-10 right-1/4 w-40 h-4 bg-neutral-600 rounded-full opacity-30" />
            {/* Window Light */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 origin-top-right" />
          </div>
        );
      case "FIELD":
        return (
          <div className="relative w-full h-full bg-emerald-950 overflow-hidden">
            {/* Nature/Outdoor */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-emerald-900/40 skew-y-3 origin-bottom-left" />
            <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-500/10 blur-3xl rounded-full" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full" />
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full" />
              <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
        );
      default:
        return <div className="w-full h-full bg-slate-900" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`rounded-2xl border border-white/10 overflow-hidden shadow-2xl ${className}`}
    >
      {renderScene()}
    </motion.div>
  );
};
