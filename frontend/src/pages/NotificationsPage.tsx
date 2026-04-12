import React from 'react';
import { NotificationCenter } from '../components/NotificationCenter';

/**
 * NotificationsPage Component
 * 
 * Page for viewing all notifications
 * Displays notifications in reverse chronological order
 * Allows marking as read and deleting notifications
 */
const NotificationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationCenter />
    </div>
  );
};

export default NotificationsPage;
