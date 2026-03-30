import Image from "next/image";

// Keep existing imports for Crosshair, GameMode, clsx
import { Crosshair, Share2 } from "lucide-react";
import { GameMode } from "@/lib/types";
import { clsx } from "clsx";

interface NavbarProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  bounty: number;
}

export function Navbar({ gameMode, setGameMode, bounty }: NavbarProps) {
  return (
    <nav className="fixed top-0 inset-x-0 w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border bg-card/40 backdrop-blur-md z-50">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center justify-center bg-zinc-900 rounded-lg md:rounded-xl overflow-hidden shadow-inner shrink-0 w-8 h-8 md:w-10 md:h-10 border border-border">
          <img 
            src="/FraudShiled.png" 
            alt="FraudShield AI Logo" 
            className="w-6 h-6 md:w-8 md:h-8 object-contain"
            onError={(e) => {
              e.currentTarget.src = "/FraudShield.png";
            }}
          />
        </div>
        <div>
          <h1 className="text-base md:text-xl font-bold tracking-tight text-zinc-100">
            FraudShield <span className="text-primary font-medium">AI</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-medium hidden md:block">Interactive Fraud Scenario Simulator</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        {/* Game Mode Toggle */}
        <div className="flex bg-zinc-900/80 p-0.5 md:p-1 rounded-lg md:rounded-xl border border-border">
           <button 
             onClick={() => setGameMode("SIMULATOR")}
             className={clsx("px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-md md:rounded-lg transition-all", gameMode === "SIMULATOR" ? "bg-primary text-black" : "text-zinc-500 hover:text-zinc-300")}
           >
             <span className="hidden sm:inline">Simulator</span> Mode
             <span className="sm:hidden">Sim</span>
           </button>
           <button 
             onClick={() => setGameMode("ATTACKER")}
             className={clsx("px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-md md:rounded-lg transition-all flex items-center gap-1 md:gap-1.5", gameMode === "ATTACKER" ? "bg-red-500 text-white shadow-[0_0_15px_-3px_rgba(239,68,68,0.5)]" : "text-zinc-500 hover:text-zinc-300")}
           >
             <Crosshair className="w-3 h-3 md:w-3.5 md:h-3.5" /> 
             <span className="hidden sm:inline">Attacker</span> Mode
             <span className="sm:hidden">Atk</span>
           </button>
        </div>

        {gameMode === "ATTACKER" && (
           <div className="flex items-center gap-1 md:gap-2">
             <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)] min-w-[80px] md:min-w-[150px] justify-center">
               <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider hidden sm:inline">Total:</span>
               <span className="text-xs md:text-sm font-mono text-white font-black">${bounty.toLocaleString()}</span>
             </div>
             {bounty >= 50000 && (
               <button 
                 onClick={() => {
                   const text = encodeURIComponent(`I just cracked the FraudShield AI Neural Network and extracted $${bounty.toLocaleString()} using behavioral geospatial manipulation. Can you beat my high score?`);
                   window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                 }}
                 className="flex items-center justify-center bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white p-1.5 md:p-2 border border-[#1DA1F2]/50 shadow-[0_0_10px_-2px_rgba(29,161,242,0.5)] transition-all rounded-lg md:rounded-xl"
                 title="Share Heist on X"
               >
                 <Share2 className="w-3 h-3 md:w-4 md:h-4" />
               </button>
             )}
           </div>
        )}

        <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-status-safe/10 border border-status-safe/20">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-status-safe animate-pulse"></div>
          <span className="text-[10px] md:text-xs text-status-safe font-medium hidden sm:block">Online</span>
        </div>
      </div>
    </nav>
  );
}
