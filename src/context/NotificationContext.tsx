// src/context/NotificationContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  icon?: string; // Added icon as optional
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  success: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  warning: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>): string => {
      const id = uuidv4();
      const newNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration || 5000,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-dismiss after duration
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    [removeNotification]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper methods - removed 'icon' property from the object
  const success = useCallback(
    (title: string, message?: string, duration?: number): string => {
      return addNotification({
        type: 'success',
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const error = useCallback(
    (title: string, message?: string, duration?: number): string => {
      return addNotification({
        type: 'error',
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const warning = useCallback(
    (title: string, message?: string, duration?: number): string => {
      return addNotification({
        type: 'warning',
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number): string => {
      return addNotification({
        type: 'info',
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};