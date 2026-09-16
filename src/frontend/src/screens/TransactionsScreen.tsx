import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '../theme/colors';
import { TransactionItem } from '../components/TransactionItem';
import { ApiService } from '../services/api';
import { Transaction } from '../types';

interface Props {
  isPrivacyMode: boolean;
}

export const TransactionsScreen: React.FC<Props> = ({ isPrivacyMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filterChips = [
    { label: 'All', id: 'all' },
    { label: '↓ Incoming', id: 'incoming' },
    { label: '↑ Outgoing', id: 'outgoing' },
  ];

  const categoryChips = ['Food', 'Shopping', 'Transit', 'Subscriptions', 'SIP'];

  const fetchFiltered = async () => {
    const data = await ApiService.getTransactions(searchQuery, selectedFilter, selectedCategory);
    setTransactions(data);
  };

  useEffect(() => {
    fetchFiltered();
  }, [searchQuery, selectedFilter, selectedCategory]);

  const totalSpent = transactions
    .filter(t => t.transaction_type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <View style={styles.screen}>
      {/* Search Header */}
      <View style={styles.headerArea}>
        <Text style={styles.screenTitle}>Transactions</Text>
        <Text style={styles.screenSubtitle}>Search, recall, and filter your financial history.</Text>

        {/* Search input bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Starbucks, Swiggy, Salary..."
            placeholderTextColor={Colors.textPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {filterChips.map(chip => (
            <TouchableOpacity
              key={chip.id}
              style={[styles.filterChip, selectedFilter === chip.id && styles.filterChipActive]}
              onPress={() => setSelectedFilter(chip.id as any)}
            >
              <Text style={[styles.filterChipText, selectedFilter === chip.id && styles.filterChipTextActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          ))}

          {categoryChips.map(cat => {
            const isCatActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, isCatActive && styles.filterChipActive]}
                onPress={() => setSelectedCategory(isCatActive ? '' : cat)}
              >
                <Text style={[styles.filterChipText, isCatActive && styles.filterChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Summary Row */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryCount}>{transactions.length} Transactions Found</Text>
        <Text style={styles.summaryTotal}>
          Total Outflow: {isPrivacyMode ? '₹ •••••' : `₹${Math.floor(totalSpent).toLocaleString('en-IN')}`}
        </Text>
      </View>

      {/* Transaction List */}
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {transactions.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyTitle}>No transactions found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search keywords or active filters.</Text>
          </View>
        ) : (
          transactions.map(tx => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              isPrivacyMode={isPrivacyMode}
              onPress={() => setSelectedTx(tx)}
            />
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Transaction Detail Sheet */}
      {selectedTx && (
        <Modal visible={!!selectedTx} animationType="slide" transparent onRequestClose={() => setSelectedTx(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.detailSheet}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailTitle}>Transaction Receipt</Text>
                <TouchableOpacity onPress={() => setSelectedTx(null)}>
                  <Text style={styles.closeModalText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailMerchant}>{selectedTx.merchant_name}</Text>
                <Text style={[styles.detailAmount, selectedTx.transaction_type === 'credit' ? styles.creditColor : styles.debitColor]}>
                  {isPrivacyMode ? '₹ •••••' : `${selectedTx.transaction_type === 'credit' ? '+' : '-'}₹${selectedTx.amount.toLocaleString('en-IN')}`}
                </Text>
                <Text style={styles.detailTime}>{selectedTx.transaction_date}</Text>

                <View style={styles.detailMetaGrid}>
                  <View style={styles.metaBlock}>
                    <Text style={styles.metaLabel}>ACCOUNT</Text>
                    <Text style={styles.metaValue}>{selectedTx.institution_name || 'HDFC Bank'}</Text>
                  </View>
                  <View style={styles.metaBlock}>
                    <Text style={styles.metaLabel}>CATEGORY</Text>
                    <Text style={styles.metaValue}>{selectedTx.category_name}</Text>
                  </View>
                  <View style={styles.metaBlock}>
                    <Text style={styles.metaLabel}>TYPE</Text>
                    <Text style={styles.metaValue}>{selectedTx.transaction_type.toUpperCase()}</Text>
                  </View>
                  <View style={styles.metaBlock}>
                    <Text style={styles.metaLabel}>VERIFICATION</Text>
                    <Text style={styles.metaValue}>Bank Confirmed ✓</Text>
                  </View>
                </View>

                {selectedTx.description && (
                  <View style={styles.noteBox}>
                    <Text style={styles.noteLabel}>NOTE</Text>
                    <Text style={styles.noteText}>{selectedTx.description}</Text>
                  </View>
                )}

                {selectedTx.tags && selectedTx.tags.length > 0 && (
                  <View style={styles.tagsRow}>
                    {selectedTx.tags.map((tag, i) => (
                      <View key={i} style={styles.tagPill}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.shareReceiptBtn} onPress={() => alert('Receipt exported as PDF')}>
                <Text style={styles.shareReceiptText}>Share Statement Receipt ↗</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 49, 75, 0.4)',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: Colors.bgInset,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.primary,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.bgCardAlt,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryCount: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  summaryTotal: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  feed: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  detailSheet: {
    backgroundColor: Colors.modalBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closeModalText: {
    fontSize: 18,
    color: Colors.textMuted,
    padding: 4,
  },
  detailCard: {
    backgroundColor: Colors.bgDark,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: 20,
  },
  detailMerchant: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  detailAmount: {
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 8,
  },
  creditColor: {
    color: Colors.income,
  },
  debitColor: {
    color: Colors.textPrimary,
  },
  detailTime: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 18,
  },
  detailMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  metaBlock: {
    width: '46%',
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.6,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  noteBox: {
    width: '100%',
    backgroundColor: Colors.bgInset,
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },
  noteLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  noteText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    width: '100%',
  },
  tagPill: {
    backgroundColor: Colors.bgInset,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  shareReceiptBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  shareReceiptText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
