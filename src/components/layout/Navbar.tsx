import { ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            FraudShield <span className="text-primary font-medium">AI</span>
          </h1>
          <p className="text-xs text-zinc-500 font-medium">Interactive Fraud Scenario Simulator</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-safe/10 border border-status-safe/20">
          <div className="w-2 h-2 rounded-full bg-status-safe animate-pulse"></div>
          <span className="text-xs text-status-safe font-medium">System Online</span>
        </div>
      </div>
    </nav>
  );
}
