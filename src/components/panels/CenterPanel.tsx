"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransactionScenario, SimulationResult, GameMode } from "@/lib/types";
import { BrainCircuit, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, AlertOctagon, Zap, Terminal, MapPin, Network, Radar as RadarIcon, ScrollText, Smartphone } from "lucide-react";
import { clsx } from "clsx";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface CenterPanelProps {
  isSimulating: boolean;
  scenario: TransactionScenario;
  result: SimulationResult | null;
  gameMode: GameMode;
}

type TabKey = "overview" | "radar" | "geo" | "graph";

export function CenterPanel({ isSimulating, scenario, result, gameMode }: CenterPanelProps) {
  const isFraud = result?.level === "FRAUD";
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [otpBypassed, setOtpBypassed] = useState(false);

  useEffect(() => {
    if (isSimulating) setOtpBypassed(false);
  }, [isSimulating]);
  
  return (
    <motion.div 
      initial={false}
      animate={{ 
        x: isFraud ? [-10, 10, -10, 10, 0] : 0,
        boxShadow: isFraud ? "0 0 40px rgba(239,68,68,0.3)" : "0 25px 50px -12px rgba(0,0,0,0.25)"
      }}
      transition={{ duration: 0.4 }}
      className={clsx(
        "flex flex-col h-full bg-card rounded-2xl border overflow-y-auto relative p-6 w-full max-w-2xl xl:max-w-4xl mx-auto shadow-2xl transition-colors", 
        isFraud ? "border-status-fraud/50 bg-status-fraud/5" : "border-border"
      )}
    >
      <div className={clsx(
         "absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent to-transparent",
         isFraud ? "via-status-fraud" : "via-primary/50",
         isSimulating && "animate-[pulse_1s_ease-in-out_infinite]"
      )} />
      
      <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4 shrink-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white">
            <BrainCircuit className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            AI Simulation Engine
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">Real-time fraud detection reasoning context</p>
        </div>
        {isSimulating && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
            <span className="text-[10px] md:text-xs text-primary font-medium tracking-wide">ANALYZING...</span>
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
        <div className="flex flex-col gap-6 flex-1 min-h-[500px] lg:min-h-[600px]">
          
          {/* Main Hero: Score & Decision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 shrink-0">
            <RiskMeter score={result?.score ?? 0} isSimulating={isSimulating} />
            <DecisionView result={result} isSimulating={isSimulating} />
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 md:gap-2 border-b border-border mt-2 shrink-0 overflow-x-auto pb-1 hide-scrollbar">
             {[
               { id: "overview", label: "Parse", icon: Zap },
               { id: "radar", label: "Radar", icon: RadarIcon },
               { id: "geo", label: "Geo", icon: MapPin },
               { id: "graph", label: "Graph", icon: Network },
             ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as TabKey)}
                  className={clsx(
                    "flex flex-none items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all relative rounded-t-lg",
                    activeTab === t.id ? "text-primary bg-primary/10" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                  )}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                  {activeTab === t.id && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />
                  )}
                </button>
             ))}
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 relative min-h-[400px] md:min-h-[500px] overflow-hidden lg:overflow-visible">
             <AnimatePresence mode="wait">
               
               {activeTab === "overview" && (
                 <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:absolute lg:inset-0">
                    <div className="flex flex-col">
                       <EvaluationSteps result={result} isSimulating={isSimulating} scenario={scenario} />
                       <div className="mt-8">
                         <FraudStory result={result} isSimulating={isSimulating} />
                       </div>
                    </div>
                    <ContributionBars result={result} isSimulating={isSimulating} />
                 </motion.div>
               )}

               {activeTab === "radar" && (
                 <motion.div key="radar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center w-full h-[300px] md:h-full lg:absolute lg:inset-0">
                    {!isSimulating && result ? (
                       <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.radarData}>
                           <PolarGrid stroke="#3f3f46" />
                           <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                           <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                           <Radar name="Risk Attributes" dataKey="A" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} isAnimationActive={true} />
                         </RadarChart>
                       </ResponsiveContainer>
                    ) : (
                       <div className="flex flex-col items-center gap-3 text-zinc-500">
                          <RadarIcon className="w-8 h-8 animate-spin" />
                          <span className="text-xs uppercase tracking-widest">Mapping Multi-Dimensional Risk...</span>
                       </div>
                    )}
                 </motion.div>
               )}

               {activeTab === "geo" && (
                 <motion.div key="geo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full h-[300px] md:h-full flex items-center justify-center lg:absolute lg:inset-0 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden relative">
                    <GeoAnomalyMap result={result} isSimulating={isSimulating} scenario={scenario} />
                 </motion.div>
               )}

               {activeTab === "graph" && (
                 <motion.div key="graph" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full h-[300px] md:h-full flex items-center justify-center lg:absolute lg:inset-0">
                    <EntityRiskGraph result={result} isSimulating={isSimulating} scenario={scenario} />
                 </motion.div>
               )}
               
             </AnimatePresence>
          </div>

          <TerminalFeed isSimulating={isSimulating} scenario={scenario} />

          {/* OTP Modal Overlay for Phase 2 */}
          <AnimatePresence>
            {!isSimulating && result?.decision === "REQUIRE OTP" && !otpBypassed && (
              <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 rounded-2xl"
              >
                <div className="bg-zinc-950 border border-status-warning/50 rounded-2xl p-6 w-[320px] md:w-[380px] shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-status-warning" />
                  <Smartphone className="w-10 h-10 text-status-warning mb-4 animate-[bounce_2s_infinite]" />
                  <h3 className="text-xl font-bold text-white mb-2">2FA Required</h3>
                  <p className="text-xs text-zinc-400 mb-6">A verification code has been sent to the registered mobile device.</p>
                  
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                       <div key={i} className="w-10 h-12 bg-zinc-900 border border-zinc-700 rounded-lg text-xl flex items-center justify-center font-bold text-zinc-600 shadow-inner">—</div>
                    ))}
                  </div>

                  {gameMode === "ATTACKER" ? (
                    <button 
                      onClick={() => setOtpBypassed(true)}
                      className="w-full py-2.5 bg-red-500/10 text-red-500 border border-red-500/50 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 group"
                    >
                      <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Simulate SS7 Intercept
                    </button>
                  ) : (
                    <button disabled className="w-full py-2.5 bg-zinc-800 text-zinc-500 rounded-lg text-sm font-bold uppercase tracking-wider cursor-not-allowed border border-zinc-700/50">
                      Waiting for user...
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </motion.div>
  );
}

// -------------------------------------------------------------
// Component Visuals Below
// -------------------------------------------------------------

function TerminalFeed({ isSimulating, scenario }: { isSimulating: boolean, scenario: TransactionScenario }) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isSimulating) return;
    setLogs([]);
    
    const lines = [
      `> INITIATING FRAUD_ANALYSIS_ENGINE_v4.2.1 [PID: ${scenario.id || 'SYS'}]`,
      `> IMPORTING ATTRIBUTES: SENDER=${scenario.sender || 'Unknown'}, AMT=$${scenario.amount || 0}`,
      `> EXECUTING [${(scenario.aiModel || "System").toUpperCase()}] MODEL PIPELINE...`,
      `... Pinging Geo-DB for IP origin match -> EXPECTED: Pune | ACTUAL: ${scenario.location || 'Unknown'}`,
      `... Checking device fingerprint hash [${(scenario.device || "Unknown").toUpperCase()}] against trusted keys`,
      `... Analyzing velocity bounds over 24-hour lookback window`,
      `> EXTRACTING HIDDEN VECTORS... DONE.`,
      `> COMPILING RISK SCORE AND FLUSHING CACHE...`
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < lines.length) {
        const nextLine = lines[current];
        if (nextLine !== undefined) {
           setLogs(prev => [...prev, nextLine]);
        }
        current++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isSimulating, scenario]);

  if (!isSimulating && logs.length === 0) return null;

  return (
    <div className="bg-black/80 border border-zinc-800 rounded-lg p-3 w-full shrink-0 font-mono text-[10px] md:text-xs">
       <div className="flex items-center gap-2 mb-2 text-zinc-500 border-b border-zinc-800 pb-1">
         <Terminal className="w-3 h-3" /> Terminal Output
       </div>
       <div className="flex flex-col gap-1 h-32 overflow-y-auto w-full">
         {logs.map((log, i) => {
           if (!log) return null;
           return (
             <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={log.includes("EXPECTED") || log.includes("ACTUAL") ? "text-primary" : "text-green-500"}>
               {log}
             </motion.div>
           );
         })}
         {isSimulating && (
           <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-3 bg-green-500 mt-1" />
         )}
       </div>
    </div>
  );
}

function RiskMeter({ score, isSimulating }: { score: number, isSimulating: boolean }) {
  const isSafe = score < 40;
  const isWarning = score >= 40 && score < 75;
  const color = isSafe ? "#22C55E" : isWarning ? "#FBBF24" : "#EF4444";
  
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 border border-border bg-zinc-900/40 rounded-2xl relative overflow-hidden h-[180px]">
      {!isSimulating && (
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundColor: color, filter: "blur(40px)" }} />
      )}
      <h3 className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-4 z-10">Risk Score</h3>
      <div className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32">
        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {isSimulating ? (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-2xl md:text-3xl font-bold font-mono text-zinc-400"
            >
              --
            </motion.span>
          ) : (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold font-mono"
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
      <div className="flex flex-col items-center justify-center p-6 border border-border bg-zinc-900/40 rounded-2xl h-[180px]">
         <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex flex-col items-center">
           <ShieldAlert className="w-8 h-8 md:w-12 md:h-12 text-zinc-600 mb-4" />
           <p className="text-zinc-500 font-medium text-xs md:text-sm">Evaluating risk pattern...</p>
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
      className={`flex flex-col items-center justify-center p-6 border rounded-2xl h-[180px] relative overflow-hidden ${
        isSafe ? "border-status-safe/30 bg-status-safe/5" :
        isWarning ? "border-status-warning/30 bg-status-warning/5" :
        "border-status-fraud/30 bg-status-fraud/5"
      }`}
    >
      <div className={`absolute inset-0 opacity-20 filter blur-3xl `}
           style={{ backgroundColor: isSafe ? "#22C55E" : isWarning ? "#FBBF24" : "#EF4444" }} 
      />
      <h3 className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 relative z-10">AI Action Taken</h3>
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 relative z-10 text-center md:text-left">
        {isSafe ? <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-status-safe" /> :
         isWarning ? <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-status-warning" /> :
         <AlertOctagon className="w-6 h-6 md:w-8 md:h-8 text-status-fraud" />
        }
        <span className={`text-xl md:text-2xl font-black tracking-tight ${
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
    { id: "behavior", label: "Behavior Analysis" },
    { id: "location", label: "IP/Location Identity" },
    { id: "device", label: "Device Fingerprint" },
    { id: "velocity", label: "Transaction Velocity" },
  ];

  return (
    <div className="flex flex-col w-full h-full justify-center">
      <h3 className="text-[10px] md:text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-6 flex items-center gap-2">
         <Zap className="w-3.5 h-3.5 text-primary" /> XAI Deep Parse
      </h3>
      <div className="flex space-x-1 md:space-x-2 relative w-full h-full align-middle mt-4">
        {/* Horizontal Node Graph connecting lines */}
        <div className="absolute top-[6px] md:top-[12px] left-[10%] right-[10%] h-[2px] bg-zinc-800 rounded-full z-0 overflow-hidden">
           {isSimulating && (
              <motion.div 
                 className="h-full bg-primary"
                 initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
           )}
        </div>

        {/* Nodes */}
        {steps.map((step, idx) => {
          let nodeStatus = "idle";
          if (isSimulating) nodeStatus = "checking";
          else if (result) {
            const val = result.contributions[step.id as keyof typeof result.contributions] || 0;
            nodeStatus = val > 15 ? "flagged" : "safe";
            if (step.id === "velocity") nodeStatus = result.score > 80 ? "flagged" : "safe";
          }

          const isFlagged = nodeStatus === "flagged";
          const isSafe = nodeStatus === "safe";

          return (
            <div key={idx} className="flex-1 flex flex-col items-center relative z-10 group mt-[-8px]">
              <div className="relative">
                 {isSimulating && (
                    <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: idx * 0.2 }} className="absolute inset-[-6px] md:inset-[-10px] rounded-full bg-primary/20 blur-sm" />
                 )}
                 {isFlagged && <div className="absolute inset-[-10px] md:inset-[-15px] rounded-full bg-status-fraud/30 blur-md animate-pulse" />}
                 
                 <div className={clsx(
                    "w-[12px] h-[12px] md:w-[16px] md:h-[16px] rounded-full border-[3px] md:border-[4px] shadow-lg transition-all duration-500 relative z-10",
                    isSimulating ? "bg-card border-primary" : 
                    isFlagged ? "bg-status-fraud border-status-fraud" : 
                    isSafe ? "bg-status-safe border-status-safe" : "bg-zinc-900 border-zinc-600"
                 )}></div>
              </div>

              <div className="mt-4 md:mt-6 flex flex-col items-center text-center">
                <span className="text-[9px] md:text-[10px] uppercase font-bold text-zinc-400 max-w-[50px] md:max-w-auto break-words group-hover:text-zinc-200 transition-colors leading-tight px-1">{step.label}</span>
                {!isSimulating && result && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + idx * 0.1 }}
                    className={clsx("text-[8px] md:text-[9px] mt-2 px-1.5 py-0.5 rounded uppercase font-mono tracking-widest", isFlagged ? "bg-status-fraud/20 text-status-fraud" : "bg-status-safe/10 text-status-safe/60")}
                  >
                    {isFlagged ? "ANOMALY" : "PASS"}
                  </motion.span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContributionBars({ result, isSimulating }: { result: SimulationResult | null, isSimulating: boolean }) {
  return (
    <div className="w-full">
      <h3 className="text-[10px] md:text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4 border-b border-border pb-2">Risk Modifiers Breakdown</h3>
      <div className="flex flex-col gap-4">
        {["behavior", "location", "device"].map((key, idx) => {
          const val = result?.contributions?.[key as keyof typeof result.contributions] ?? 0;
          return (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-400 capitalize font-medium">{key} Identity</span>
                <span className={clsx("font-mono font-bold", val > 15 ? "text-status-warning" : val > 30 ? "text-status-fraud" : "text-white")}>
                   {isSimulating ? "--" : `+${val}`}
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isSimulating ? 0 : `${val * 1.5}%` }}
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
      <h3 className="text-[10px] md:text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
         <ScrollText className="w-3.5 h-3.5" /> AI Engine Summary Narrative
      </h3>
      <div className="flex flex-col gap-2 p-3 bg-zinc-900/50 rounded-lg border border-border">
        {result.story.map((text, idx) => (
           <motion.p
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + idx * 0.3 }}
              className="text-xs md:text-sm text-zinc-300 flex leading-snug items-start gap-2"
           >
             <span className="text-primary mt-[2px] opacity-70">▹</span>
             <span className="flex-1">{text}</span>
           </motion.p>
        ))}
      </div>
    </div>
  );
}

/* 
 * Fake GeoMap component using SVG constraints
 */
function GeoAnomalyMap({ result, isSimulating, scenario }: { result: SimulationResult | null, isSimulating: boolean, scenario: TransactionScenario }) {
  if (isSimulating || !result) return (
     <div className="flex items-center gap-2 text-zinc-500"><MapPin className="w-6 h-6 animate-bounce" /> Processing geospatial tensors...</div>
  );

  const isAnomaly = scenario.location !== "Pune";
  
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Decorative Grid SVG background resembling map borders */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,20 Q50,40 100,20 M0,50 Q50,70 100,50 M0,80 Q50,100 100,80" stroke="#FFF" strokeWidth="0.5" fill="none" />
        <path d="M20,0 Q40,50 20,100 M50,0 Q70,50 50,100 M80,0 Q100,50 80,100" stroke="#FFF" strokeWidth="0.5" fill="none" />
      </svg>
      
      {/* The Map visualization */}
      <div className="relative w-[300px] h-[150px] md:w-[400px] md:h-[200px] bg-black/40 border border-zinc-800 rounded-2xl flex items-center justify-center z-10 overflow-hidden shadow-2xl">
         
         {/* Pune Node (Origin) */}
         <div className="absolute left-[20%] top-[40%] flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-status-safe relative z-10 shadow-[0_0_10px_#22C55E]"></div>
            <span className="text-[10px] text-zinc-400 font-mono mt-1">Origin (Pune)</span>
         </div>

         {/* Target Node */}
         <div className="absolute right-[20%] top-[60%] flex flex-col items-center">
            <div className={clsx("w-3 h-3 rounded-full relative z-10 shadow-lg", isAnomaly ? "bg-status-fraud shadow-status-fraud" : "bg-status-safe shadow-status-safe")}></div>
            <span className="text-[10px] text-zinc-400 font-mono mt-1 pr-4">{scenario.location}</span>
         </div>

         {/* Connection Line */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            <motion.path 
              d={`M ${80} ${60} Q ${200} ${90} ${320} ${120}`} 
              fill="none" 
              stroke={isAnomaly ? "#EF4444" : "#22C55E"} 
              strokeWidth="2" 
              strokeDasharray={isAnomaly ? "4,6" : "0"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            {isAnomaly && (
              <motion.circle 
                r="4" fill="#EF4444"
                animate={{
                   offsetDistance: ["0%", "100%"]
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{ offsetPath: `path('M 80 60 Q 200 90 320 120')` } as any}
              />
            )}
         </svg>
      </div>
      
      <div className="absolute bottom-4 left-4 right-4 text-center">
         <span className={clsx("text-xs font-mono font-medium tracking-wide", isAnomaly ? "text-status-fraud" : "text-status-safe")}>
            {isAnomaly ? "GEO ANOMALY DETECTED: UNUSUAL DISTANCE SKEW" : "GEO BEHAVIOR VERIFIED: STANDARD DISTANCE"}
         </span>
      </div>
    </div>
  );
}

/* 
 * Fake Entity Risk Graph using SVG
 */
function EntityRiskGraph({ result, isSimulating, scenario }: { result: SimulationResult | null, isSimulating: boolean, scenario: TransactionScenario }) {
   if (isSimulating || !result) return (
     <div className="flex items-center gap-2 text-zinc-500"><Network className="w-6 h-6 animate-pulse" /> Mapping entity relationships...</div>
   );

   const deviceAnomaly = result.contributions.device > 15;
   const locationAnomaly = result.contributions.location > 15;
   const behaviorAnomaly = result.contributions.behavior > 15;

   return (
      <div className="relative w-full h-full bg-zinc-950/50 rounded-2xl flex flex-col items-center justify-center border border-zinc-800 p-6 overflow-hidden">
         <svg className="absolute inset-0 w-full h-full opacity-40">
           {/* Center to Top Left (Device) */}
           <motion.line x1="50%" y1="50%" x2="25%" y2="25%" stroke={deviceAnomaly ? "#EF4444" : "#22C55E"} strokeWidth="2" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} />
           {/* Center to Top Right (Location) */}
           <motion.line x1="50%" y1="50%" x2="75%" y2="25%" stroke={locationAnomaly ? "#EF4444" : "#22C55E"} strokeWidth="2" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}} />
           {/* Center to Bottom (Behavior) */}
           <motion.line x1="50%" y1="50%" x2="50%" y2="80%" stroke={behaviorAnomaly ? "#EF4444" : "#22C55E"} strokeWidth="2" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}} />
         </svg>

         {/* Center Node (User) */}
         <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
           <div className="w-12 h-12 bg-zinc-800 rounded-full border-2 border-zinc-500 flex items-center justify-center shrink-0">
             <span className="text-white font-bold text-xs">{scenario.sender.charAt(0)}</span>
           </div>
           <span className="text-[10px] text-zinc-300 font-mono mt-1 bg-black/50 px-2 py-0.5 rounded">USR: {scenario.sender}</span>
         </motion.div>

         {/* Device Node */}
         <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2}} className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
           <div className={clsx("w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg", deviceAnomaly ? "bg-status-fraud/20 border-status-fraud" : "bg-status-safe/20 border-status-safe")}></div>
           <span className="text-[10px] text-zinc-400 font-mono mt-1">DEV: {scenario.device}</span>
         </motion.div>

         {/* Location Node */}
         <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.4}} className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
           <div className={clsx("w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg", locationAnomaly ? "bg-status-fraud/20 border-status-fraud" : "bg-status-safe/20 border-status-safe")}></div>
           <span className="text-[10px] text-zinc-400 font-mono mt-1">GEO: {scenario.location}</span>
         </motion.div>

         {/* Behavior Node */}
         <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.6}} className="absolute top-[80%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
           <div className={clsx("w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg", behaviorAnomaly ? "bg-status-fraud/20 border-status-fraud text-status-fraud" : "bg-status-safe/20 border-status-safe")}></div>
           <span className="text-[10px] text-zinc-400 font-mono mt-1">VEL: ${scenario.amount}</span>
         </motion.div>
      </div>
   );
}
