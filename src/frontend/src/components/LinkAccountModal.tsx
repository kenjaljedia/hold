import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAccountLinked: (acc: { institution_name: string; account_type: any; initial_balance: number; ifsc_code: string }) => void;
}

export const LinkAccountModal: React.FC<Props> = ({ visible, onClose, onAccountLinked }) => {
  const [step, setStep] = useState<'select' | 'otp' | 'success'>('select');
  const [selectedBank, setSelectedBank] = useState('Axis Bank');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('123456');

  const popularBanks = [
    { name: 'Axis Bank', ifsc: 'UTIB0001928', color: '#97144D', balance: 54200 },
    { name: 'Kotak Mahindra Bank', ifsc: 'KKBK0000214', color: '#ED1B24', balance: 78900 },
    { name: 'Bank of Baroda', ifsc: 'BARB0VARDHA', color: '#F26522', balance: 41200 },
    { name: 'Zerodha Securities', ifsc: 'ZERODHA001', color: '#387ED1', balance: 120000 },
  ];

  const handleSelectBank = (bankName: string) => {
    setSelectedBank(bankName);
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    const bank = popularBanks.find(b => b.name === selectedBank) || popularBanks[0];
    onAccountLinked({
      institution_name: bank.name,
      account_type: bank.name.includes('Zerodha') ? 'investment' : 'savings',
      initial_balance: bank.balance,
      ifsc_code: bank.ifsc,
    });
    setStep('success');
    setTimeout(() => {
      setStep('select');
      onClose();
    }, 1200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Link Bank Account</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {step === 'select' && (
            <View>
              <View style={styles.aaNoticeBox}>
                <Text style={styles.aaNoticeTitle}>🛡️ RBI Account Aggregator Framework</Text>
                <Text style={styles.aaNoticeBody}>
                  Hold connects securely via Government-regulated Account Aggregator APIs. No passwords, no SMS scraping, and zero email reading.
                </Text>
              </View>

              <Text style={styles.sectionHeader}>SUPPORTED INSTITUTIONS</Text>
              <View style={styles.bankList}>
                {popularBanks.map(b => (
                  <TouchableOpacity
                    key={b.name}
                    style={styles.bankItem}
                    onPress={() => handleSelectBank(b.name)}
                  >
                    <View style={[styles.bankLogo, { backgroundColor: b.color }]}>
                      <Text style={styles.bankLogoText}>{b.name.substring(0, 2).toUpperCase()}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bankNameText}>{b.name}</Text>
                      <Text style={styles.bankIfscText}>IFSC: {b.ifsc}</Text>
                    </View>
                    <Text style={styles.arrowText}>→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 'otp' && (
            <View>
              <Text style={styles.otpHeading}>Verify Consent for {selectedBank}</Text>
              <Text style={styles.otpSubheading}>
                An authentication challenge was sent to +91 {phone}. Enter the one-time password below to grant read-only balance consent.
              </Text>

              <Text style={styles.inputLabel}>CONSENT OTP</Text>
              <TextInput
                style={styles.otpInput}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />

              <TouchableOpacity style={styles.verifyBtn} onPress={handleVerifyOtp}>
                <Text style={styles.verifyBtnText}>Confirm Consent & Sync</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'success' && (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>Connected Successfully!</Text>
              <Text style={styles.successSub}>{selectedBank} is now active and synced to Hold.</Text>
            </View>
          )}
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
  aaNoticeBox: {
    backgroundColor: Colors.bgInset,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  aaNoticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  aaNoticeBody: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  bankList: {
    gap: 10,
    marginBottom: 20,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgDark,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bankLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bankLogoText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  bankNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bankIfscText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  arrowText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  otpHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  otpSubheading: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  otpInput: {
    backgroundColor: Colors.bgDark,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 8,
    marginBottom: 20,
  },
  verifyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.incomeLight,
    color: Colors.income,
    fontSize: 28,
    lineHeight: 56,
    textAlign: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  successSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
