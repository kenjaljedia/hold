import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { Account, Transaction } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  accounts: Account[];
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'transaction_date'>) => void;
}

export const AddTransactionModal: React.FC<Props> = ({
  visible,
  onClose,
  accounts,
  onAddTransaction,
}) => {
  const [txType, setTxType] = useState<'debit' | 'credit'>('debit');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState('Food & Drinks');
  const [tags, setTags] = useState('');

  const categories = [
    'Food & Drinks',
    'Shopping',
    'Travel & Transit',
    'Utilities & Bills',
    'Subscriptions',
    'Investments',
    'Salary & Income',
  ];

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!merchant.trim()) {
      alert('Please enter a merchant or description');
      return;
    }

    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

    onAddTransaction({
      account_id: selectedAccount || accounts[0]?.id,
      merchant_name: merchant.trim(),
      amount: parsedAmount,
      transaction_type: txType,
      category_name: selectedCategory,
      tags: tagList.length > 0 ? tagList : ['Personal'],
      description: `Manual entry on ${new Date().toLocaleDateString()}`,
    });

    // Reset & close
    setAmount('');
    setMerchant('');
    setTags('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Record Transaction</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Debit vs Credit toggle */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeBtn, txType === 'debit' && styles.typeBtnActiveExpense]}
                onPress={() => setTxType('debit')}
              >
                <Text style={[styles.typeBtnText, txType === 'debit' && styles.typeBtnTextActive]}>
                  Outflow (Expense -)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, txType === 'credit' && styles.typeBtnActiveIncome]}
                onPress={() => setTxType('credit')}
              >
                <Text style={[styles.typeBtnText, txType === 'credit' && styles.typeBtnTextActive]}>
                  Inflow (Income +)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount input */}
            <Text style={styles.inputLabel}>AMOUNT (INR)</Text>
            <View style={styles.amountInputWrap}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={Colors.textPlaceholder}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Merchant input */}
            <Text style={styles.inputLabel}>MERCHANT / RECIPIENT</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Blue Tokai Coffee, Amazon, Uber"
              placeholderTextColor={Colors.textPlaceholder}
              value={merchant}
              onChangeText={setMerchant}
            />

            {/* Account Selector */}
            <Text style={styles.inputLabel}>SELECT ACCOUNT</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
              {accounts.map(acc => {
                const isSelected = selectedAccount === acc.id || (!selectedAccount && acc.id === accounts[0]?.id);
                return (
                  <TouchableOpacity
                    key={acc.id}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => setSelectedAccount(acc.id)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {acc.institution_name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Category Selector */}
            <Text style={styles.inputLabel}>CATEGORY</Text>
            <View style={styles.categoriesWrap}>
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, isSelected && styles.catChipActive]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Tags input */}
            <Text style={styles.inputLabel}>TAGS (COMMA SEPARATED)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Work, Reimbursable, Weekend"
              placeholderTextColor={Colors.textPlaceholder}
              value={tags}
              onChangeText={setTags}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
              <Text style={styles.submitBtnText}>Save Transaction</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.modalBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  body: {
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.bgDark,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  typeBtnActiveExpense: {
    backgroundColor: Colors.expenseLight,
    borderWidth: 1,
    borderColor: Colors.expense,
  },
  typeBtnActiveIncome: {
    backgroundColor: Colors.incomeLight,
    borderWidth: 1,
    borderColor: Colors.income,
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  typeBtnTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 6,
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgDark,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    height: 52,
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  textInput: {
    backgroundColor: Colors.bgDark,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: Colors.bgDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Colors.bgCardAlt,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.primary,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  catChip: {
    backgroundColor: Colors.bgDark,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  catChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  catChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
