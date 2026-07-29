import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  MessageCircle,
  Facebook,
  MessageSquare,
  Share2,
  Camera,
  Image,
  ListChecks,
  Save,
  CheckCircle2,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import CopyBlock from '@/components/CopyBlock';
import { useWorkflows } from '@/providers/WorkflowProvider';

const POSTING_ORDER = [
  { step: 1, label: 'Reply in Google Business Profile', icon: MessageCircle },
  { step: 2, label: 'Post on business Facebook page', icon: Facebook },
  { step: 3, label: 'Add first comment under post', icon: MessageSquare },
  { step: 4, label: 'Share to personal Facebook page', icon: Share2 },
  { step: 5, label: 'Post to story', icon: Camera },
];

export default function GeneratedContentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getWorkflow, saveWorkflow } = useWorkflows();

  const workflow = useMemo(() => (id ? getWorkflow(id) : null), [id, getWorkflow]);

  const handleSaveToHistory = useCallback(() => {
    if (!workflow) return;
    saveWorkflow({ ...workflow, status: 'in_progress' });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Saved', 'Workflow saved to history.');
  }, [workflow, saveWorkflow]);

  const handleOpenChecklist = useCallback(() => {
    if (!workflow) return;
    router.push(`/checklist?id=${workflow.id}`);
  }, [workflow, router]);

  const handleMarkComplete = useCallback(() => {
    if (!workflow) return;
    saveWorkflow({ ...workflow, status: 'completed' });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Complete', 'Workflow marked as complete!', [
      { text: 'View History', onPress: () => router.replace('/history') },
      { text: 'OK' },
    ]);
  }, [workflow, saveWorkflow, router]);

  if (!workflow || !workflow.generatedContent) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No content found.</Text>
      </View>
    );
  }

  const content = workflow.generatedContent;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.orderSection}>
        <Text style={styles.orderTitle}>Posting Order</Text>
        <View style={styles.orderList}>
          {POSTING_ORDER.map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.step} style={styles.orderItem}>
                <View style={styles.orderStepBadge}>
                  <Text style={styles.orderStepText}>{item.step}</Text>
                </View>
                <Icon size={14} color={Colors.textSecondary} />
                <Text style={styles.orderLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <CopyBlock
        title="Google Review Reply"
        content={content.googleReply}
        icon={<MessageCircle size={14} color={Colors.gold} />}
      />

      <CopyBlock
        title="Facebook Business Caption"
        content={content.facebookBusinessCaption}
        icon={<Facebook size={14} color={Colors.gold} />}
      />

      <CopyBlock
        title="First Comment"
        content={content.firstComment}
        icon={<MessageSquare size={14} color={Colors.gold} />}
      />

      <CopyBlock
        title="Personal Share Caption"
        content={content.personalShareCaption}
        icon={<Share2 size={14} color={Colors.gold} />}
      />

      <CopyBlock
        title="Story Caption"
        content={content.storyCaption}
        icon={<Camera size={14} color={Colors.gold} />}
      />

      <CopyBlock
        title="Image Prompt"
        content={content.imagePrompt}
        icon={<Image size={14} color={Colors.gold} />}
      />

      {content.suggestedCTA ? (
        <View style={styles.metaCard}>
          <Text style={styles.metaTitle}>Suggested CTA</Text>
          <Text style={styles.metaText}>{content.suggestedCTA}</Text>
        </View>
      ) : null}

      {content.keywordsUsed ? (
        <View style={styles.metaCard}>
          <Text style={styles.metaTitle}>Keywords Used</Text>
          <Text style={styles.metaText}>{content.keywordsUsed}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable style={styles.checklistBtn} onPress={handleOpenChecklist}>
          <ListChecks size={18} color={Colors.gold} />
          <Text style={styles.checklistBtnText}>Open Posting Checklist</Text>
        </Pressable>

        <Pressable style={styles.saveBtn} onPress={handleSaveToHistory}>
          <Save size={18} color={Colors.white} />
          <Text style={styles.saveBtnText}>Save to History</Text>
        </Pressable>

        <Pressable style={styles.completeBtn} onPress={handleMarkComplete}>
          <CheckCircle2 size={18} color={Colors.navy} />
          <Text style={styles.completeBtnText}>Mark Workflow Complete</Text>
        </Pressable>
      </View>

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
  orderSection: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  orderTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  orderList: {
    gap: 10,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderStepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderStepText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.gold,
  },
  orderLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
  },
  metaCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  metaTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
  checklistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gold,
    backgroundColor: Colors.goldMuted,
  },
  checklistBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.gold,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.gold,
  },
  completeBtnText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.navy,
  },
});
