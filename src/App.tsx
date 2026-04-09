import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserIdentity, PathChoice, SimulationResultData, ChoiceNode } from "./types";
import { simulateOutcome, generateNextChoice } from "./services/gemini";
import { IdentitySetup } from "./components/IdentitySetup";
import { NarrativeNode } from "./components/NarrativeNode";
import { SimulationResult } from "./components/SimulationResult";
import { ComparisonView } from "./components/ComparisonView";
import { IdentityEditor } from "./components/IdentityEditor";
import { Sparkles, Loader2, ChevronRight, History as HistoryIcon, BrainCircuit, Edit3 } from "lucide-react";

type AppStep = "WELCOME" | "IDENTITY" | "NARRATIVE" | "RESULT";

const MAX_STEPS = 5;

export default function App() {
  const [step, setStep] = useState<AppStep>("WELCOME");
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [choices, setChoices] = useState<PathChoice[]>([]);
  const [nodesHistory, setNodesHistory] = useState<ChoiceNode[]>([]);
  const [currentChoiceNode, setCurrentChoiceNode] = useState<ChoiceNode | null>(null);
  const [currentResult, setCurrentResult] = useState<SimulationResultData | null>(null);
  const [allResults, setAllResults] = useState<SimulationResultData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingChoice, setIsGeneratingChoice] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleIdentityComplete = async (id: UserIdentity) => {
    setIdentity(id);
    setStep("NARRATIVE");
    setChoices([]);
    setNodesHistory([]);
    await fetchNextChoice(id, []);
  };

  const fetchNextChoice = async (id: UserIdentity, currentChoices: PathChoice[]) => {
    setIsGeneratingChoice(true);
    try {
      const nextNode = await generateNextChoice(id, currentChoices, currentChoices.length);
      setCurrentChoiceNode(nextNode);
    } catch (error) {
      console.error("Failed to generate choice:", error);
    } finally {
      setIsGeneratingChoice(false);
    }
  };

  const handleChoice = async (optionId: string) => {
    if (!currentChoiceNode || !identity) return;

    const newChoice: PathChoice = {
      nodeId: currentChoiceNode.question, // Use question as ID for dynamic nodes
      optionId,
    };
    const updatedChoices = [...choices, newChoice];
    const updatedNodes = [...nodesHistory, currentChoiceNode];
    setChoices(updatedChoices);
    setNodesHistory(updatedNodes);

    if (updatedChoices.length < MAX_STEPS) {
      await fetchNextChoice(identity, updatedChoices);
    } else {
      setIsLoading(true);
      setStep("RESULT");
      try {
        const result = await simulateOutcome(identity, updatedChoices);
        // Add ID and timestamp for history
        const resultWithMeta: SimulationResultData = {
          ...result,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          identity: identity,
          fullChoiceHistory: updatedNodes.map((node, i) => ({
            node,
            choice: updatedChoices[i]
          }))
        };
        setCurrentResult(resultWithMeta);
        setAllResults((prev) => [...prev, resultWithMeta]);
      } catch (error) {
        console.error("Simulation failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRefreshChoice = async () => {
    if (!identity) return;
    await fetchNextChoice(identity, choices);
  };

  const handleCustomChoice = async (customLabel: string) => {
    if (!currentChoiceNode || !identity) return;
    
    // For custom choice, we use a special ID and the label as the choice
    const newChoice: PathChoice = {
      nodeId: currentChoiceNode.question,
      optionId: `CUSTOM: ${customLabel}`,
    };
    
    const updatedChoices = [...choices, newChoice];
    const updatedNodes = [...nodesHistory, currentChoiceNode];
    setChoices(updatedChoices);
    setNodesHistory(updatedNodes);

    if (updatedChoices.length < MAX_STEPS) {
      await fetchNextChoice(identity, updatedChoices);
    } else {
      setIsLoading(true);
      setStep("RESULT");
      try {
        const result = await simulateOutcome(identity, updatedChoices);
        const resultWithMeta: SimulationResultData = {
          ...result,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          identity: identity,
          fullChoiceHistory: updatedNodes.map((node, i) => ({
            node,
            choice: updatedChoices[i]
          }))
        };
        setCurrentResult(resultWithMeta);
        setAllResults((prev) => [...prev, resultWithMeta]);
      } catch (error) {
        console.error("Simulation failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRestart = () => {
    setStep("IDENTITY");
    setChoices([]);
    setNodesHistory([]);
    setCurrentChoiceNode(null);
    setCurrentResult(null);
  };

  const handleLoadResult = (result: SimulationResultData) => {
    if (!result.identity || !result.fullChoiceHistory) return;
    
    setIdentity(result.identity);
    setChoices(result.fullChoiceHistory.map(h => h.choice));
    setNodesHistory(result.fullChoiceHistory.map(h => h.node));
    setCurrentResult(result);
    setStep("RESULT");
    setShowComparison(false);
  };

  const handleBacktrack = async (nodeIndex: number) => {
    if (!identity) return;
    
    // Backtrack to the state BEFORE the choice at nodeIndex was made
    // So we keep choices up to nodeIndex - 1
    const newChoices = choices.slice(0, nodeIndex);
    const newNodesHistory = nodesHistory.slice(0, nodeIndex);
    
    setChoices(newChoices);
    setNodesHistory(newNodesHistory);
    setStep("NARRATIVE");
    setCurrentResult(null);
    
    // The current node to show is the one at nodeIndex
    setCurrentChoiceNode(nodesHistory[nodeIndex]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      {/* Background Particles Simulation (CSS only) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <main className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col">
        {/* Navigation / Header */}
        <header className="py-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl font-medium tracking-tight">分支人生 <span className="text-slate-500 font-light ml-1">Branching Life</span></h1>
          </div>
          {allResults.length > 0 && (
            <button
              onClick={() => setShowComparison(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-colors border border-white/10"
            >
              <HistoryIcon size={16} /> 路径历史 ({allResults.length})
            </button>
          )}
        </header>

        <div className="flex-1 flex flex-col justify-center py-12">
          <AnimatePresence mode="wait">
            {step === "WELCOME" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto text-center space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-medium tracking-tighter leading-none">
                    把抽象的未来<br />
                    <span className="text-emerald-500">压缩成旅程</span>
                  </h2>
                  <p className="text-xl text-slate-400 font-light max-w-xl mx-auto leading-relaxed">
                    这不是职业测评，而是一次沉浸式的选择实验。
                    在这里，你将亲眼见证每一个“如果”背后的五年人生。
                  </p>
                </div>
                <button
                  onClick={() => setStep("IDENTITY")}
                  className="group px-8 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 mx-auto"
                >
                  开启模拟 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === "IDENTITY" && (
              <IdentitySetup key="identity" onComplete={handleIdentityComplete} />
            )}

            {step === "NARRATIVE" && (
              <div key="narrative" className="w-full">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowEditor(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs text-slate-400 transition-colors border border-white/10"
                  >
                    <Edit3 size={14} /> 调整关键词
                  </button>
                </div>
                {isGeneratingChoice ? (
                  <div className="flex flex-col items-center justify-center py-24 space-y-6">
                    <BrainCircuit className="animate-pulse text-emerald-500" size={48} />
                    <div className="space-y-2 text-center">
                      <p className="text-xl font-medium text-white">正在构建下一个抉择...</p>
                      <p className="text-slate-500 text-sm">AI 正在根据你的身份和历史选择生成个性化剧情</p>
                    </div>
                  </div>
                ) : (
                  currentChoiceNode && (
                    <NarrativeNode
                      node={currentChoiceNode}
                      onChoice={handleChoice}
                      onRefresh={handleRefreshChoice}
                      onCustomChoice={handleCustomChoice}
                    />
                  )
                )}
                {/* Progress Bar */}
                <div className="max-w-md mx-auto mt-12">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                    <span>探索进度</span>
                    <span>{choices.length} / {MAX_STEPS}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(choices.length / MAX_STEPS) * 100}%` }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
                {showEditor && identity && (
                  <IdentityEditor
                    identity={identity}
                    onUpdate={(newId) => setIdentity(newId)}
                    onClose={() => setShowEditor(false)}
                  />
                )}
              </div>
            )}

            {step === "RESULT" && (
              <div key="result" className="w-full">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-24 space-y-6">
                    <Loader2 className="animate-spin text-emerald-500" size={48} />
                    <div className="space-y-2 text-center">
                      <p className="text-xl font-medium text-white">正在折叠时空...</p>
                      <p className="text-slate-500 text-sm">正在基于你的选择模拟五年后的生活状态</p>
                    </div>
                  </div>
                ) : (
                  currentResult && (
                    <SimulationResult
                      data={currentResult}
                      onRestart={handleRestart}
                      onBacktrack={handleBacktrack}
                      onCompare={() => setShowComparison(true)}
                    />
                  )
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="py-8 text-center text-slate-600 text-xs uppercase tracking-widest">
          © 2026 Branching Life • AI Powered Simulation Experiment
        </footer>
      </main>

      {/* Comparison Overlay */}
      <AnimatePresence>
        {showComparison && (
          <ComparisonView
            results={allResults}
            onLoadResult={handleLoadResult}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
