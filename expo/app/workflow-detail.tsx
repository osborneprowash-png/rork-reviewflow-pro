import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ListChecks,
  Pencil,
  CheckCircle2,
  Calendar,
  MapPin,
  Wrench,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import CopyBlock from '@/components/CopyBlock';
import { useWorkflows } from '@/providers/WorkflowProvider';

export default function WorkflowDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getWorkflow, saveWorkflow } = useWorkflows();

  const workflow = useMemo(() => (id ? getWorkflow(id) : null), [id, getWorkflow]);

  const handleMarkComplete = useCallback(() => {
    if (!workflow) return;
    saveWorkflow({ ...workflow, status: 'completed' });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Complete', 'Workflow marked as complete!');
  }, [workflow, saveWorkflow]);

  const handleOpenChecklist = useCallback(() => {
    if (!workflow) return;
    router.push(`/checklist?id=${workflow.id}`);
  }, [workflow, router]);

  const handleViewContent = useCallback(() => {
    if (!workflow) return;
    router.push(`/generated-content?id=${workflow.id}`);
  }, [workflow, router]);

  if (!workflow) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Workflow not found.</Text>
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
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.headerInfo}>
            {workflow.customerName ? (
              <Text style={styles.customerName}>{workflow.customerName}</Text>
            ) : null}
            <View style={styles.metaRow}>
              <MapPin size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{workflow.city}</Text>
            </View>
            <View style={styles.metaRow}>
              <Wrench size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{workflow.services.join(', ')}</Text>
            </View>
            <View style={styles.metaRow}>
              <Calendar size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>
                {new Date(workflow.dateCreated).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              workflow.status === 'completed'
                ? styles.statusComplete
                : styles.statusPending,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                workflow.status === 'completed'
                  ? styles.statusTextComplete
                  : styles.statusTextPending,
              ]}
            >
              {workflow.status === 'completed' ? 'Complete' : 'In Progress'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewLabel}>Original Review</Text>
        <Text style={styles.reviewText} selectable>{workflow.reviewText}</Text>
      </View>

      {content && (
        <>
          <Text style={styles.sectionTitle}>Generated Content</Text>

          <CopyBlock title="Google Review Reply" content={content.googleReply} />
          <CopyBlock title="Facebook Business Caption" content={content.facebookBusinessCaption} />
          <CopyBlock title="First Comment" content={content.firstComment} />
          <CopyBlock title="Personal Share Caption" content={content.personalShareCaption} />
          <CopyBlock title="Story Caption" content={content.storyCaption} />
          <CopyBlock title="Image Prompt" content={content.imagePrompt} />
        </>
      )}

      <View style={styles.actions}>
        {content && (
          <Pressable style={styles.actionBtn} onPress={handleViewContent}>
            <Pencil size={18} color={Colors.gold} />
            <Text style={styles.actionBtnText}>View Full Content</Text>
          </Pressable>
        )}

        <Pressable style={styles.actionBtn} onPress={handleOpenChecklist}>
          <ListChecks size={18} color={Colors.gold} />
          <Text style={styles.actionBtnText}>Open Posting Checklist</Text>
        </Pressable>

        {workflow.status !== 'completed' && (
          <Pressable style={styles.completeBtn} onPress={handleMarkComplete}>
            <CheckCircle2 size={18} color={Colors.navy} />
            <Text style={styles.completeBtnText}>Mark Complete</Text>
          </Pressable>
        )}
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
  headerCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
    gap: 6,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.gold,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusComplete: {
    backgroundColor: Colors.successBg,
  },
  statusPending: {
    backgroundColor: Colors.goldMuted,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  statusTextComplete: {
    color: Colors.success,
  },
  statusTextPending: {
    color: Colors.gold,
  },
  reviewCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 12,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
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
  actionBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.gold,
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
