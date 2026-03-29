"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TransactionScenario, SimulationResult } from "@/lib/types";
import { BrainCircuit, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";

interface CenterPanelProps {
  isSimulating: boolean;
  scenario: TransactionScenario;
  result: SimulationResult | null;
}

export function CenterPanel({ isSimulating, scenario, result }: CenterPanelProps) {
  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-y-auto relative p-6 w-full max-w-2xl mx-auto shadow-2xl">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
            <BrainCircuit className="w-6 h-6 text-primary" />
            AI Simulation Engine
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Real-time fraud detection reasoning context</p>
        </div>
        {isSimulating && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
            <span className="text-xs text-primary font-medium tracking-wide">ANALYZING...</span>
          </div>
        )}
      </div>

      {!isSimulating && !result && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 mb-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-10 h-10 text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Ready to Simulate</h3>
          <p className="text-sm text-zinc-500 max-w-sm">
            Configure a transaction scenario on the left and click "Simulate Transaction" to watch the AI engine analyze the risk in real-time.
          </p>
        </div>
      )}

      {(isSimulating || result) && (
        <div className="flex flex-col gap-8 flex-1">
          {/* Main Hero: Score & Decision */}
          <div className="grid grid-cols-2 gap-6">
            <RiskMeter score={result?.score ?? 0} isSimulating={isSimulating} />
            <DecisionView result={result} isSimulating={isSimulating} />
          </div>

          {/* Breakdown & Story */}
          <div className="grid grid-cols-2 gap-8">
            <EvaluationSteps result={result} isSimulating={isSimulating} scenario={scenario} />
            <div className="flex flex-col gap-6">
              <ContributionBars result={result} isSimulating={isSimulating} />
              <FraudStory result={result} isSimulating={isSimulating} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RiskMeter({ score, isSimulating }: { score: number, isSimulating: boolean }) {
  const isSafe = score < 40;
  const isWarning = score >= 40 && score < 75;
  const color = isSafe ? "#22C55E" : isWarning ? "#FBBF24" : "#EF4444";
  
  return (
    <div className="flex flex-col items-center justify-center p-6 border border-border bg-zinc-900/40 rounded-2xl relative overflow-hidden">
      {!isSimulating && (
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundColor: color, filter: "blur(40px)" }} />
      )}
      <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-4">Risk Score</h3>
      <div className="relative flex items-center justify-center w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#2A2A2A" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="45" fill="none"
            stroke={isSimulating ? "#4A4A4A" : color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: isSimulating ? 283 : 283 - (283 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isSimulating ? (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-3xl font-bold font-mono text-zinc-400"
            >
              --
            </motion.span>
          ) : (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-4xl font-bold font-mono"
              style={{ color }}
            >
              {score}
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}

function DecisionView({ result, isSimulating }: { result: SimulationResult | null, isSimulating: boolean }) {
  if (isSimulating || !result) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-border bg-zinc-900/40 rounded-2xl h-full">
         <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
           <ShieldAlert className="w-12 h-12 text-zinc-600 mb-4 mx-auto" />
           <p className="text-zinc-500 font-medium text-sm">Evaluating risk pattern...</p>
         </motion.div>
      </div>
    );
  }

  const isSafe = result.level === "SAFE";
  const isWarning = result.level === "WARNING";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className={`flex flex-col items-center justify-center p-6 border rounded-2xl h-full relative overflow-hidden ${
        isSafe ? "border-status-safe/30 bg-status-safe/5" :
        isWarning ? "border-status-warning/30 bg-status-warning/5" :
        "border-status-fraud/30 bg-status-fraud/5"
      }`}
    >
      <div className={`absolute inset-0 opacity-20 filter blur-3xl `}
           style={{ backgroundColor: isSafe ? "#22C55E" : isWarning ? "#FBBF24" : "#EF4444" }} 
      />
      <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 relative z-10">AI Action Taken</h3>
      <div className="flex items-center gap-3 relative z-10">
        {isSafe ? <CheckCircle2 className="w-8 h-8 text-status-safe" /> :
         isWarning ? <AlertTriangle className="w-8 h-8 text-status-warning" /> :
         <AlertOctagon className="w-8 h-8 text-status-fraud" />
        }
        <span className={`text-2xl font-black tracking-tight ${
          isSafe ? "text-status-safe" : isWarning ? "text-status-warning" : "text-status-fraud"
        }`}>
          {result.decision}
        </span>
      </div>
    </motion.div>
  );
}

function EvaluationSteps({ result, isSimulating, scenario }: { result: SimulationResult | null, isSimulating: boolean, scenario: TransactionScenario }) {
  const steps = [
    { id: "behavior", label: "Behavior Verification", status: isSimulating ? "checking" : "done" },
    { id: "location", label: "Location Intelligence", status: isSimulating ? "checking" : "done" },
    { id: "device", label: "Device Fingerprinting", status: isSimulating ? "checking" : "done" },
    { id: "velocity", label: "Velocity Checks", status: isSimulating ? "checking" : "done" },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Inspection Layers</h3>
      <div className="flex flex-col gap-0 border-l px-4 border-border ml-2 relative">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pb-6 last:pb-0">
            <span className="absolute -left-[21px] top-1">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-600" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{step.label}</span>
              {isSimulating ? (
                <span className="text-xs text-primary mt-1 animate-pulse">Running heuristic...</span>
              ) : (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.2 }}
                  className="text-xs text-zinc-400 mt-1"
                >
                  Completed {idx === 1 && result?.level !== "SAFE" ? " • Anomaly Flagged" : " • Normal"}
                </motion.span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContributionBars({ result, isSimulating }: { result: SimulationResult | null, isSimulating: boolean }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Risk Modifiers</h3>
      <div className="flex flex-col gap-3">
        {["behavior", "location", "device"].map((key, idx) => {
          const val = result?.contributions?.[key as keyof typeof result.contributions] ?? 0;
          return (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400 capitalize">{key}</span>
                <span className="text-white font-mono">{isSimulating ? "--" : `+${val}`}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isSimulating ? 0 : `${val}%` }}
                  transition={{ delay: 0.5 + idx * 0.2, duration: 0.8 }}
                  className="h-full bg-zinc-500 rounded-full"
                  style={{ backgroundColor: val > 30 ? "#EF4444" : val > 15 ? "#FBBF24" : "#22C55E" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FraudStory({ result, isSimulating }: { result: SimulationResult | null, isSimulating: boolean }) {
  if (isSimulating || !result) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">AI Reasoning</h3>
      <div className="flex flex-col gap-2 p-4 bg-zinc-900/50 rounded-xl border border-border">
        {result.story.map((text, idx) => (
           <motion.p
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + idx * 0.3 }}
              className="text-sm text-zinc-300 flex leading-snug items-start gap-2"
           >
             <span className="text-primary mt-0.5">•</span>
             {text}
           </motion.p>
        ))}
      </div>
    </div>
  );
}
