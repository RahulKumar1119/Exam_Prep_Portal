import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DashboardData } from '../types/index';
import { apiClient } from '../services/api';

interface DashboardContextType {
  dashboard_data: DashboardData | null;
  is_loading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  clearError: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dashboard_data, setDashboardData] = useState<DashboardData | null>(null);
  const [is_loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<DashboardData>('/dashboard/performance');

      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        // If endpoint not found, show friendly message instead of error
        if (response.error?.includes('404') || response.error?.includes('not found')) {
          setError('Dashboard data is not available yet. Start practicing to see your progress!');
        } else {
          throw new Error(response.error || 'Failed to fetch dashboard data');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      // If it's a network error for missing endpoint, show friendly message
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        setError('Dashboard data is not available yet. Start practicing to see your progress!');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboard_data,
        is_loading,
        error,
        fetchDashboardData,
        clearError,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
