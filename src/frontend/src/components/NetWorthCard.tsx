import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Timeframe, SparklinePoint } from '../types';

interface Props {
  totalNetWorth: number;
  deltaPercentage: number;
  deltaAmount: number;
  selectedTimeframe: Timeframe;
  onSelectTimeframe: (tf: Timeframe) => void;
  sparklinePoints: SparklinePoint[];
  isPrivacyMode: boolean;
  onTogglePrivacy: () => void;
}

export const NetWorthCard: React.FC<Props> = ({
  totalNetWorth,
  deltaPercentage,
  deltaAmount,
  selectedTimeframe,
  onSelectTimeframe,
  sparklinePoints,
  isPrivacyMode,
  onTogglePrivacy,
}) => {
  const timeframes: Timeframe[] = ['1W', '1M', '3M', '1Y', 'ALL'];

  const formattedAmount = isPrivacyMode
    ? '₹ •••••'
    : '₹' + Math.floor(totalNetWorth).toLocaleString('en-IN');

  const formattedDecimals = isPrivacyMode
    ? ''
    : '.' + (totalNetWorth % 1).toFixed(2).substring(2);

  // SVG Sparkline calculation
  const width = 320;
  const height = 90;
  const padding = 8;

  let pathD = '';
  let fillD = '';

  if (sparklinePoints && sparklinePoints.length > 1) {
    const min = Math.min(...sparklinePoints.map(p => p.balance));
    const max = Math.max(...sparklinePoints.map(p => p.balance));
    const range = max - min || 1;

    const points = sparklinePoints.map((p, index) => {
      const x = padding + (index / (sparklinePoints.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((p.balance - min) / range) * (height - 2 * padding);
      return { x, y };
    });

    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      pathD += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    fillD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  }

  return (
    <View style={styles.card}>
      {/* Top Label & Privacy Toggle */}
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <Text style={styles.label}>TOTAL NET WORTH</Text>
          <View style={styles.liveDot} />
        </View>
        <TouchableOpacity style={styles.privacyBtn} onPress={onTogglePrivacy}>
          <Text style={styles.privacyIcon}>{isPrivacyMode ? '👁️‍🗨️' : '👁️'}</Text>
          <Text style={styles.privacyText}>{isPrivacyMode ? 'Hidden' : 'Visible'}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Net Worth Value */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>{formattedAmount}</Text>
        {!isPrivacyMode && <Text style={styles.decimalText}>{formattedDecimals}</Text>}
      </View>

      {/* Delta indicator */}
      <View style={styles.deltaRow}>
        <View style={[styles.deltaBadge, deltaPercentage >= 0 ? styles.deltaPositive : styles.deltaNegative]}>
          <Text style={styles.deltaArrow}>{deltaPercentage >= 0 ? '↗' : '↘'}</Text>
          <Text style={styles.deltaText}>
            {deltaPercentage >= 0 ? '+' : ''}{deltaPercentage.toFixed(2)}%
          </Text>
        </View>
        <Text style={styles.deltaAmountText}>
          {isPrivacyMode ? 'in this period' : `(+₹${Math.floor(deltaAmount).toLocaleString('en-IN')} in this period)`}
        </Text>
      </View>

      {/* Sparkline Graph */}
      <View style={styles.chartContainer}>
        {pathD ? (
          <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <Defs>
              <LinearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={Colors.primary} stopOpacity="0.35" />
                <Stop offset="100%" stopColor={Colors.primary} stopOpacity="0.0" />
              </LinearGradient>
            </Defs>
            <Path d={fillD} fill="url(#gradientFill)" />
            <Path d={pathD} fill="none" stroke={Colors.primary} strokeWidth="3" strokeLinecap="round" />
          </Svg>
        ) : (
          <View style={{ height: 60 }} />
        )}
      </View>

      {/* Timeframe selector pills */}
      <View style={styles.timeframeRow}>
        {timeframes.map(tf => {
          const isSelected = selectedTimeframe === tf;
          return (
            <TouchableOpacity
              key={tf}
              style={[styles.tfPill, isSelected && styles.tfPillActive]}
              onPress={() => onSelectTimeframe(tf)}
            >
              <Text style={[styles.tfText, isSelected && styles.tfTextActive]}>{tf}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.income,
  },
  privacyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInset,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  privacyIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  privacyText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
    marginBottom: 6,
  },
  balanceText: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.8,
  },
  decimalText: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  deltaPositive: {
    backgroundColor: Colors.incomeLight,
  },
  deltaNegative: {
    backgroundColor: Colors.expenseLight,
  },
  deltaArrow: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.income,
    marginRight: 3,
  },
  deltaText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.income,
  },
  deltaAmountText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  timeframeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgDark,
    padding: 4,
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tfPill: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
  },
  tfPillActive: {
    backgroundColor: Colors.bgCardAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tfText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tfTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
