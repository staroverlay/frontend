import { useState, useEffect, useCallback } from 'react';
import { useIntegrationsStore } from '../stores/integrations-store';
import { integrationsService } from '../services/integrations-service';
import { oauthService } from '../services/oauth-service';

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export const useIntegrations = () => {
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    integrations, 
    setIntegrations, 
    updateIntegration, 
    removeIntegration 
  } = useIntegrationsStore();

  const fetchIntegrations = useCallback(async () => {
    setIsLoading(true);
    setStatus('loading');
    setError(null);
    try {
      const data = await integrationsService.listIntegrations();
      setIntegrations(data);
      setStatus('success');
    } catch (err: any) {
      console.error('Failed to fetch integrations:', err);
      const msg = err?.response?.data?.error || err.message || 'Failed to connect to server';
      setError(msg);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [setIntegrations]);

  const clearError = useCallback(() => {
    setError(null);
    if (status === 'error') setStatus('success');
  }, [status]);

  useEffect(() => {
    // Only auto-fetch if we are in 'idle' state.
    if (status === 'idle') {
      fetchIntegrations();
    }
  }, [status, fetchIntegrations]);

  const disconnect = async (provider: string) => {
    setIsLoading(true);
    try {
      await integrationsService.disconnectIntegration(provider);
      removeIntegration(provider);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (provider: string, body: any) => {
    setIsLoading(true);
    try {
      const updated = await integrationsService.updateIntegration(provider, body);
      updateIntegration(updated);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const connect = async (provider: string) => {
    setIsLoading(true);
    try {
      const response = await oauthService.initiateConnect(provider);
      window.location.href = response.url;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const initiateOAuthLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      const response = await oauthService.initiateLogin(provider);
      window.location.href = response.url;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    integrations,
    status,
    isLoading,
    error,
    fetchIntegrations,
    disconnect,
    update,
    connect,
    initiateOAuthLogin,
    clearError
  };
};
