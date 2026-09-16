import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Colors } from '../theme/colors';
import { NetWorthCard } from '../components/NetWorthCard';
import { AccountCard } from '../components/AccountCard';
import { QuickActions } from '../components/QuickActions';
import { TransactionItem } from '../components/TransactionItem';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { LinkAccountModal } from '../components/LinkAccountModal';
import { ApiService } from '../services/api';
import { mockRecurringBills } from '../services/mockData';
import { Account, Transaction, NetWorthSummary, Timeframe } from '../types';

interface Props {
  isPrivacyMode: boolean;
  onTogglePrivacy: () => void;
  onNavigateTransactions: () => void;
  onNavigateAccounts: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  isPrivacyMode,
  onTogglePrivacy,
  onNavigateTransactions,
  onNavigateAccounts,
}) => {
  const [netWorth, setNetWorth] = useState<NetWorthSummary | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1M');
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const loadData = async (tf: Timeframe = selectedTimeframe) => {
    const [nw, accs, txs] = await Promise.all([
      ApiService.getNetWorth(tf),
      ApiService.getAccounts(),
      ApiService.getTransactions(),
    ]);
    setNetWorth(nw);
    setAccounts(accs);
    setRecentTransactions(txs.slice(0, 5));
  };

  useEffect(() => {
    loadData(selectedTimeframe);
  }, [selectedTimeframe]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(selectedTimeframe);
    setRefreshing(false);
  };

  const handleAddTransaction = async (txData: any) => {
    await ApiService.createTransaction(txData);
    await loadData(selectedTimeframe);
  };

  const handleLinkAccount = async (accData: any) => {
    await ApiService.linkAccount(accData);
    await loadData(selectedTimeframe);
  };

  return (
    <View style={styles.screen}>
      {/* App Bar / Navbar */}
      <View style={styles.navbar}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>H</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>hold</Text>
            <Text style={styles.brandSubtitle}>Be painfully aware.</Text>
          </View>
        </View>

        <View style={styles.navActions}>
          <TouchableOpacity style={styles.privacyIconBtn} onPress={onTogglePrivacy}>
            <Text style={styles.iconBtnText}>{isPrivacyMode ? '👁️‍🗨️' : '👁️'}</Text>
          </TouchableOpacity>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>GA</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Total Net Worth Card */}
        {netWorth && (
          <NetWorthCard
            totalNetWorth={netWorth.total_net_worth}
            deltaPercentage={netWorth.delta_percentage}
            deltaAmount={netWorth.delta_amount}
            selectedTimeframe={selectedTimeframe}
            onSelectTimeframe={setSelectedTimeframe}
            sparklinePoints={netWorth.sparkline_points}
            isPrivacyMode={isPrivacyMode}
            onTogglePrivacy={onTogglePrivacy}
          />
        )}

        {/* Quick Actions */}
        <QuickActions
          onAddPress={() => setShowAddModal(true)}
          onTransferPress={() => setShowAddModal(true)}
          onScanPress={() => alert('UPI QR Scanner initiated')}
          onStatementPress={onNavigateAccounts}
        />

        {/* Connected Bank Accounts */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>CONNECTED ACCOUNTS</Text>
          <TouchableOpacity onPress={() => setShowLinkModal(true)}>
            <Text style={styles.linkActionText}>+ Link Account</Text>
          </TouchableOpacity>
        </View>

        {accounts.map(acc => (
          <AccountCard
            key={acc.id}
            account={acc}
            isPrivacyMode={isPrivacyMode}
            onPressStatement={onNavigateAccounts}
          />
        ))}

        {/* Upcoming Recurring Bills */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>UPCOMING RECURRING BILLS</Text>
          <Text style={styles.sectionBadge}>{mockRecurringBills.length} Active</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.billsScroll}>
          {mockRecurringBills.map(bill => (
            <View key={bill.id} style={styles.billCard}>
              <View style={styles.billTop}>
                <Text style={styles.billCategory}>{bill.category.toUpperCase()}</Text>
                <Text style={styles.billDueDays}>{bill.days_left}d left</Text>
              </View>
              <Text style={styles.billMerchant} numberOfLines={1}>{bill.merchant_name}</Text>
              <Text style={styles.billAmount}>
                {isPrivacyMode ? '₹ •••••' : `₹${bill.amount.toLocaleString('en-IN')}`}
              </Text>
              <Text style={styles.billAccount}>{bill.account_name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Recent Transactions */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>RECENT TRANSACTIONS</Text>
          <TouchableOpacity onPress={onNavigateTransactions}>
            <Text style={styles.linkActionText}>View All →</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.map(tx => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            isPrivacyMode={isPrivacyMode}
            onPress={onNavigateTransactions}
          />
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        accounts={accounts}
        onAddTransaction={handleAddTransaction}
      />

      {/* Link Account Modal */}
      <LinkAccountModal
        visible={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onAccountLinked={handleLinkAccount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 49, 75, 0.4)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  privacyIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgInset,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBtnText: {
    fontSize: 16,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
  },
  sectionBadge: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  linkActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  billsScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  billCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 160,
    marginRight: 10,
  },
  billTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  billDueDays: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.warning,
  },
  billMerchant: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  billAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  billAccount: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
