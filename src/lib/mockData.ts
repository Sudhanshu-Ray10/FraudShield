import { TransactionScenario, UserProfile, RecentTransaction } from "./types";

export const MOCK_USERS = [
  "Alice Smith",
  "Bob Johnson",
  "Charlie Davis",
  "Diana Prince"
];

export const MOCK_RECEIVERS = [
  "Amazon Store",
  "Netflix Subscription",
  "Unknown Crypto Wallet",
  "Target Corp",
  "John Doe (P2P)"
];

export const LOCATIONS = ["Pune", "Mumbai", "Bangalore", "Chennai", "Delhi", "Unknown/VPN"];

export const SCENARIO_PRESETS: Record<string, Partial<TransactionScenario>> = {
  "Normal Behavior": {
    amount: 1540,
    location: "Pune",
    device: "Desktop",
    time: "Day",
  },
  "Stolen Card": {
    amount: 85000,
    location: "Mumbai",
    device: "Mobile",
    time: "Night",
  },
  "Account Takeover": {
    amount: 125000,
    location: "Unknown/VPN",
    device: "Desktop",
    time: "Night",
  },
  "Phishing Attempt": {
    amount: 45000,
    location: "Delhi",
    device: "Tablet",
    time: "Day",
  }
};

export const MOCK_PROFILE: UserProfile = {
  name: "Alice Smith",
  trustScore: 92,
  avgAmount: 2450,
  usualLocation: "Pune, IN",
  trustedDevices: ["iPhone 13", "MacBook Air M2"],
};

export const MOCK_RECENT_TRANSACTIONS: RecentTransaction[] = [
  { id: "TXN-9021", amount: 1500, location: "Pune", status: "SAFE", date: "Today, 10:45 AM" },
  { id: "TXN-9020", amount: 450, location: "Pune", status: "SAFE", date: "Yesterday, 2:15 PM" },
  { id: "TXN-9019", amount: 12000, location: "Mumbai", status: "WARNING", date: "Mar 25, 6:30 PM" },
  { id: "TXN-9018", amount: 200, location: "Pune", status: "SAFE", date: "Mar 24, 9:00 AM" },
];
