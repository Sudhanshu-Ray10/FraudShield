"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { LeftPanel } from "@/components/panels/LeftPanel";
import { CenterPanel } from "@/components/panels/CenterPanel";
import { RightPanel } from "@/components/panels/RightPanel";
import { TransactionScenario, SimulationResult, GameMode, PolicySettings } from "@/lib/types";
import { ShieldCheck, Activity } from "lucide-react";

export default function Home() {
  const [gameMode, setGameMode] = useState<GameMode>("SIMULATOR");
  const [policy, setPolicy] = useState<PolicySettings>({ strictness: 50, blockThreshold: 75, otpThreshold: 40 });

  const [scenario, setScenario] = useState<TransactionScenario>({
    id: "TXN-10293",
    sender: "Alice Smith",
    receiver: "Amazon Store",
    amount: 1540,
    location: "Pune",
    device: "Desktop",
    time: "Day",
    preset: "Normal Behavior",
    aiModel: "Fast Heuristics",
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const [sessionTxns, setSessionTxns] = useState<Record<string, Array<{ id: string, amount: number, location: string, status: string, date: string }>>>({});

  const updateScenario = (updates: Partial<TransactionScenario>) => {
    setScenario((prev) => ({ ...prev, ...updates }));
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setResult(null);

    // Simulate network and processing delay
    setTimeout(() => {
      // Basic mock logic based on active scenario values
      // Apply Policy strictness multiplier
      const strictnessMultiplier = 0.5 + (policy.strictness / 100); // 50% => 1x, 100% => 1.5x
      
      let baseScore = 10;
      let contributions = { behavior: 5, location: 2, device: 3 };
      let aiStory: string[] = [];

      if (scenario.amount > 10000) {
        baseScore += 35 * strictnessMultiplier;
        contributions.behavior += Math.floor(25 * strictnessMultiplier);
        aiStory.push(`Transaction amount ($${scenario.amount}) is significantly higher than user's average.`);
      } else {
        aiStory.push(`Transaction amount is within normal spending behavioral limits.`);
      }

      if (scenario.location !== "Pune") {
        baseScore += 25 * strictnessMultiplier;
        contributions.location += Math.floor(22 * strictnessMultiplier);
        aiStory.push(`User typically transacts from Pune, but current location is ${scenario.location}.`);
      }

      if (scenario.device !== "Desktop" && scenario.preset.includes("Stolen")) {
        baseScore += 20 * strictnessMultiplier;
        contributions.device += Math.floor(18 * strictnessMultiplier);
        aiStory.push(`Unrecognized device signature detected during checkout.`);
      }

      if (scenario.time === "Night" && baseScore > 30) {
        baseScore += 15 * strictnessMultiplier;
        contributions.behavior += Math.floor(10 * strictnessMultiplier);
        aiStory.push(`Unusual transaction timing correlating with high-risk pattern.`);
      }

      // AI Model overrides
      if (scenario.aiModel === "Strict Ruleset") {
         aiStory.push(`Strict Ruleset: Hard constraints applied.`);
         if (scenario.amount > 5000) baseScore += 20;
      } else if (scenario.aiModel === "Deep Neural Network") {
         aiStory.push(`Deep Learning: Complex pattern analysis engaged.`);
         if (scenario.preset.includes("Takeover")) baseScore += 30; // DNN catches subtle ATOs better
         if (scenario.preset === "Normal Behavior") baseScore -= 10; // DNN has fewer false positives
      } else {
         aiStory.push(`Fast Heuristics: Standard weighted logic applied.`);
      }

      // Cap score at 98
      const score = Math.floor(Math.min(baseScore, 98));

      let decision: SimulationResult["decision"] = "ALLOW";
      let level: SimulationResult["level"] = "SAFE";

      if (score >= policy.blockThreshold) {
        decision = "BLOCK TRANSACTION";
        level = "FRAUD";
      } else if (score >= policy.otpThreshold) {
        decision = "REQUIRE OTP";
        level = "WARNING";
      }

      const radarData = [
        { subject: "Location", A: Math.min(contributions.location * 3, 100), fullMark: 100 },
        { subject: "Velocity", A: scenario.amount > 5000 ? 80 : 20, fullMark: 100 },
        { subject: "Device", A: Math.min(contributions.device * 4, 100), fullMark: 100 },
        { subject: "Behavior", A: Math.min(contributions.behavior * 2, 100), fullMark: 100 },
        { subject: "Network", A: scenario.aiModel === "Deep Neural Network" ? 60 : 30, fullMark: 100 },
      ];

      setResult({
        score,
        level,
        decision,
        contributions,
        story: aiStory,
        radarData,
        stepsCompleted: true,
      });

      // Save transaction to the current session memory
      setSessionTxns(prev => ({
        ...prev,
        [scenario.sender]: [
          {
            id: scenario.id,
            amount: scenario.amount,
            location: scenario.location,
            status: level,
            date: "Just Now",
          },
          ...(prev[scenario.sender] || [])
        ]
      }));

      setIsSimulating(false);
    }, 1800);
  };

  const [tickerLogs, setTickerLogs] = useState<string[]>([]);

  useEffect(() => {
    // Generate random logs solely on client to avoid hydration mismatch
    const logs = [...Array(20)].map(() => 
      `[${Math.floor(Math.random()*90)+10}:${Math.floor(Math.random()*50)+10}] TXN-${Math.floor(Math.random()*9000)+1000} ${['Verified','Safe','Authorized'][Math.floor(Math.random() * 3)]}`
    );
    setTickerLogs(logs);
  }, []);

  return (
    <div className={`flex flex-col min-h-screen ${gameMode === "ATTACKER" ? "bg-red-950/10" : "bg-background"} transition-colors duration-1000 overflow-x-hidden relative`}>
      <Navbar gameMode={gameMode} setGameMode={setGameMode} />
      
      {/* 3-Panel Main Layout */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 pt-20 md:p-6 md:pt-24 lg:h-[calc(100vh-130px)]">
        
        {/* Left Panel: Scenario Editor (3 columns) */}
        <section className="col-span-1 md:col-span-2 lg:col-span-3 lg:h-[100%] max-h-full">
          <LeftPanel 
            scenario={scenario} 
            setScenario={updateScenario} 
            onSimulate={handleSimulate} 
            isSimulating={isSimulating}
            gameMode={gameMode}
            policy={policy}
            setPolicy={setPolicy}
          />
        </section>

        {/* Center Panel: Simulation Engine (6 columns) */}
        <section className="col-span-1 md:col-span-4 lg:col-span-6 relative z-10 lg:h-[100%] max-h-full">
          <CenterPanel 
            isSimulating={isSimulating} 
            scenario={scenario} 
            result={result} 
            gameMode={gameMode}
          />
        </section>

        {/* Right Panel: Context Details (3 columns) */}
        <section className="col-span-1 md:col-span-2 lg:col-span-3 lg:h-[100%] max-h-full">
          <RightPanel sender={scenario.sender} sessionTxns={sessionTxns[scenario.sender] || []} />
        </section>

      </main>

      {/* Live Background Ticker */}
      <div className="h-10 border-t border-border bg-black/60 backdrop-blur-md flex items-center overflow-hidden whitespace-nowrap px-4 w-full z-50">
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase shrink-0 mr-8">
           <Activity className="w-3.5 h-3.5 text-primary animate-pulse" /> Live Global Traffic
        </div>
        <div className="flex animate-[ticker_30s_linear_infinite]">
          {tickerLogs.map((log, i) => (
             <span key={i} className="mx-6 text-xs text-zinc-600 font-mono">
                {log}
             </span>
          ))}
        </div>
      </div>
    </div>
  );
}
