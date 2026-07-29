import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Circle, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useWorkflows } from '@/providers/WorkflowProvider';
import { ChecklistState } from '@/types';

interface ChecklistItem {
  key: keyof ChecklistState;
  label: string;
  group: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { key: 'copiedGoogleReply', label: 'Copy Google reply', group: 'Google Business Profile' },
  { key: 'pastedInGBP', label: 'Paste in Google Business Profile', group: 'Google Business Profile' },
  { key: 'clickedReply', label: 'Click Reply', group: 'Google Business Profile' },
  { key: 'copiedFacebookCaption', label: 'Copy Facebook business caption', group: 'Facebook Business Page' },
  { key: 'createdBusinessPost', label: 'Create business page post', group: 'Facebook Business Page' },
  { key: 'copiedFirstComment', label: 'Copy first comment', group: 'Facebook Business Page' },
  { key: 'addedFirstComment', label: 'Add first comment under post', group: 'Facebook Business Page' },
  { key: 'sharedToPersonal', label: 'Share post to personal page', group: 'Personal Facebook' },
  { key: 'copiedPersonalCaption', label: 'Copy personal share caption', group: 'Personal Facebook' },
  { key: 'postedStory', label: 'Post story', group: 'Story' },
  { key: 'markedComplete', label: 'Mark workflow complete', group: 'Finish' },
];

export default function ChecklistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getWorkflow, saveWorkflow } = useWorkflows();

  const workflow = useMemo(() => (id ? getWorkflow(id) : null), [id, getWorkflow]);

  const progress = useMemo(() => {
    if (!workflow) return 0;
    const checklist = workflow.checklist;
    const total = CHECKLIST_ITEMS.length;
    const completed = CHECKLIST_ITEMS.filter((item) => checklist[item.key]).length;
    return completed / total;
  }, [workflow]);

  const handleToggle = useCallback(
    (key: keyof ChecklistState) => {
      if (!workflow) return;
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const updatedChecklist = {
        ...workflow.checklist,
        [key]: !workflow.checklist[key],
      };

      const allDone = CHECKLIST_ITEMS.every((item) => {
        if (item.key === key) return !workflow.checklist[key];
        return updatedChecklist[item.key];
      });

      saveWorkflow({
        ...workflow,
        checklist: updatedChecklist,
        status: allDone ? 'completed' : 'in_progress',
      });

      if (allDone) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('All Done!', 'Great job completing this workflow!', [
          { text: 'View History', onPress: () => router.replace('/history') },
          { text: 'OK' },
        ]);
      }
    },
    [workflow, saveWorkflow, router]
  );

  if (!workflow) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No workflow found.</Text>
      </View>
    );
  }

  const groups = CHECKLIST_ITEMS.reduce(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<string, ChecklistItem[]>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoCity}>{workflow.city}</Text>
        <Text style={styles.infoServices}>{workflow.services.join(', ')}</Text>
      </View>

      {Object.entries(groups).map(([group, items]) => (
        <View key={group} style={styles.groupSection}>
          <Text style={styles.groupTitle}>{group}</Text>
          {items.map((item) => {
            const checked = workflow.checklist[item.key];
            return (
              <Pressable
                key={item.key}
                style={[styles.checkItem, checked && styles.checkItemDone]}
                onPress={() => handleToggle(item.key)}
              >
                {checked ? (
                  <CheckCircle2 size={22} color={Colors.success} />
                ) : (
                  <Circle size={22} color={Colors.textMuted} />
                )}
                <Text style={[styles.checkLabel, checked && styles.checkLabelDone]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  progressSection: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.gold,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.inputBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.gold,
    borderRadius: 4,
  },
  infoCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  infoCity: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
    marginBottom: 2,
  },
  infoServices: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  groupSection: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  checkItemDone: {
    backgroundColor: Colors.successBg,
    borderColor: 'rgba(52, 199, 89, 0.2)',
  },
  checkLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  checkLabelDone: {
    color: Colors.success,
    textDecorationLine: 'line-through',
  },
});
