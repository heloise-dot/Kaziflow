
export enum UserRole {
  PUBLIC = 'public',
  VENDOR = 'vendor',
  RETAILER = 'retailer',
  BANK = 'bank',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
}

export interface Invoice {
  id: string;
  vendor_id: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'financed';
  qr_code?: string;
  due_date: string;
  created_at: string;
}

export interface RiskScore {
  score: number;
  level: 'Low' | 'Medium' | 'High';
  factors: {
    label: string;
    impact: number; // -1 to 1
  }[];
  reasoning: string;
}

export interface WalletBalance {
  amount: number;
  currency: string;
  lastUpdated: string;
}
