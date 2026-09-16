import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  isPrivacyMode: boolean;
  onTogglePrivacy: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ isPrivacyMode, onTogglePrivacy }) => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [currency, setCurrency] = useState('INR (₹)');

  const teamMembers = [
    { name: 'Garv Aditya Shandilya', roll: '2400290130077' },
    { name: 'Ishan Gupta', roll: '2400290130091' },
    { name: 'Kenjal Jedia', roll: '2400290130101' },
    { name: 'Rudraksh Sharma', roll: '2400290130147' },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>You & Settings</Text>
        <Text style={styles.subtitle}>Privacy-by-design architecture</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>GA</Text>
          </View>
          <View>
            <Text style={styles.userName}>Garv Aditya Shandilya</Text>
            <Text style={styles.userEmail}>garv@hold.money</Text>
            <View style={styles.activePlanBadge}>
              <Text style={styles.activePlanText}>HOLD PRO • BETA</Text>
            </View>
          </View>
        </View>

        {/* Privacy by Design Highlights */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>PRIVACY BY DESIGN</Text>
          <View style={styles.privacyPillRow}>
            <View style={styles.privacyBadge}>
              <Text style={styles.badgeCheck}>✓</Text>
              <Text style={styles.badgeTitle}>No SMS Scraping</Text>
            </View>
            <View style={styles.privacyBadge}>
              <Text style={styles.badgeCheck}>✓</Text>
              <Text style={styles.badgeTitle}>No Email Scraping</Text>
            </View>
          </View>
          <Text style={styles.privacyExplainer}>
            Unlike legacy trackers, Hold never accesses your SMS messages or email inbox. Data synchronization is mediated solely through regulated Account Aggregators with explicit user consent.
          </Text>
        </View>

        {/* Preferences */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>PREFERENCES & SECURITY</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Privacy Mode</Text>
              <Text style={styles.settingSubtitle}>Mask all financial figures with ₹ •••••</Text>
            </View>
            <Switch
              value={isPrivacyMode}
              onValueChange={onTogglePrivacy}
              trackColor={{ false: Colors.bgInset, true: Colors.primaryDark }}
              thumbColor={isPrivacyMode ? Colors.primary : Colors.textMuted}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Biometric Authentication</Text>
              <Text style={styles.settingSubtitle}>Require FaceID / Fingerprint on launch</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: Colors.bgInset, true: Colors.primaryDark }}
              thumbColor={biometricsEnabled ? Colors.primary : Colors.textMuted}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View>
              <Text style={styles.settingTitle}>Display Currency</Text>
              <Text style={styles.settingSubtitle}>Default financial symbol</Text>
            </View>
            <TouchableOpacity style={styles.currencyBtn} onPress={() => alert('Currency set to INR')}>
              <Text style={styles.currencyBtnText}>{currency}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Team Members Credits */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>PROJECT TEAM MEMBERS</Text>
          <Text style={styles.teamSub}>Batch: 2026-27 IT-B • Hold Wallet System</Text>

          <View style={styles.teamList}>
            {teamMembers.map((m, index) => (
              <View key={m.roll} style={styles.teamItem}>
                <View style={styles.teamNumber}>
                  <Text style={styles.teamNumberText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={styles.memberRoll}>Roll No: {m.roll}</Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>Author</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* System Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Hold Wallet Management System v1.0.0</Text>
          <Text style={styles.versionSub}>Designed with precision • Inspired by Fold Money</Text>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    gap: 16,
  },
  userAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  activePlanBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  activePlanText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  privacyPillRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInset,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
  },
  badgeCheck: {
    color: Colors.income,
    fontSize: 12,
    fontWeight: '900',
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  privacyExplainer: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  currencyBtn: {
    backgroundColor: Colors.bgInset,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  teamSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: -8,
    marginBottom: 14,
  },
  teamList: {
    gap: 10,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgDark,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  teamNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.bgInset,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  memberName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  memberRoll: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  statusPill: {
    backgroundColor: Colors.bgInset,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  versionSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
