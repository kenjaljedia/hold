import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { ApiService } from '../services/api';
import { HoldAIMessage } from '../types';

export const HoldAIScreen: React.FC = () => {
  const [messages, setMessages] = useState<HoldAIMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hello Garv! I am Hold AI, your privacy-first financial assistant. You can ask me anything about your connected bank accounts, spending patterns, budgets, or recurring subscriptions.",
      timestamp: 'Just now',
      action_pills: [
        'How much on dining this month?',
        'Can I afford ₹15,000?',
        'What subscriptions are due?',
        'My net worth breakdown',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: HoldAIMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setLoading(true);

    try {
      const res = await ApiService.askHoldAI(textToSend);
      const assistantMsg: HoldAIMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'assistant',
        text: res.answer,
        timestamp: 'Just now',
        category: res.category,
        amount_found: res.amount_found,
        action_pills: res.action_pills,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          text: "I couldn't analyze the request at this moment. Please verify backend connection.",
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeIcon}>✨</Text>
        </View>
        <View>
          <Text style={styles.title}>Hold AI Assistant</Text>
          <Text style={styles.subtitle}>Context-aware financial reasoning</Text>
        </View>
      </View>

      {/* Chat messages */}
      <ScrollView style={styles.chatFeed} showsVerticalScrollIndicator={false}>
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <View key={msg.id} style={[styles.msgWrapper, isUser ? styles.msgWrapperUser : styles.msgWrapperAI]}>
              <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
                <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAI]}>
                  {msg.text}
                </Text>

                {msg.amount_found && (
                  <View style={styles.amountHighlight}>
                    <Text style={styles.amountTag}>DETECTED SPEND</Text>
                    <Text style={styles.amountVal}>₹{msg.amount_found.toLocaleString('en-IN')}</Text>
                  </View>
                )}
              </View>

              {/* Action Pills */}
              {msg.action_pills && msg.action_pills.length > 0 && (
                <View style={styles.actionPillsContainer}>
                  {msg.action_pills.map((pill, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.actionPill}
                      onPress={() => handleSend(pill)}
                    >
                      <Text style={styles.actionPillText}>{pill} ↗</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {loading && (
          <View style={styles.loadingBubble}>
            <Text style={styles.loadingText}>Hold AI is analyzing your accounts...</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Input row */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question about your money..."
          placeholderTextColor={Colors.textPlaceholder}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!inputText.trim() || loading) && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || loading}
        >
          <Text style={styles.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 49, 75, 0.4)',
    gap: 12,
  },
  aiBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBadgeIcon: {
    fontSize: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  chatFeed: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  msgWrapper: {
    marginBottom: 16,
  },
  msgWrapperUser: {
    alignItems: 'flex-end',
  },
  msgWrapperAI: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '86%',
    borderRadius: 18,
    padding: 14,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.bgCard,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: '#FFF',
    fontWeight: '600',
  },
  bubbleTextAI: {
    color: Colors.textPrimary,
  },
  amountHighlight: {
    backgroundColor: Colors.bgInset,
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  amountTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  amountVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  actionPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    maxWidth: '90%',
  },
  actionPill: {
    backgroundColor: Colors.bgInset,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  loadingBubble: {
    backgroundColor: Colors.bgInset,
    borderRadius: 14,
    padding: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: Colors.bgDark,
    borderRadius: 14,
    paddingHorizontal: 14,
    color: Colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.bgInset,
    opacity: 0.5,
  },
  sendBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
  },
});
