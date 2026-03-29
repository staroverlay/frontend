import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth-store';
import { authService } from '../services/auth-service';
import type { AuthResponse } from '../lib/types';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, setUser, setAuthenticated, setLoading, logout: storeLogout } = useAuthStore();

  const fetchUser = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      storeLogout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, setUser, setLoading, storeLogout]);

  useEffect(() => {
    if (isAuthenticated && !user && !isLoading) {
      fetchUser();
    }
  }, [isAuthenticated, user, isLoading, fetchUser]);

  const login = async (payload: any) => {
    setLoading(true);
    try {
      const response: AuthResponse = await authService.login(payload);
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
      setUser(response.user);
      setAuthenticated(true);
      navigate('/');
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: any) => {
    setLoading(true);
    try {
      const response = await authService.register(payload);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storeLogout();
      navigate('/login');
      setLoading(false);
    }
  };

  const verifyEmail = async (payload: any) => {
    setLoading(true);
    try {
      const response = await authService.verifyEmail(payload);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    refreshUser: fetchUser
  };
};
