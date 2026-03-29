import { useMemo } from "react";
import { MOCK_PROFILES, MOCK_RECENT_TRANSACTIONS } from "@/lib/mockData";
import { User, Activity, ShieldCheck, MapPin, Smartphone, CheckCircle, AlertTriangle, XCircle, Radar } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RightPanelProps {
  sender: string;
  sessionTxns?: Array<{ id: string, amount: number, location: string, status: string, date: string }>;
}

export function RightPanel({ sender, sessionTxns = [] }: RightPanelProps) {
  const profile = useMemo(() => {
    if (MOCK_PROFILES[sender]) return MOCK_PROFILES[sender];
    if (!sender.trim()) return MOCK_PROFILES["Alice Smith"]; // Base fallback for totally empty input

    // Generate a highly consistent pseudo-random profile for ANY custom name
    const hash = Math.abs(sender.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
    
    let bestLoc = "Unregistered Zone";
    if (sessionTxns && sessionTxns.length > 0) {
       const locationFreq: Record<string, number> = {};
       sessionTxns.forEach(txn => {
         locationFreq[txn.location] = (locationFreq[txn.location] || 0) + 1;
       });
       let max = 0;
       for (const [loc, count] of Object.entries(locationFreq)) {
          if (count > max) { max = count; bestLoc = loc; }
       }
    }
    
    return {
      name: sender,
      trustScore: 40 + (hash % 60), // Between 40 and 99
      avgAmount: 100 + (hash % 5000), // Between 100 and 5100
      usualLocation: bestLoc,
      trustedDevices: ["Unknown Device Fingerprint"],
    };
  }, [sender, sessionTxns]);

  const transactions = [...sessionTxns, ...(MOCK_RECENT_TRANSACTIONS[sender] || [])];
  
  return (
    <div className="flex flex-col gap-6 h-full p-6 glass-card rounded-2xl overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <User className="w-5 h-5 text-primary" />
          Sender Profile
        </h2>
        <p className="text-sm text-zinc-400 mt-1">Historical context & trust metrics</p>
      </div>

      {/* User Profile Card */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-status-safe" /> Verified User
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className={cn(
               "text-2xl font-bold",
               profile.trustScore >= 80 ? "text-status-safe" : profile.trustScore >= 50 ? "text-status-warning" : "text-status-fraud"
            )}>
              {profile.trustScore}
            </span>
            <span className="text-[10px] uppercase text-zinc-500 tracking-wider">Trust Score</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-4 text-sm">
          <div>
            <span className="text-xs text-zinc-500 block mb-1">Avg Transaction</span>
            <span className="font-semibold text-white">${profile.avgAmount}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 block mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Usual Location
            </span>
            <span className="font-medium text-zinc-200">{profile.usualLocation}</span>
          </div>
          <div className="col-span-2 text-xs flex gap-2">
            <span className="text-zinc-500 flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> Trusted Devices:
            </span>
            <span className="text-zinc-300">{profile.trustedDevices.join(" • ")}</span>
          </div>
        </div>
      </div>
      
      {/* Mini Geographic Radar */}
      <div className="mt-2 p-4 rounded-xl border border-border/50 bg-black/40 relative overflow-hidden flex items-center justify-between">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0,transparent_70%)] opacity-50 pointer-events-none" />
         <div className="flex flex-col justify-center gap-1 relative z-10">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5"><Radar className="w-3.5 h-3.5 text-primary" /> Geo-Radar Active</h4>
            <p className="text-[10px] text-zinc-500">Monitoring login anomalies</p>
         </div>
         <div className="w-10 h-10 border border-primary/20 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 border border-primary/40 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
            <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_2px_rgba(245,158,11,0.8)]" />
         </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2 mb-4 uppercase tracking-wider">
          <Activity className="w-4 h-4 text-zinc-400" />
          Recent Behavior Snapshot
        </h3>
        
        <div className="flex flex-col gap-3">
          {transactions.map((txn, idx) => {
            const isSafe = txn.status === "SAFE";
            const StatusIcon = isSafe ? CheckCircle : txn.status === "WARNING" ? AlertTriangle : XCircle;

            return (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-border/50 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <StatusIcon className={cn("w-5 h-5", isSafe ? "text-status-safe" : txn.status === "WARNING" ? "text-status-warning" : "text-status-fraud")} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">${txn.amount}</span>
                    <span className="text-[11px] text-zinc-500">{txn.location} • {txn.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {transactions.length === 0 && (
             <p className="text-zinc-500 text-xs italic text-center py-4">No recent history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
