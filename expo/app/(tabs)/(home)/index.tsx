import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Plus,
  Clock,
  User,
  Star,
  MessageSquare,
  Share2,
  CheckCircle2,
  ChevronRight,
  Zap,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useBrandProfile } from '@/providers/BrandProfileProvider';
import { useWorkflows } from '@/providers/WorkflowProvider';

const SOP_STEPS = [
  { label: 'Paste review', icon: MessageSquare },
  { label: 'Enter city + service', icon: Star },
  { label: 'Generate content', icon: Zap },
  { label: 'Copy & post reply', icon: Share2 },
  { label: 'Post on social', icon: Share2 },
  { label: 'Mark complete', icon: CheckCircle2 },
];

function ActionCard({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        pressed && styles.actionCardPressed,
      ]}
    >
      <View style={[styles.actionIconWrap, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <View style={styles.actionTextWrap}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { profile, isProfileSetup } = useBrandProfile();
  const { recentWorkflows, completedCount, workflows } = useWorkflows();

  const greeting = isProfileSetup
    ? `Welcome back, ${profile.ownerName || profile.businessName}`
    : 'Welcome to ReviewFlow Pro';

  const handleNewWorkflow = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/new-workflow');
  }, [router]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.greetingSub}>
          {workflows.length === 0
            ? 'Start your first review workflow'
            : `${completedCount} workflow${completedCount !== 1 ? 's' : ''} completed`}
        </Text>
      </View>

      <Pressable onPress={handleNewWorkflow} style={styles.heroBtn} testID="new-workflow-btn">
        <View style={styles.heroBtnInner}>
          <View style={styles.heroBtnIcon}>
            <Plus size={24} color={Colors.navy} />
          </View>
          <View style={styles.heroBtnText}>
            <Text style={styles.heroBtnTitle}>New Review Workflow</Text>
            <Text style={styles.heroBtnSub}>
              Turn a 5-star review into social content
            </Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.actionsSection}>
        <ActionCard
          title="Past Reviews"
          subtitle={`${workflows.length} saved workflow${workflows.length !== 1 ? 's' : ''}`}
          icon={<Clock size={20} color={Colors.gold} />}
          color={Colors.gold}
          onPress={() => router.push('/history')}
        />
        <ActionCard
          title="Brand Profile"
          subtitle={isProfileSetup ? profile.businessName : 'Set up your brand'}
          icon={<User size={20} color="#6C9BF2" />}
          color="#6C9BF2"
          onPress={() => router.push('/profile')}
        />
      </View>

      <View style={styles.sopSection}>
        <Text style={styles.sectionTitle}>Quick SOP Checklist</Text>
        <Text style={styles.sectionSub}>Your review workflow at a glance</Text>
        <View style={styles.sopList}>
          {SOP_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <View key={index} style={styles.sopItem}>
                <View style={styles.sopNumber}>
                  <Text style={styles.sopNumberText}>{index + 1}</Text>
                </View>
                <Icon size={16} color={Colors.textSecondary} />
                <Text style={styles.sopLabel}>{step.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {recentWorkflows.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Workflows</Text>
          {recentWorkflows.map((wf) => (
            <Pressable
              key={wf.id}
              style={styles.recentCard}
              onPress={() => router.push(`/workflow-detail?id=${wf.id}`)}
            >
              <View style={styles.recentTop}>
                <Text style={styles.recentCity}>{wf.city}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    wf.status === 'completed'
                      ? styles.statusComplete
                      : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      wf.status === 'completed'
                        ? styles.statusTextComplete
                        : styles.statusTextPending,
                    ]}
                  >
                    {wf.status === 'completed' ? 'Done' : 'In Progress'}
                  </Text>
                </View>
              </View>
              <Text style={styles.recentServices} numberOfLines={1}>
                {wf.services.join(', ')}
              </Text>
              <Text style={styles.recentDate}>
                {new Date(wf.dateCreated).toLocaleDateString()}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

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
    paddingTop: 8,
  },
  greetingSection: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  greetingSub: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  heroBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  heroBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  heroBtnIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBtnText: {
    flex: 1,
  },
  heroBtnTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.navy,
    marginBottom: 2,
  },
  heroBtnSub: {
    fontSize: 13,
    color: 'rgba(10, 22, 40, 0.7)',
  },
  actionsSection: {
    gap: 10,
    marginBottom: 28,
  },
  actionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  actionCardPressed: {
    opacity: 0.7,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sopSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  sopList: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sopNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sopNumberText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.gold,
  },
  sopLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  recentSection: {
    marginBottom: 20,
  },
  recentCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  recentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentCity: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusComplete: {
    backgroundColor: Colors.successBg,
  },
  statusPending: {
    backgroundColor: Colors.goldMuted,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  statusTextComplete: {
    color: Colors.success,
  },
  statusTextPending: {
    color: Colors.gold,
  },
  recentServices: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  recentDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
