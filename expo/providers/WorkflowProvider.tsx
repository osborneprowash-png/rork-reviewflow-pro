import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { ReviewWorkflow } from '@/types';

const STORAGE_KEY = 'reviewflow_workflows';

export const [WorkflowProvider, useWorkflows] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [workflows, setWorkflows] = useState<ReviewWorkflow[]>([]);

  const workflowsQuery = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as ReviewWorkflow[];
      }
      return [] as ReviewWorkflow[];
    },
  });

  const persistMutation = useMutation({
    mutationFn: async (updated: ReviewWorkflow[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['workflows'], data);
    },
  });

  const persistRef = useRef(persistMutation);
  persistRef.current = persistMutation;

  useEffect(() => {
    if (workflowsQuery.data) {
      setWorkflows(workflowsQuery.data);
    }
  }, [workflowsQuery.data]);

  const saveWorkflow = useCallback((workflow: ReviewWorkflow) => {
    setWorkflows((prev) => {
      const existing = prev.findIndex((w) => w.id === workflow.id);
      let updated: ReviewWorkflow[];
      if (existing >= 0) {
        updated = [...prev];
        updated[existing] = workflow;
      } else {
        updated = [workflow, ...prev];
      }
      persistRef.current.mutate(updated);
      return updated;
    });
  }, []);

  const deleteWorkflow = useCallback((id: string) => {
    setWorkflows((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      persistRef.current.mutate(updated);
      return updated;
    });
  }, []);

  const getWorkflow = useCallback((id: string) => {
    return workflows.find((w) => w.id === id) ?? null;
  }, [workflows]);

  const recentWorkflows = useMemo(() => {
    return [...workflows]
      .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
      .slice(0, 5);
  }, [workflows]);

  const completedCount = useMemo(() => {
    return workflows.filter((w) => w.status === 'completed').length;
  }, [workflows]);

  return useMemo(() => ({
    workflows,
    recentWorkflows,
    completedCount,
    saveWorkflow,
    deleteWorkflow,
    getWorkflow,
    isLoading: workflowsQuery.isLoading,
  }), [workflows, recentWorkflows, completedCount, saveWorkflow, deleteWorkflow, getWorkflow, workflowsQuery.isLoading]);
});

export function useWorkflowById(id: string) {
  const { getWorkflow } = useWorkflows();
  return useMemo(() => getWorkflow(id), [getWorkflow, id]);
}
