import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors } from '../theme/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { AccountsScreen } from '../screens/AccountsScreen';
import { HoldAIScreen } from '../screens/HoldAIScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type TabKey = 'home' | 'transactions' | 'analytics' | 'accounts' | 'ai' | 'profile';

export const BottomTabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'home', label: 'Home', icon: '🏛️' },
    { key: 'transactions', label: 'Activity', icon: '🧾' },
    { key: 'analytics', label: 'Insights', icon: '📊' },
    { key: 'accounts', label: 'Banks', icon: '💳' },
    { key: 'ai', label: 'Hold AI', icon: '✨' },
    { key: 'profile', label: 'You', icon: '👤' },
  ];

  const handleTogglePrivacy = () => {
    setIsPrivacyMode(prev => !prev);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen
            isPrivacyMode={isPrivacyMode}
            onTogglePrivacy={handleTogglePrivacy}
            onNavigateTransactions={() => setActiveTab('transactions')}
            onNavigateAccounts={() => setActiveTab('accounts')}
          />
        )}
        {activeTab === 'transactions' && (
          <TransactionsScreen isPrivacyMode={isPrivacyMode} />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsScreen isPrivacyMode={isPrivacyMode} />
        )}
        {activeTab === 'accounts' && (
          <AccountsScreen isPrivacyMode={isPrivacyMode} />
        )}
        {activeTab === 'ai' && (
          <HoldAIScreen />
        )}
        {activeTab === 'profile' && (
          <ProfileScreen
            isPrivacyMode={isPrivacyMode}
            onTogglePrivacy={handleTogglePrivacy}
          />
        )}
      </View>

      {/* Sleek Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    paddingBottom: 6,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  tabItemActive: {
    transform: [{ scale: 1.05 }],
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 3,
  },
});
