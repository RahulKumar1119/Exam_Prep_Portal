import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PracticeSession, SessionResult } from '../types/index';
import { apiClient } from '../services/api';
import { useAuth } from './AuthContext';
import { useDashboard } from './DashboardContext';

interface PracticeContextType {
  current_session: PracticeSession | null;
  session_result: SessionResult | null;
  is_loading: boolean;
  error: string | null;
  generatePracticeSet: (paper_name: string) => Promise<void>;
  submitPracticeSet: (session_id: string, answers: Record<string, string>) => Promise<void>;
  getSession: (session_id: string) => Promise<void>;
  clearSession: () => void;
  clearError: () => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export const PracticeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { fetchDashboardData } = useDashboard();
  const [current_session, setCurrentSession] = useState<PracticeSession | null>(null);
  const [session_result, setSessionResult] = useState<SessionResult | null>(null);
  const [is_loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePracticeSet = async (paper_name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.post<PracticeSession>(
        '/practice/generate',
        { 
          paper_name,
          user_id: user.user_id,
          action: 'generate'
        }
      );

      if (response.success && response.data) {
        setCurrentSession(response.data);
      } else {
        throw new Error(response.error || 'Failed to generate practice set');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate practice set';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitPracticeSet = async (session_id: string, answers: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.post<SessionResult>(
        '/practice/submit',
        { 
          session_id, 
          answers,
          user_id: user.user_id,
          action: 'submit'
        }
      );

      if (response.success && response.data) {
        setSessionResult(response.data);
        // Refresh dashboard so new scores appear immediately
        fetchDashboardData().catch(() => {});
      } else {
        throw new Error(response.error || 'Failed to submit practice set');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit practice set';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getSession = async (session_id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.get<PracticeSession>(
        `/practice/session/${session_id}`
      );

      if (response.success && response.data) {
        setCurrentSession(response.data);
      } else {
        throw new Error(response.error || 'Failed to retrieve session');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve session';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = () => {
    setCurrentSession(null);
    setSessionResult(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <PracticeContext.Provider
      value={{
        current_session,
        session_result,
        is_loading,
        error,
        generatePracticeSet,
        submitPracticeSet,
        getSession,
        clearSession,
        clearError,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
};

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error('usePractice must be used within PracticeProvider');
  }
  return context;
};
