import { Account, Transaction, NetWorthSummary, CashFlowSummary, CategorySpend, Timeframe } from '../types';
import { mockAccounts, mockTransactions, mockNetWorth, mockCashFlow, mockCategorySpend, mockSparklinePoints } from './mockData';

const API_BASE_URL = 'http://localhost:8080/api';

// In-memory state for local additions
let localAccounts = [...mockAccounts];
let localTransactions = [...mockTransactions];

export const ApiService = {
  // Fetch all accounts
  async getAccounts(): Promise<Account[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/accounts`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          return json.data;
        }
      }
    } catch {
      // Offline fallback
    }
    return localAccounts;
  },

  // Fetch transactions with optional filters
  async getTransactions(search?: string, type?: string, category?: string): Promise<Transaction[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (type && type !== 'all') params.append('type', type);
      if (category) params.append('category', category);

      const res = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Offline fallback
    }

    let filtered = [...localTransactions];
    if (type && type !== 'all') {
      const expectedType = type === 'incoming' ? 'credit' : 'debit';
      filtered = filtered.filter(t => t.transaction_type === expectedType);
    }
    if (category) {
      filtered = filtered.filter(t => t.category_name.toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.merchant_name.toLowerCase().includes(q) ||
        t.category_name.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return filtered;
  },

  // Fetch Net Worth summary
  async getNetWorth(timeframe: Timeframe = '1M'): Promise<NetWorthSummary> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/networth?period=${timeframe}`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }

    const currentTotal = localAccounts.reduce((sum, acc) => sum + acc.current_balance, 0);
    return {
      ...mockNetWorth,
      total_net_worth: currentTotal,
      timeframe,
      sparkline_points: mockSparklinePoints[timeframe] || mockSparklinePoints['1M'],
    };
  },

  // Fetch cash flow summary
  async getCashFlow(): Promise<CashFlowSummary> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/cashflow`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }
    return mockCashFlow;
  },

  // Fetch category spending distribution
  async getCategorySpend(): Promise<CategorySpend[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/categories`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }
    return mockCategorySpend;
  },

  // Create new transaction
  async createTransaction(tx: Omit<Transaction, 'id' | 'transaction_date'>): Promise<Transaction> {
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now(),
      transaction_date: 'Just now',
    };

    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          localTransactions = [json.data, ...localTransactions];
          return json.data;
        }
      }
    } catch {
      // Local fallback
    }

    localTransactions = [newTx, ...localTransactions];

    // Update corresponding account balance
    const accIndex = localAccounts.findIndex(a => a.id === tx.account_id);
    if (accIndex !== -1) {
      const delta = tx.transaction_type === 'credit' ? tx.amount : -tx.amount;
      localAccounts[accIndex] = {
        ...localAccounts[accIndex],
        current_balance: Math.max(0, localAccounts[accIndex].current_balance + delta),
        available_balance: Math.max(0, localAccounts[accIndex].available_balance + delta),
      };
    }

    return newTx;
  },

  // Link new bank account
  async linkAccount(accountData: { institution_name: string; account_type: any; initial_balance: number; ifsc_code: string }): Promise<Account> {
    const newAccount: Account = {
      id: 'acc-' + Date.now(),
      institution_name: accountData.institution_name,
      account_type: accountData.account_type,
      account_number_masked: '•••• ' + Math.floor(1000 + Math.random() * 9000),
      ifsc_code: accountData.ifsc_code || 'HDFC000' + Math.floor(1000 + Math.random() * 9000),
      current_balance: accountData.initial_balance,
      available_balance: accountData.initial_balance,
      currency: 'INR',
      color: '#3B9DFB',
      is_active: true,
      last_synced_at: 'Just now',
    };

    localAccounts = [...localAccounts, newAccount];
    return newAccount;
  },

  // Query Hold AI
  async askHoldAI(query: string): Promise<{ answer: string; action_pills?: string[]; category?: string; amount_found?: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Fallback smart parser
    }

    const q = query.toLowerCase();
    if (q.includes('food') || q.includes('swiggy') || q.includes('starbucks') || q.includes('dining')) {
      return {
        answer: "You've spent ₹1,270.00 on Food & Dining this month across 2 transactions (Starbucks and Swiggy). That's 18% less than your spending pace this time last month. Keep it up!",
        action_pills: ['Set Food Budget', 'View Food Transactions', 'Weekly Trend'],
        category: 'Food & Drinks',
        amount_found: 1270,
      };
    }
    if (q.includes('afford') || q.includes('save') || q.includes('budget')) {
      return {
        answer: "Your current liquid balance across HDFC, SBI, and ICICI is ₹4,21,850, and your monthly net savings rate is 85.2%. A discretionary spend of ₹15,000 is safely within your comfortable buffer (< 3.5% of liquid reserves).",
        action_pills: ['Check Cash Flow', 'Simulate Spend', 'Create Goal'],
      };
    }
    if (q.includes('subscription') || q.includes('netflix') || q.includes('recurring')) {
      return {
        answer: "You have 1 active recurring subscription detected: Netflix Family (₹649/mo), next scheduled renewal in 27 days. No unused duplicate subscriptions found.",
        action_pills: ['Manage Subscriptions', 'View Upcoming Bills'],
        category: 'Subscriptions',
        amount_found: 649,
      };
    }
    return {
      answer: "I reviewed your connected accounts. You're averaging ₹616/day in discretionary spending this month, on track to save over ₹1,00,000 by month end.",
      action_pills: ['Show Spending Trends', 'Analyze Merchants', 'Export Statement'],
    };
  },
};
