import { useMemo, useEffect, useState } from "react";
import { MOCK_PROFILES, MOCK_RECENT_TRANSACTIONS } from "@/lib/mockData";
import { User, Activity, ShieldCheck, MapPin, Smartphone, CheckCircle, AlertTriangle, XCircle, Radar, Download } from "lucide-react";
import { CyberGlobe, ArcData, RingData } from "@/components/ui/CyberGlobe";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RightPanelProps {
  sender: string;
  sessionTxns?: Array<{ id: string, amount: number, location: string, status: string, date: string }>;
}

const LOCATIONS: Record<string, [number, number]> = {
  "Pune": [18.5204, 73.8567],
  "Mumbai": [19.0760, 72.8777],
  "New York": [40.7128, -74.0060],
  "London": [51.5074, -0.1278],
  "Tokyo": [35.6762, 139.6503],
  "San Francisco": [37.7749, -122.4194],
  "Unknown/VPN": [35.0, -40.0] // Ocean
};
const SERVER_LOC = [37.7749, -122.4194]; // San Francisco Default HQ

export function RightPanel({ sender, sessionTxns = [] }: RightPanelProps) {
  const isCompromised = ["john doe", "attacker", "hacker", "scammer"].includes(sender.toLowerCase().trim());

  const profile = useMemo(() => {
    if (MOCK_PROFILES[sender] && !isCompromised) return MOCK_PROFILES[sender];
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
      trustScore: isCompromised ? 12 + (hash % 10) : 40 + (hash % 60), 
      avgAmount: 100 + (hash % 5000), // Between 100 and 5100
      usualLocation: bestLoc,
      trustedDevices: ["Unknown Device Fingerprint"],
    };
  }, [sender, sessionTxns, isCompromised]);

  const transactions = [...sessionTxns, ...(MOCK_RECENT_TRANSACTIONS[sender] || [])];
  
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Transaction ID,Amount,Location,AI Decision,Date\n";
    transactions.forEach(row => {
      csvContent += `${row.id},$${row.amount},${row.location},${row.status},${row.date.replace(/,/g, "")}\n`;
    });
    
    csvContent += `\nProfile Investigation Target\n`;
    csvContent += `Name,${profile.name}\n`;
    csvContent += `Trust Score,${profile.trustScore}\n`;
    csvContent += `Avg Spend,$${profile.avgAmount}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fraud_audit_${sender.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [arcs, setArcs] = useState<ArcData[]>([]);
  const [rings, setRings] = useState<RingData[]>([]);

  // Track new real-time attacks natively
  useEffect(() => {
     if (sessionTxns && sessionTxns.length > 0) {
        const latestTxn = sessionTxns[0]; 
        const loc = LOCATIONS[latestTxn.location] || [0, 0];
        
        // Define color based on actual simulation outcome
        const color = latestTxn.status === "SAFE" ? "rgba(34, 197, 94, 0.8)" : 
                      latestTxn.status === "FRAUD" ? "rgba(239, 68, 68, 0.9)" : 
                      "rgba(245, 158, 11, 0.7)";
        
        const newArc = { startLat: loc[0], startLng: loc[1], endLat: SERVER_LOC[0], endLng: SERVER_LOC[1], color };
        const newRing = { lat: loc[0], lng: loc[1], color };
        
        setArcs(prev => [...prev, newArc]);
        setRings(prev => [...prev, newRing]);
        
        // Let the effect fade naturally by tearing down after 3 seconds
        setTimeout(() => {
           setArcs(prev => prev.filter(a => a !== newArc));
           setRings(prev => prev.filter(r => r !== newRing));
        }, 3000);
     }
  }, [sessionTxns]);

  // Generate generic global background noise
  useEffect(() => {
    const bgInterval = setInterval(() => {
       const keys = Object.keys(LOCATIONS);
       const randomTarget = keys[Math.floor(Math.random() * keys.length)];
       const loc = LOCATIONS[randomTarget] || [0, 0];
       
       const newArc = { startLat: loc[0], startLng: loc[1], endLat: SERVER_LOC[0], endLng: SERVER_LOC[1], color: "rgba(255, 255, 255, 0.05)" };
       setArcs(prev => [...prev, newArc]);
       
       setTimeout(() => setArcs(prev => prev.filter(a => a !== newArc)), 2000);
    }, 1800);
    return () => clearInterval(bgInterval);
  }, []);
  
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
            {isCompromised ? (
              <p className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-1.5 bg-red-500/10 px-2 py-1 rounded w-fit border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                <AlertTriangle className="w-3.5 h-3.5" /> Dark Web Leak Detected
              </p>
            ) : (
              <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-status-safe" /> Verified User
              </p>
            )}
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
      
      {/* Interactive 3D Cyber Globe WebGL Overlay */}
      <div className="mt-2 w-full">
         <CyberGlobe arcs={arcs} rings={rings} />
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

          {transactions.length > 0 && (
            <button 
              onClick={exportToCSV}
              className="w-full mt-2 py-2.5 bg-zinc-900 border border-border rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 group"
            >
              <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              Export Audit Log (.CSV)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
