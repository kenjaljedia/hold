export type Timeframe = '1W' | '1M' | '3M' | '1Y' | 'ALL';

export interface Account {
  id: string;
  institution_name: string;
  account_type: 'savings' | 'checking' | 'credit_card' | 'investment' | 'wallet';
  account_number_masked: string;
  ifsc_code: string;
  current_balance: number;
  available_balance: number;
  currency: string;
  logo_url?: string;
  color?: string;
  is_active: boolean;
  last_synced_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  institution_name?: string;
  category_id?: string;
  category_name: string;
  category_icon?: string;
  category_color?: string;
  merchant_name: string;
  amount: number;
  transaction_type: 'debit' | 'credit';
  description?: string;
  tags?: string[];
  receipt_url?: string;
  transaction_date: string;
}

export interface Category {
  id: string;
  name: string;
  icon_name: string;
  color_hex: string;
  category_type: 'expense' | 'income';
}

export interface SparklinePoint {
  timestamp: string;
  balance: number;
}

export interface NetWorthSummary {
  total_net_worth: number;
  delta_percentage: number;
  delta_amount: number;
  currency: string;
  timeframe: Timeframe;
  account_count: number;
  sparkline_points: SparklinePoint[];
}

export interface CashFlowSummary {
  total_inflow: number;
  total_outflow: number;
  net_savings: number;
  savings_rate: number;
  month: string;
}

export interface CategorySpend {
  category_id: string;
  category_name: string;
  icon_name: string;
  color_hex: string;
  total_amount: number;
  percentage: number;
  count: number;
}

export interface RecurringBill {
  id: string;
  merchant_name: string;
  category: string;
  amount: number;
  due_date: string;
  days_left: number;
  icon: string;
  account_name: string;
}

export interface HoldAIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
  amount_found?: number;
  action_pills?: string[];
}
