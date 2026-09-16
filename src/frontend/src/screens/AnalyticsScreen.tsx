import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { CashFlowChart } from '../components/CashFlowChart';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { ApiService } from '../services/api';
import { CashFlowSummary, CategorySpend } from '../types';

interface Props {
  isPrivacyMode: boolean;
}

export const AnalyticsScreen: React.FC<Props> = ({ isPrivacyMode }) => {
  const [cashFlow, setCashFlow] = useState<CashFlowSummary | null>(null);
  const [categories, setCategories] = useState<CategorySpend[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      const [cf, cat] = await Promise.all([
        ApiService.getCashFlow(),
        ApiService.getCategorySpend(),
      ]);
      setCashFlow(cf);
      setCategories(cat);
    };
    loadAnalytics();
  }, []);

  const budgets = [
    { name: 'Food & Dining', spent: 1270, limit: 10000, color: Colors.warning },
    { name: 'Shopping & Home', spent: 1150, limit: 8000, color: Colors.pink },
    { name: 'Utilities & Bills', spent: 1179, limit: 5000, color: Colors.cyan },
    { name: 'Travel & Commute', spent: 420, limit: 4000, color: Colors.primary },
  ];

  const formatAmount = (val: number) => {
    if (isPrivacyMode) return '₹ •••••';
    return '₹' + Math.floor(val).toLocaleString('en-IN');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics & Health</Text>
        <Text style={styles.subtitle}>Inform & delight. Take decisions backed by data.</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cash Flow Section */}
        {cashFlow && <CashFlowChart cashFlow={cashFlow} isPrivacyMode={isPrivacyMode} />}

        {/* Category Breakdown */}
        <CategoryBreakdown categories={categories} isPrivacyMode={isPrivacyMode} />

        {/* Monthly Budget Tracker */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>MONTHLY SPENDING CEILINGS</Text>
            <Text style={styles.cardBadge}>4 Categories Active</Text>
          </View>

          <View style={styles.budgetList}>
            {budgets.map((b, i) => {
              const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
              return (
                <View key={i} style={styles.budgetItem}>
                  <View style={styles.budgetTop}>
                    <Text style={styles.budgetName}>{b.name}</Text>
                    <Text style={styles.budgetAmounts}>
                      {formatAmount(b.spent)} / <Text style={{ color: Colors.textMuted }}>{formatAmount(b.limit)}</Text>
                    </Text>
                  </View>
                  <View style={styles.budgetBarTrack}>
                    <View style={[styles.budgetBarFill, { width: `${pct}%`, backgroundColor: b.color }]} />
                  </View>
                  <Text style={styles.budgetPctText}>{pct}% consumed</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Smart Behavioral Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightTag}>SMART INSIGHTS</Text>
          <Text style={styles.insightTitle}>Positive Savings Momentum</Text>
          <Text style={styles.insightBody}>
            You have saved <Text style={{ color: Colors.income, fontWeight: '700' }}>85.2%</Text> of your monthly income this cycle. Discretionary dining is 18% lower than your 3-month trailing average.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 49, 75, 0.4)',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
  },
  cardBadge: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  budgetList: {
    gap: 14,
  },
  budgetItem: {
    gap: 4,
  },
  budgetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  budgetAmounts: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  budgetBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.bgInset,
    overflow: 'hidden',
    marginTop: 4,
  },
  budgetBarFill: {
    height: 6,
    borderRadius: 3,
  },
  budgetPctText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  insightsCard: {
    backgroundColor: Colors.bgInset,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 16,
  },
  insightTag: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  insightBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
