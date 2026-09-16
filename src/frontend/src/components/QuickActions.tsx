import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  onAddPress: () => void;
  onTransferPress: () => void;
  onScanPress: () => void;
  onStatementPress: () => void;
}

export const QuickActions: React.FC<Props> = ({
  onAddPress,
  onTransferPress,
  onScanPress,
  onStatementPress,
}) => {
  const actions = [
    { label: 'Add Entry', icon: '➕', onPress: onAddPress },
    { label: 'Transfer', icon: '⇄', onPress: onTransferPress },
    { label: 'Scan UPI', icon: '⛶', onPress: onScanPress },
    { label: 'Export', icon: '📄', onPress: onStatementPress },
  ];

  return (
    <View style={styles.container}>
      {actions.map((act, index) => (
        <TouchableOpacity
          key={index}
          style={styles.actionBtn}
          onPress={act.onPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.actionIcon}>{act.icon}</Text>
          </View>
          <Text style={styles.actionLabel}>{act.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  actionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bgInset,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionIcon: {
    fontSize: 18,
    color: Colors.primary,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
