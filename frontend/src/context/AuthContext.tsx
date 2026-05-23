import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { User, AuthState } from '../types/index';
import { apiClient } from '../services/api';

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;       // 5 minutes
const WARN_BEFORE_MS  = 1 * 60 * 1000;        // warn 1 minute before logout
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, new_password: string) => Promise<void>;
  clearError: () => void;
  sessionWarning: boolean;
  extendSession: () => void;
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
  const [sessionWarning, setSessionWarning] = useState(false);
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAuthRef  = useRef(false);

  // Keep ref in sync so event listeners always see latest value
  useEffect(() => { isAuthRef.current = authState.is_authenticated; }, [authState.is_authenticated]);

  const clearTimers = () => {
    if (idleTimer.current)  clearTimeout(idleTimer.current);
    if (warnTimer.current)  clearTimeout(warnTimer.current);
  };

  const doLogout = useCallback(async () => {
    clearTimers();
    setSessionWarning(false);
    try { await apiClient.post('/auth/logout', {}); } catch {}
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    setAuthState({ user: null, access_token: null, refresh_token: null, is_authenticated: false, is_loading: false, error: null });
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (!isAuthRef.current) return;
    clearTimers();
    setSessionWarning(false);
    warnTimer.current = setTimeout(() => setSessionWarning(true), IDLE_TIMEOUT_MS - WARN_BEFORE_MS);
    idleTimer.current = setTimeout(() => doLogout(), IDLE_TIMEOUT_MS);
  }, [doLogout]);

  const extendSession = useCallback(() => { resetIdleTimer(); }, [resetIdleTimer]);

  // Attach / detach activity listeners when auth state changes
  useEffect(() => {
    if (!authState.is_authenticated) { clearTimers(); setSessionWarning(false); return; }
    resetIdleTimer();
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));
    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, resetIdleTimer));
    };
  }, [authState.is_authenticated, resetIdleTimer]);

  // Initialize auth state from sessionStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = sessionStorage.getItem('access_token');
      const user = sessionStorage.getItem('user');

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
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('user');
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
        user_id: string;
        email: string;
        role: string;
        full_name: string;
      }>('/auth/login', { email, password });

      if (response.success && response.data) {
        const { access_token, refresh_token, user_id, email: userEmail, role, full_name } = response.data;
        
        // Construct user object from response with default values for missing fields
        const user: User = {
          user_id,
          email: userEmail,
          role: role as 'bank_officer' | 'trainer' | 'admin',
          full_name,
          bank_affiliation: '',
          email_verified: true,
          created_at: new Date().toISOString(),
          status: 'active',
        };
        
        sessionStorage.setItem('access_token', access_token);
        sessionStorage.setItem('refresh_token', refresh_token);
        sessionStorage.setItem('user', JSON.stringify(user));

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
    full_name: string
  ) => {
    setAuthState((prev) => ({ ...prev, is_loading: true, error: null }));
    try {
      const response = await apiClient.post<{ message: string }>(
        '/auth/register',
        { email, password, full_name }
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

  const logout = async () => { await doLogout(); };

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
        sessionWarning,
        extendSession,
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
