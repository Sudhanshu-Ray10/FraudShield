"use client";

import { useState, useEffect } from "react";
import { Copy, RefreshCw, Hand, ShieldAlert, CreditCard, Crosshair } from "lucide-react";
import { TransactionScenario, DeviceType, TimeOfDay } from "@/lib/types";
import { LOCATIONS, SCENARIO_PRESETS, MOCK_RECEIVERS, MOCK_USERS } from "@/lib/mockData";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LeftPanelProps {
  scenario: TransactionScenario;
  setScenario: (updates: Partial<TransactionScenario>) => void;
  onSimulate: () => void;
  isSimulating: boolean;
}

export function LeftPanel({ scenario, setScenario, onSimulate, isSimulating }: LeftPanelProps) {
  const [txnId, setTxnId] = useState("TXN-10293");

  useEffect(() => {
    setTxnId(`TXN-${Math.floor(Math.random() * 90000) + 10000}`);
  }, []);

  const handlePresetSelect = (presetName: string) => {
    const presetData = SCENARIO_PRESETS[presetName];
    setScenario({ ...presetData, preset: presetName });
  };

  const regenerateTxnId = () => {
    setTxnId(`TXN-${Math.floor(Math.random() * 90000) + 10000}`);
  };

  return (
    <div className="flex flex-col gap-6 h-full p-6 glass-card rounded-2xl overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Scenario Config
        </h2>
        <p className="text-sm text-zinc-400 mt-1">Configure transaction details or select a preset to simulate AI fraud detection.</p>
      </div>

      {/* Preset Selectors */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Fraud Scenarios</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(SCENARIO_PRESETS).map((preset) => {
            const isSelected = scenario.preset === preset;
            const Icon = 
              preset === "Normal Behavior" ? Hand :
              preset === "Stolen Card" ? CreditCard :
              preset === "Account Takeover" ? ShieldAlert : Crosshair;
            
            return (
              <button
                key={preset}
                onClick={() => handlePresetSelect(preset)}
                className={cn(
                  "flex items-center gap-2 p-3 text-left rounded-xl border text-sm transition-all duration-300",
                  isSelected 
                    ? "bg-primary/20 border-primary shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)] text-primary" 
                    : "bg-background border-border hover:bg-zinc-800/50 hover:border-zinc-700 text-zinc-400"
                )}
              >
                <Icon className={cn("w-4 h-4", isSelected ? "text-primary" : "text-zinc-500")} />
                <span className="font-medium leading-tight">{preset}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Transaction Details</h3>
        
        <div className="flex justify-between items-center text-xs p-3 bg-background border border-border rounded-lg">
          <span className="text-zinc-500 font-mono">ID: {txnId}</span>
          <button onClick={regenerateTxnId} className="text-zinc-400 hover:text-white transition-colors" title="Generate New TXN ID">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-400">Sender</span>
            <select
              value={scenario.sender}
              onChange={(e) => setScenario({ sender: e.target.value })}
              className="bg-zinc-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              {MOCK_USERS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-400">Receiver</span>
            <select
              value={scenario.receiver}
              onChange={(e) => setScenario({ receiver: e.target.value })}
              className="bg-zinc-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              {MOCK_RECEIVERS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-400">Amount (USD)</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
              <input
                type="number"
                value={scenario.amount}
                onChange={(e) => setScenario({ amount: Number(e.target.value) })}
                className="bg-zinc-900 border border-border rounded-lg pl-7 pr-3 py-2 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none w-full"
              />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-400">Location</span>
              <select
                value={scenario.location}
                onChange={(e) => setScenario({ location: e.target.value })}
                className="bg-zinc-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-400">Device</span>
              <select
                value={scenario.device}
                onChange={(e) => setScenario({ device: e.target.value as DeviceType })}
                className="bg-zinc-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {["Desktop", "Mobile", "Tablet"].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-400">Time of Transaction</span>
            <select
              value={scenario.time}
              onChange={(e) => setScenario({ time: e.target.value as TimeOfDay })}
              className="bg-zinc-900 border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="Day">Daytime (08:00 - 20:00)</option>
              <option value="Night">Nighttime (20:00 - 08:00)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onSimulate}
          disabled={isSimulating}
          className="w-full relative group overflow-hidden rounded-xl bg-primary px-4 py-3.5 text-black font-semibold tracking-wide transition-all shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)] hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSimulating ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Initializing AI...
            </span>
          ) : (
            <span className="relative z-10 flex flex-col items-center">
              <span>Simulate Transaction</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
