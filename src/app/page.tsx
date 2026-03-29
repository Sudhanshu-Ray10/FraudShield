"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { LeftPanel } from "@/components/panels/LeftPanel";
import { CenterPanel } from "@/components/panels/CenterPanel";
import { RightPanel } from "@/components/panels/RightPanel";
import { TransactionScenario, SimulationResult } from "@/lib/types";
import { SCENARIO_PRESETS } from "@/lib/mockData";

export default function Home() {
  const [scenario, setScenario] = useState<TransactionScenario>({
    id: "TXN-10293",
    sender: "Alice Smith",
    receiver: "Amazon Store",
    amount: 1540,
    location: "Pune",
    device: "Desktop",
    time: "Day",
    preset: "Normal Behavior",
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const updateScenario = (updates: Partial<TransactionScenario>) => {
    setScenario((prev) => ({ ...prev, ...updates }));
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setResult(null);

    // Simulate network and processing delay
    setTimeout(() => {
      // Basic mock logic based on active scenario values
      let score = 10;
      let aiStory: string[] = [];
      let contributions = { behavior: 5, location: 2, device: 3 };

      if (scenario.amount > 10000) {
        score += 35;
        contributions.behavior += 25;
        aiStory.push(`Transaction amount ($${scenario.amount}) is significantly higher than user's average.`);
      } else {
        aiStory.push(`Transaction amount is within normal spending behavioral limits.`);
      }

      if (scenario.location !== "Pune") {
        score += 25;
        contributions.location += 22;
        aiStory.push(`User typically transacts from Pune, but current location is ${scenario.location}.`);
      }

      if (scenario.device !== "Desktop" && scenario.preset.includes("Stolen")) {
        score += 20;
        contributions.device += 18;
        aiStory.push(`Unrecognized device signature detected during checkout.`);
      }

      if (scenario.time === "Night" && score > 30) {
        score += 15;
        contributions.behavior += 10;
        aiStory.push(`Unusual transaction timing correlating with high-risk pattern.`);
      }

      // Cap score at 98
      score = Math.min(score, 98);

      let decision: SimulationResult["decision"] = "ALLOW";
      let level: SimulationResult["level"] = "SAFE";

      if (score >= 75) {
        decision = "BLOCK TRANSACTION";
        level = "FRAUD";
      } else if (score >= 40) {
        decision = "REQUIRE OTP";
        level = "WARNING";
      }

      setResult({
        score,
        level,
        decision,
        contributions,
        story: aiStory,
        stepsCompleted: true,
      });
      setIsSimulating(false);
    }, 1800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* 3-Panel Main Layout */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 lg:h-[calc(100vh-73px)]">
        
        {/* Left Panel: Scenario Editor (3 columns) */}
        <section className="col-span-1 md:col-span-2 lg:col-span-3 lg:h-full">
          <LeftPanel 
            scenario={scenario} 
            setScenario={updateScenario} 
            onSimulate={handleSimulate} 
            isSimulating={isSimulating}
          />
        </section>

        {/* Center Panel: Simulation Engine (6 columns) */}
        <section className="col-span-1 md:col-span-4 lg:col-span-6 relative z-10 lg:h-full">
          <CenterPanel 
            isSimulating={isSimulating} 
            scenario={scenario} 
            result={result} 
          />
        </section>

        {/* Right Panel: Context Details (3 columns) */}
        <section className="col-span-1 md:col-span-2 lg:col-span-3 lg:h-full">
          <RightPanel />
        </section>

      </main>
    </div>
  );
}
