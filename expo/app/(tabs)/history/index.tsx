import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, ChevronRight, Inbox } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useWorkflows } from '@/providers/WorkflowProvider';
import { ReviewWorkflow } from '@/types';

export default function HistoryScreen() {
  const router = useRouter();
  const { workflows, deleteWorkflow } = useWorkflows();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return workflows;
    return workflows.filter(
      (w) =>
        w.city.toLowerCase().includes(q) ||
        w.services.some((s) => s.toLowerCase().includes(q)) ||
        w.customerName.toLowerCase().includes(q) ||
        w.reviewText.toLowerCase().includes(q)
    );
  }, [workflows, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );
  }, [filtered]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete Workflow', 'Are you sure you want to delete this workflow?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            deleteWorkflow(id);
          },
        },
      ]);
    },
    [deleteWorkflow]
  );

  const renderItem = useCallback(
    ({ item }: { item: ReviewWorkflow }) => {
      const statusColor =
        item.status === 'completed'
          ? Colors.success
          : item.status === 'generated' || item.status === 'in_progress'
          ? Colors.gold
          : Colors.textMuted;
      const statusBg =
        item.status === 'completed'
          ? Colors.successBg
          : item.status === 'generated' || item.status === 'in_progress'
          ? Colors.goldMuted
          : 'rgba(90,100,120,0.12)';
      const statusLabel =
        item.status === 'completed'
          ? 'Complete'
          : item.status === 'generated'
          ? 'Generated'
          : item.status === 'in_progress'
          ? 'In Progress'
          : 'Draft';

      return (
        <Pressable
          style={styles.card}
          onPress={() => router.push(`/workflow-detail?id=${item.id}`)}
          onLongPress={() => handleDelete(item.id)}
        >
          <View style={styles.cardTop}>
            <View style={styles.cardInfo}>
              {item.customerName ? (
                <Text style={styles.cardName}>{item.customerName}</Text>
              ) : null}
              <Text style={styles.cardCity}>{item.city}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: statusBg }]}>
              <Text style={[styles.badgeText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
          </View>
          <Text style={styles.cardServices} numberOfLines={1}>
            {item.services.join(', ')}
          </Text>
          <Text style={styles.cardPreview} numberOfLines={2}>
            {item.reviewText}
          </Text>
          <View style={styles.cardBottom}>
            <Text style={styles.cardDate}>
              {new Date(item.dateCreated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
            <ChevronRight size={16} color={Colors.textMuted} />
          </View>
        </Pressable>
      );
    },
    [router, handleDelete]
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <Search size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by city, service, customer..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Inbox size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Workflows Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start a new review workflow from the Home tab
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.gold,
    marginBottom: 2,
  },
  cardCity: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  cardServices: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  cardPreview: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.white,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
