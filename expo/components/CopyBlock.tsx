import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

interface CopyBlockProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

export default React.memo(function CopyBlock({ title, content, icon }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(content);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => setCopied(false), 2000);
  }, [content, scaleAnim]);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {icon}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => [styles.copyBtn, copied && styles.copyBtnActive, pressed && styles.copyBtnPressed]}
          testID={`copy-${title}`}
        >
          {copied ? (
            <Check size={14} color={Colors.success} />
          ) : (
            <Copy size={14} color={Colors.gold} />
          )}
          <Text style={[styles.copyText, copied && styles.copyTextActive]}>
            {copied ? 'Copied' : 'Copy'}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.content} selectable>{content}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.goldMuted,
  },
  copyBtnActive: {
    backgroundColor: Colors.successBg,
  },
  copyBtnPressed: {
    opacity: 0.7,
  },
  copyText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.gold,
  },
  copyTextActive: {
    color: Colors.success,
  },
  content: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textPrimary,
  },
});
