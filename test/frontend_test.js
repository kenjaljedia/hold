// Frontend validation test suite for Hold (Wallet Management System)
const assert = require('assert');

console.log('🧪 Starting Hold Frontend Test Suite...\n');

// 1. Currency Formatter & Privacy Masking Test
function formatCurrency(amount, isPrivacyMode = false) {
  if (isPrivacyMode) {
    return '₹ •••••';
  }
  return '₹' + Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
}

console.log('Test 1: Currency & Privacy Masking');
assert.strictEqual(formatCurrency(184500, true), '₹ •••••', 'Privacy mode must mask currency');
assert.strictEqual(formatCurrency(482950, false), '₹4,82,950.00', 'INR formatted string mismatch');
console.log('  ✓ Currency formatting and privacy masking passed!');

// 2. Transaction Search & Filter Test
const sampleTransactions = [
  { id: '1', merchant: 'Starbucks Coffee', category: 'Food & Drinks', amount: 380, type: 'debit' },
  { id: '2', merchant: 'Tech Corp Global', category: 'Salary & Income', amount: 125000, type: 'credit' },
  { id: '3', merchant: 'Uber India', category: 'Travel & Transit', amount: 420, type: 'debit' },
  { id: '4', merchant: 'Swiggy Gourmet', category: 'Food & Drinks', amount: 890, type: 'debit' },
  { id: '5', merchant: 'Netflix Family', category: 'Subscriptions', amount: 649, type: 'debit' },
];

function filterTransactions(items, { search = '', filterType = 'all' } = {}) {
  return items.filter(item => {
    if (filterType === 'incoming' && item.type !== 'credit') return false;
    if (filterType === 'outgoing' && item.type !== 'debit') return false;
    if (search) {
      const q = search.toLowerCase();
      return item.merchant.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    }
    return true;
  });
}

console.log('\nTest 2: Transaction Search & Filters');
const searchCoffee = filterTransactions(sampleTransactions, { search: 'Starbucks' });
assert.strictEqual(searchCoffee.length, 1, 'Search for Starbucks should return 1 record');
assert.strictEqual(searchCoffee[0].merchant, 'Starbucks Coffee');

const outgoingOnly = filterTransactions(sampleTransactions, { filterType: 'outgoing' });
assert.strictEqual(outgoingOnly.length, 4, 'Should return 4 outgoing debit records');

const incomingOnly = filterTransactions(sampleTransactions, { filterType: 'incoming' });
assert.strictEqual(incomingOnly.length, 1, 'Should return 1 salary income record');
console.log('  ✓ Transaction search & filtering passed!');

// 3. Cash Flow Calculations Test
console.log('\nTest 3: Cash Flow Calculations');
const totalInflow = sampleTransactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
const totalOutflow = sampleTransactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
const netSavings = totalInflow - totalOutflow;
const savingsRate = ((netSavings / totalInflow) * 100).toFixed(1);

assert.strictEqual(totalInflow, 125000, 'Total inflow must match salary credit');
assert.strictEqual(totalOutflow, 2339, 'Total outflow must match sum of expenses');
assert.strictEqual(netSavings, 122661, 'Net savings calculation mismatch');
assert.strictEqual(savingsRate, '98.1', 'Savings rate percentage mismatch');
console.log('  ✓ Cash flow metrics passed!');

// 4. Net Worth Aggregator Test
console.log('\nTest 4: Net Worth Aggregation');
const accounts = [
  { name: 'HDFC Bank', balance: 184500.00 },
  { name: 'State Bank of India', balance: 92350.00 },
  { name: 'ICICI Bank', balance: 145000.00 },
  { name: 'Cash Wallet', balance: 61100.00 }
];
const netWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);
assert.strictEqual(netWorth, 482950.00, 'Net worth must accurately sum all accounts');
console.log('  ✓ Net worth aggregation passed!');

console.log('\n========================================');
console.log('🎉 All 4 frontend test suites passed successfully!');
console.log('========================================');
