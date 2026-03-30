"use client";

import Link from "next/link";
import { Activity, Terminal, Crosshair, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative flex flex-col items-center justify-center">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-4xl px-4 md:px-6 py-20 md:py-0">
         <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-[0_0_40px_rgba(245,158,11,0.3)] flex items-center justify-center mb-4 relative p-3"
         >
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <img 
               src="/FraudShiled.png" 
               alt="FraudShield Logo" 
               className="w-full h-full object-contain relative z-10"
               onError={(e) => { e.currentTarget.src = "/FraudShiled.png"; }}
            />
         </motion.div>

         <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-6 md:mb-10 tracking-tighter"
         >
            FraudShield <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">AI</span>
         </motion.h1>

         <motion.h2 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-4xl font-bold text-zinc-100 tracking-tight mb-6 md:mb-8 max-w-3xl leading-tight"
         >
            Enter The Mind Of An <br className="hidden md:block" />
            <span className="text-zinc-400">AI Fraud Heuristic Engine.</span>
         </motion.h2>

         <motion.p 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-xl text-zinc-400 max-w-2xl mb-8 md:mb-12 px-4"
         >
            A high-fidelity cybersecurity simulator demonstrating real-time behavioral heuristics, entity tracking, and gamified threat resolution.
         </motion.p>

         <motion.div
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.6 }}
         >
            <Link 
              href="/simulator" 
              className="group relative inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-primary text-black font-bold uppercase tracking-widest text-xs md:text-sm rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            >
               <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
               <span className="relative flex items-center gap-2">
                 Initialize Simulator <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </span>
            </Link>
         </motion.div>

         {/* Mini feature tags */}
         <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-3 md:gap-4 mt-16 md:mt-24"
         >
            {[
               { icon: Activity, text: "Live Velocity" },
               { icon: Terminal, text: "Hack Mode" },
               { icon: Crosshair, text: "Dark Web Intel" }
            ].map((Feature, i) => (
               <div key={i} className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-zinc-500 bg-zinc-900/50 border border-zinc-800 px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-md">
                  <Feature.icon className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary" /> {Feature.text}
               </div>
            ))}
         </motion.div>
      </div>
    </div>
  );
}
