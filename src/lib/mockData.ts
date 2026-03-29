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

export const MOCK_PROFILES: Record<string, UserProfile> = {
  "Alice Smith": {
    name: "Alice Smith",
    trustScore: 92,
    avgAmount: 2450,
    usualLocation: "Pune",
    trustedDevices: ["iPhone 13", "MacBook Air M2"],
  },
  "Bob Johnson": {
    name: "Bob Johnson",
    trustScore: 68,
    avgAmount: 450,
    usualLocation: "Mumbai",
    trustedDevices: ["Android Pixel 7", "Windows PC"],
  },
  "Charlie Davis": {
    name: "Charlie Davis",
    trustScore: 85,
    avgAmount: 12000,
    usualLocation: "Delhi",
    trustedDevices: ["iPad Pro", "iPhone 15 Pro"],
  },
  "Diana Prince": {
    name: "Diana Prince",
    trustScore: 99,
    avgAmount: 85000,
    usualLocation: "Bangalore",
    trustedDevices: ["Mac Studio", "Secure Terminal"],
  }
};

export const MOCK_RECENT_TRANSACTIONS: Record<string, RecentTransaction[]> = {
  "Alice Smith": [
    { id: "TXN-9021", amount: 1500, location: "Pune", status: "SAFE", date: "Today, 10:45 AM" },
    { id: "TXN-9020", amount: 450, location: "Pune", status: "SAFE", date: "Yesterday, 2:15 PM" },
    { id: "TXN-9019", amount: 12000, location: "Mumbai", status: "WARNING", date: "Mar 25, 6:30 PM" },
    { id: "TXN-9018", amount: 200, location: "Pune", status: "SAFE", date: "Mar 24, 9:00 AM" },
  ],
  "Bob Johnson": [
    { id: "TXN-8812", amount: 45, location: "Mumbai", status: "SAFE", date: "Today, 08:30 AM" },
    { id: "TXN-8811", amount: 400, location: "Unknown/VPN", status: "WARNING", date: "Yesterday, 11:15 PM" },
    { id: "TXN-8810", amount: 50, location: "Mumbai", status: "SAFE", date: "Mar 27, 2:30 PM" },
  ],
  "Charlie Davis": [
    { id: "TXN-7001", amount: 12500, location: "Delhi", status: "SAFE", date: "Today, 1:45 PM" },
    { id: "TXN-7002", amount: 8000, location: "Delhi", status: "SAFE", date: "Mar 26, 4:10 PM" },
    { id: "TXN-7003", amount: 45000, location: "Chennai", status: "FRAUD", date: "Mar 20, 3:00 AM" },
  ],
  "Diana Prince": [
    { id: "TXN-6500", amount: 85000, location: "Bangalore", status: "SAFE", date: "Today, 9:00 AM" },
    { id: "TXN-6499", amount: 120000, location: "Bangalore", status: "WARNING", date: "Yesterday, 3:00 PM" },
  ],
};
