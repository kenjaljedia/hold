import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { CashFlowSummary } from '../types';

interface Props {
  cashFlow: CashFlowSummary;
  isPrivacyMode: boolean;
}

export const CashFlowChart: React.FC<Props> = ({ cashFlow, isPrivacyMode }) => {
  const total = (cashFlow.total_inflow + cashFlow.total_outflow) || 1;
  const inflowPct = Math.round((cashFlow.total_inflow / total) * 100);
  const outflowPct = 100 - inflowPct;

  const formatAmount = (num: number) => {
    if (isPrivacyMode) return '₹ •••••';
    return '₹' + Math.floor(num).toLocaleString('en-IN');
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>CASH FLOW</Text>
          <Text style={styles.subtitle}>{cashFlow.month}</Text>
        </View>
        <View style={styles.savingsRateBadge}>
          <Text style={styles.savingsRateText}>{cashFlow.savings_rate}% Saved</Text>
        </View>
      </View>

      {/* Proportional Ratio Bar */}
      <View style={styles.barTrack}>
        <View style={[styles.barFillIncome, { flex: inflowPct }]} />
        <View style={[styles.barFillExpense, { flex: outflowPct }]} />
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        {/* Inflow */}
        <View style={styles.metricCol}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: Colors.income }]} />
            <Text style={styles.legendLabel}>TOTAL INFLOW</Text>
          </View>
          <Text style={[styles.metricValue, { color: Colors.income }]}>
            +{formatAmount(cashFlow.total_inflow)}
          </Text>
        </View>

        {/* Outflow */}
        <View style={styles.metricCol}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: Colors.expense }]} />
            <Text style={styles.legendLabel}>TOTAL OUTFLOW</Text>
          </View>
          <Text style={[styles.metricValue, { color: Colors.expense }]}>
            -{formatAmount(cashFlow.total_outflow)}
          </Text>
        </View>

        {/* Net Savings */}
        <View style={styles.metricCol}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendLabel}>NET SURPLUS</Text>
          </View>
          <Text style={[styles.metricValue, { color: Colors.primary }]}>
            {formatAmount(cashFlow.net_savings)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  savingsRateBadge: {
    backgroundColor: Colors.incomeLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  savingsRateText: {
    color: Colors.income,
    fontSize: 12,
    fontWeight: '700',
  },
  barTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.bgInset,
    overflow: 'hidden',
    marginBottom: 16,
    gap: 2,
  },
  barFillIncome: {
    backgroundColor: Colors.income,
    borderRadius: 4,
  },
  barFillExpense: {
    backgroundColor: Colors.expense,
    borderRadius: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCol: {
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.6,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
  },
});
