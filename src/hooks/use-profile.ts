import { useState, useEffect, useCallback } from 'react';
import { profilesService } from '../services/profiles-service';
import type { Profile } from '../lib/types';

export type ProfileStatus = 'idle' | 'loading' | 'success' | 'error';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<ProfileStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setStatus('loading');
    setError(null);
    try {
      const data = await profilesService.getProfile();
      setProfile(data);
      setStatus('success');
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      const msg = err?.response?.data?.error || err.message || 'Failed to load profile';
      setError(msg);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (displayName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await profilesService.upsertProfile({ displayName });
      setProfile(updated);
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || 'Failed to update profile';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await profilesService.deleteProfile();
      setProfile(null);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || 'Failed to delete profile';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    if (status === 'error') setStatus('success');
  }, [status]);

  useEffect(() => {
    if (status === 'idle') {
      fetchProfile();
    }
  }, [status, fetchProfile]);

  return {
    profile,
    status,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    deleteProfile,
    clearError
  };
};
