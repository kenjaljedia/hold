import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Account } from '../types';

interface Props {
  account: Account;
  isPrivacyMode: boolean;
  onPressStatement?: () => void;
}

export const AccountCard: React.FC<Props> = ({ account, isPrivacyMode, onPressStatement }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedBalance = isPrivacyMode
    ? '₹ •••••'
    : '₹' + Math.floor(account.current_balance).toLocaleString('en-IN');

  const getInstitutionInitials = (name: string) => {
    if (name.includes('HDFC')) return 'HDFC';
    if (name.includes('State Bank') || name.includes('SBI')) return 'SBI';
    if (name.includes('ICICI')) return 'ICICI';
    if (name.includes('Cash')) return 'CASH';
    return name.substring(0, 4).toUpperCase();
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.bankIdentity}>
          <View style={[styles.logoBadge, { backgroundColor: account.color || Colors.primaryDark }]}>
            <Text style={styles.logoBadgeText}>{getInstitutionInitials(account.institution_name)}</Text>
          </View>
          <View>
            <Text style={styles.bankName}>{account.institution_name}</Text>
            <Text style={styles.accNumber}>{account.account_number_masked} • {account.account_type.toUpperCase()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
          <Text style={styles.copyBtnText}>{copied ? 'Copied ✓' : 'IFSC'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.balanceRow}>
        <View>
          <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
          <Text style={styles.balanceValue}>{formattedBalance}</Text>
        </View>
        
        {onPressStatement && (
          <TouchableOpacity style={styles.statementBtn} onPress={onPressStatement}>
            <Text style={styles.statementBtnText}>Statement ↗</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.syncText}>Synced {account.last_synced_at}</Text>
        {account.ifsc_code && account.ifsc_code !== 'N/A' && (
          <Text style={styles.ifscText}>IFSC: {account.ifsc_code}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  logoBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bankName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  accNumber: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  copyBtn: {
    backgroundColor: Colors.bgInset,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  statementBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.bgInset,
  },
  statementBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.03)',
  },
  syncText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  ifscText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
});
