export type RiskLevel = "SAFE" | "WARNING" | "FRAUD";
export type Decision = "ALLOW" | "REQUIRE OTP" | "BLOCK TRANSACTION";
export type DeviceType = "Mobile" | "Desktop" | "Tablet";
export type TimeOfDay = "Day" | "Night";

export interface TransactionScenario {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  location: string;
  device: DeviceType;
  time: TimeOfDay;
  preset: string;
}

export interface EvaluationStep {
  name: string;
  status: "idle" | "checking" | "safe" | "flagged";
  reason?: string;
}

export interface SimulationResult {
  score: number;
  level: RiskLevel;
  decision: Decision;
  story: string[];
  contributions: {
    behavior: number;
    location: number;
    device: number;
  };
  stepsCompleted: boolean;
}

export interface UserProfile {
  name: string;
  trustScore: number;
  avgAmount: number;
  usualLocation: string;
  trustedDevices: string[];
}

export interface RecentTransaction {
  id: string;
  amount: number;
  location: string;
  status: RiskLevel;
  date: string;
}
