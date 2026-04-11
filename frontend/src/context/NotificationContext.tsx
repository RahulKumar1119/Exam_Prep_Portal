import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification } from '../types/index';
import { apiClient } from '../services/api';

interface NotificationContextType {
  notifications: Notification[];
  unread_count: number;
  is_loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notification_id: string) => Promise<void>;
  deleteNotification: (notification_id: string) => Promise<void>;
  clearError: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread_count, setUnreadCount] = useState(0);
  const [is_loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ notifications: Notification[] }>(
        '/notifications'
      );

      if (response.success && response.data) {
        setNotifications(response.data.notifications);
        const unread = response.data.notifications.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } else {
        throw new Error(response.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notification_id: string) => {
    try {
      const response = await apiClient.put<{ message: string }>(
        `/notifications/${notification_id}/read`,
        {}
      );

      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.notification_id === notification_id ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        throw new Error(response.error || 'Failed to mark notification as read');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark notification as read';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteNotification = async (notification_id: string) => {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `/notifications/${notification_id}`
      );

      if (response.success) {
        setNotifications((prev) =>
          prev.filter((n) => n.notification_id !== notification_id)
        );
      } else {
        throw new Error(response.error || 'Failed to delete notification');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete notification';
      setError(errorMessage);
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unread_count,
        is_loading,
        error,
        fetchNotifications,
        markAsRead,
        deleteNotification,
        clearError,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
