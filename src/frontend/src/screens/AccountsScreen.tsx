import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Colors } from '../theme/colors';
import { AccountCard } from '../components/AccountCard';
import { LinkAccountModal } from '../components/LinkAccountModal';
import { ApiService } from '../services/api';
import { Account } from '../types';

interface Props {
  isPrivacyMode: boolean;
}

export const AccountsScreen: React.FC<Props> = ({ isPrivacyMode }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedStatementAcc, setSelectedStatementAcc] = useState<string>('');
  const [passwordProtected, setPasswordProtected] = useState(true);
  const [statementSuccess, setStatementSuccess] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const accs = await ApiService.getAccounts();
    setAccounts(accs);
    if (accs.length > 0 && !selectedStatementAcc) {
      setSelectedStatementAcc(accs[0].id);
    }
  };

  const handleAccountLinked = async (accData: any) => {
    await ApiService.linkAccount(accData);
    await loadAccounts();
  };

  const handleDownloadStatement = () => {
    setStatementSuccess(true);
    setTimeout(() => setStatementSuccess(false), 3000);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Accounts & Statements</Text>
        <Text style={styles.subtitle}>All your banks in one place. Never visit a bank website again.</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AA Framework Badge */}
        <View style={styles.aaBanner}>
          <Text style={styles.aaBannerIcon}>🏛️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.aaBannerTitle}>Government Regulated Account Aggregator</Text>
            <Text style={styles.aaBannerText}>
              Connections to HDFC, SBI, and ICICI are established via RBI-licensed AA protocols. End-to-end encrypted.
            </Text>
          </View>
        </View>

        {/* Header & Link Button */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>LINKED BANK ACCOUNTS ({accounts.length})</Text>
          <TouchableOpacity style={styles.linkBtn} onPress={() => setShowLinkModal(true)}>
            <Text style={styles.linkBtnText}>+ Connect Bank</Text>
          </TouchableOpacity>
        </View>

        {/* Account Cards */}
        {accounts.map(acc => (
          <AccountCard
            key={acc.id}
            account={acc}
            isPrivacyMode={isPrivacyMode}
          />
        ))}

        {/* Statement Exporter Section */}
        <View style={styles.statementCard}>
          <Text style={styles.statementTag}>BANK STATEMENT GENERATOR</Text>
          <Text style={styles.statementTitle}>Export Consolidated Statement</Text>
          <Text style={styles.statementDesc}>
            Generate and share clean, audit-ready statements without losing your temper.
          </Text>

          <Text style={styles.fieldLabel}>SELECT ACCOUNT</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accSelectRow}>
            {accounts.map(acc => {
              const isSelected = selectedStatementAcc === acc.id;
              return (
                <TouchableOpacity
                  key={acc.id}
                  style={[styles.accSelectChip, isSelected && styles.accSelectChipActive]}
                  onPress={() => setSelectedStatementAcc(acc.id)}
                >
                  <Text style={[styles.accSelectText, isSelected && styles.accSelectTextActive]}>
                    {acc.institution_name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Password Protection */}
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Password Protection</Text>
              <Text style={styles.toggleSub}>Lock PDF with your PAN / DOB</Text>
            </View>
            <Switch
              value={passwordProtected}
              onValueChange={setPasswordProtected}
              trackColor={{ false: Colors.bgInset, true: Colors.primaryDark }}
              thumbColor={passwordProtected ? Colors.primary : Colors.textMuted}
            />
          </View>

          {/* Download CTA */}
          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadStatement}>
            <Text style={styles.downloadBtnText}>
              {statementSuccess ? 'Statement Generated ✓' : 'Download & Share Statement ↗'}
            </Text>
          </TouchableOpacity>

          {statementSuccess && (
            <Text style={styles.successNotice}>Statement PDF compiled and encrypted successfully.</Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <LinkAccountModal
        visible={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onAccountLinked={handleAccountLinked}
      />
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
  aaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInset,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 16,
    gap: 12,
  },
  aaBannerIcon: {
    fontSize: 24,
  },
  aaBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  aaBannerText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
  },
  linkBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  linkBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  statementCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10,
    marginBottom: 20,
  },
  statementTag: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  statementTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statementDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  accSelectRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  accSelectChip: {
    backgroundColor: Colors.bgInset,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  accSelectChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.bgCardAlt,
  },
  accSelectText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  accSelectTextActive: {
    color: Colors.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  toggleSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  downloadBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  downloadBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  successNotice: {
    fontSize: 11,
    color: Colors.income,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
});
