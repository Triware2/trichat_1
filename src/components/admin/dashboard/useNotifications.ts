
import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New user registration',
      message: 'John Doe has registered as an agent',
      time: '2 minutes ago',
      unread: true,
      type: 'info'
    },
    {
      id: '2',
      title: 'Data sync completed',
      message: 'CRM data synchronization finished successfully',
      time: '1 hour ago',
      unread: true,
      type: 'success'
    },
    {
      id: '3',
      title: 'System update',
      message: 'Scheduled maintenance completed',
      time: '3 hours ago',
      unread: false,
      type: 'info'
    },
    {
      id: '4',
      title: 'API rate limit warning',
      message: 'API usage is approaching daily limit',
      time: '5 hours ago',
      unread: true,
      type: 'warning'
    }
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification
  };
};
