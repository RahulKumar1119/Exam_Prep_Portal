import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/index';
import { apiClient } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string, bank_affiliation: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, new_password: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    access_token: null,
    refresh_token: null,
    is_authenticated: false,
    is_loading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          setAuthState((prev) => ({
            ...prev,
            access_token: token,
            user: JSON.parse(user),
            is_authenticated: true,
            is_loading: false,
          }));
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setAuthState((prev) => ({
            ...prev,
            is_loading: false,
          }));
        }
      } else {
        setAuthState((prev) => ({
          ...prev,
          is_loading: false,
        }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, is_loading: true, error: null }));
    try {
      const response = await apiClient.post<{
        access_token: string;
        refresh_token: string;
        user: User;
      }>('/auth/login', { email, password });

      if (response.success && response.data) {
        const { access_token, refresh_token, user } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(user));

        setAuthState({
          user,
          access_token,
          refresh_token,
          is_authenticated: true,
          is_loading: false,
          error: null,
        });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState((prev) => ({
        ...prev,
        is_loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    full_name: string,
    bank_affiliation: string
  ) => {
    setAuthState((prev) => ({ ...prev, is_loading: true, error: null }));
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/register',
        { email, password, full_name, bank_affiliation }
      );

      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }

      setAuthState((prev) => ({
        ...prev,
        is_loading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState((prev) => ({
        ...prev,
        is_loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, is_loading: true }));
    try {
      await apiClient.post('/auth/logout', {});
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

      setAuthState({
        user: null,
        access_token: null,
        refresh_token: null,
        is_authenticated: false,
        is_loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

      setAuthState({
        user: null,
        access_token: null,
        refresh_token: null,
        is_authenticated: false,
        is_loading: false,
        error: null,
      });
    }
  };

  const verifyEmail = async (token: string) => {
    setAuthState((prev) => ({ ...prev, is_loading: true, error: null }));
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/verify-email',
        { token }
      );

      if (!response.success) {
        throw new Error(response.error || 'Email verification failed');
      }

      setAuthState((prev) => ({
        ...prev,
        is_loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed';
      setAuthState((prev) => ({
        ...prev,
        is_loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    setAuthState((prev) => ({ ...prev, is_loading: true, error: null }));
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/password-reset-request',
        { email }
      );

      if (!response.success) {
        throw new Error(response.error || 'Password reset request failed');
      }

      setAuthState((prev) => ({
        ...prev,
        is_loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset request failed';
      setAuthState((prev) => ({
        ...prev,
        is_loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const resetPassword = async (token: string, new_password: string) => {
    setAuthState((prev) => ({ ...prev, is_loading: true, error: null }));
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/password-reset',
        { token, new_password }
      );

      if (!response.success) {
        throw new Error(response.error || 'Password reset failed');
      }

      setAuthState((prev) => ({
        ...prev,
        is_loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setAuthState((prev) => ({
        ...prev,
        is_loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({
      ...prev,
      error: null,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        verifyEmail,
        requestPasswordReset,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
