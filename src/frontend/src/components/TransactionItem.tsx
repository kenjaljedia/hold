import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Transaction } from '../types';

interface Props {
  transaction: Transaction;
  isPrivacyMode: boolean;
  onPress?: () => void;
}

export const TransactionItem: React.FC<Props> = ({ transaction, isPrivacyMode, onPress }) => {
  const isCredit = transaction.transaction_type === 'credit';

  const getCategoryEmoji = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('food') || c.includes('coffee')) return '☕';
    if (c.includes('dining') || c.includes('restaurant')) return '🍽️';
    if (c.includes('travel') || c.includes('cab')) return '🚕';
    if (c.includes('subscription') || c.includes('film')) return '🎬';
    if (c.includes('shopping') || c.includes('grocery')) return '🛍️';
    if (c.includes('salary') || c.includes('income')) return '💼';
    if (c.includes('investment') || c.includes('sip')) return '📈';
    if (c.includes('utilit') || c.includes('bill')) return '⚡';
    return '💳';
  };

  const formattedAmount = isPrivacyMode
    ? '₹ •••••'
    : (isCredit ? '+' : '-') + '₹' + Math.floor(transaction.amount).toLocaleString('en-IN');

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftCol}>
        <View style={[styles.iconBox, { backgroundColor: transaction.category_color ? `${transaction.category_color}22` : Colors.bgInset }]}>
          <Text style={styles.emojiIcon}>{getCategoryEmoji(transaction.category_name)}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.merchantName} numberOfLines={1}>{transaction.merchant_name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.dateText}>{transaction.transaction_date}</Text>
            {transaction.institution_name && (
              <>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.institutionText}>{transaction.institution_name}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.rightCol}>
        <Text style={[styles.amountText, isCredit ? styles.amountCredit : styles.amountDebit]}>
          {formattedAmount}
        </Text>
        <Text style={styles.categoryBadge} numberOfLines={1}>
          {transaction.category_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(30, 49, 75, 0.4)',
    marginBottom: 8,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emojiIcon: {
    fontSize: 20,
  },
  infoCol: {
    flex: 1,
  },
  merchantName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  dot: {
    fontSize: 10,
    color: Colors.textMuted,
    marginHorizontal: 4,
  },
  institutionText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  amountCredit: {
    color: Colors.income,
  },
  amountDebit: {
    color: Colors.textPrimary,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
