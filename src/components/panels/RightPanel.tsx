import { MOCK_PROFILE, MOCK_RECENT_TRANSACTIONS } from "@/lib/mockData";
import { User, Activity, ShieldCheck, MapPin, Smartphone, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function RightPanel() {
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
            <h3 className="text-lg font-semibold text-white">{MOCK_PROFILE.name}</h3>
            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-status-safe" /> Verified User
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-status-safe">{MOCK_PROFILE.trustScore}</span>
            <span className="text-[10px] uppercase text-zinc-500 tracking-wider">Trust Score</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-4 text-sm">
          <div>
            <span className="text-xs text-zinc-500 block mb-1">Avg Transaction</span>
            <span className="font-semibold text-white">${MOCK_PROFILE.avgAmount}</span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 block mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Usual Location
            </span>
            <span className="font-medium text-zinc-200">{MOCK_PROFILE.usualLocation}</span>
          </div>
          <div className="col-span-2 text-xs flex gap-2">
            <span className="text-zinc-500 flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> Trusted Devices:
            </span>
            <span className="text-zinc-300">{MOCK_PROFILE.trustedDevices.join(" • ")}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2 mb-4 uppercase tracking-wider">
          <Activity className="w-4 h-4 text-zinc-400" />
          Recent Behavior Snapshot
        </h3>
        
        <div className="flex flex-col gap-3">
          {MOCK_RECENT_TRANSACTIONS.map((txn, idx) => {
            const isSafe = txn.status === "SAFE";
            const StatusIcon = isSafe ? CheckCircle : txn.status === "WARNING" ? AlertTriangle : XCircle;

            return (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-border/50 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <StatusIcon className={cn("w-5 h-5", isSafe ? "text-status-safe" : "text-status-warning")} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">${txn.amount}</span>
                    <span className="text-xs text-zinc-500">{txn.location} • {txn.date}</span>
                  </div>
                </div>
                <div className="text-right">
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
