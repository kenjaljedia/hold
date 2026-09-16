import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { CategorySpend } from '../types';

interface Props {
  categories: CategorySpend[];
  isPrivacyMode: boolean;
}

export const CategoryBreakdown: React.FC<Props> = ({ categories, isPrivacyMode }) => {
  const formatAmount = (val: number) => {
    if (isPrivacyMode) return '₹ •••••';
    return '₹' + Math.floor(val).toLocaleString('en-IN');
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>SPENDING BY CATEGORY</Text>
        <Text style={styles.countText}>{categories.length} Categories</Text>
      </View>

      <View style={styles.list}>
        {categories.map((cat) => (
          <View key={cat.category_id} style={styles.item}>
            <View style={styles.itemTop}>
              <View style={styles.nameRow}>
                <View style={[styles.colorIndicator, { backgroundColor: cat.color_hex }]} />
                <Text style={styles.catName}>{cat.category_name}</Text>
              </View>
              <View style={styles.amountCol}>
                <Text style={styles.amountText}>{formatAmount(cat.total_amount)}</Text>
                <Text style={styles.pctText}>{cat.percentage.toFixed(1)}%</Text>
              </View>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(100, Math.max(5, cat.percentage))}%`, backgroundColor: cat.color_hex },
                ]}
              />
            </View>
          </View>
        ))}
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
  countText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  list: {
    gap: 14,
  },
  item: {
    gap: 6,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  catName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  amountCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pctText: {
    fontSize: 11,
    color: Colors.textMuted,
    width: 38,
    textAlign: 'right',
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.bgInset,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
});
