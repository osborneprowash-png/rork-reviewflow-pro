import { useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { BrandProfile, DEFAULT_BRAND_PROFILE } from '@/types';

const STORAGE_KEY = 'reviewflow_brand_profile';

export const [BrandProfileProvider, useBrandProfile] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<BrandProfile>(DEFAULT_BRAND_PROFILE);

  const profileQuery = useQuery({
    queryKey: ['brandProfile'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as BrandProfile;
      }
      return DEFAULT_BRAND_PROFILE;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (updated: BrandProfile) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => {
      setProfile(data);
      queryClient.setQueryData(['brandProfile'], data);
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data]);

  const updateProfile = useCallback((updates: Partial<BrandProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      saveMutation.mutate(updated);
      return updated;
    });
  }, [saveMutation]);

  const isProfileSetup = profile.businessName.length > 0;

  return useMemo(() => ({
    profile,
    updateProfile,
    isProfileSetup,
    isLoading: profileQuery.isLoading,
    isSaving: saveMutation.isPending,
  }), [profile, updateProfile, isProfileSetup, profileQuery.isLoading, saveMutation.isPending]);
});
