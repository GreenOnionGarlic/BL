import React, { useState } from "react";
import { UserIdentity } from "../types";
import { X } from "lucide-react";

interface IdentityEditorProps {
  identity: UserIdentity;
  onUpdate: (identity: UserIdentity) => void;
  onClose: () => void;
}

export const IdentityEditor: React.FC<IdentityEditorProps> = ({ identity, onUpdate, onClose }) => {
  const [localIdentity, setLocalIdentity] = useState(identity);
  const [interestInput, setInterestInput] = useState("");

  const handleAddInterest = () => {
    if (interestInput && !localIdentity.interests.includes(interestInput)) {
      setLocalIdentity({ ...localIdentity, interests: [...localIdentity.interests, interestInput] });
      setInterestInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">调整你的关键词</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">技能点</label>
            <textarea
              value={localIdentity.skills}
              onChange={(e) => setLocalIdentity({ ...localIdentity, skills: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">最理想的梦中状态</label>
            <textarea
              value={localIdentity.idealDreamState}
              onChange={(e) => setLocalIdentity({ ...localIdentity, idealDreamState: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">兴趣倾向</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
                placeholder="输入兴趣并按回车"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {localIdentity.interests.map((interest) => (
                <span
                  key={interest}
                  className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs"
                >
                  {interest}
                  <button
                    onClick={() => setLocalIdentity({ ...localIdentity, interests: localIdentity.interests.filter(i => i !== interest) })}
                    className="hover:text-emerald-300 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onUpdate(localIdentity);
            onClose();
          }}
          className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
        >
          保存修改
        </button>
      </div>
    </div>
  );
};
