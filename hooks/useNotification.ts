// hooks/useNotification.ts
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { RootState, AppDispatch } from '@/src/redux';
import {
  initializeNotifications,
  deactivateDevice,
  addNotification,
  updateBadgeCount,
  clearBadges,
  updateNotificationSettings,
  markNotificationAsRead,
  clearAllNotifications,
} from '@/src/redux/slices/notificationSlice';
import { notificationService } from '@/src/services/notification.service';

export interface UseNotificationReturn {
  // State
  pushToken: string | null;
  permissionStatus: 'undetermined' | 'granted' | 'denied';
  isInitialized: boolean;
  notifications: Notifications.Notification[];
  unreadCount: number;
  badgeCount: number;
  settings: {
    appointments: boolean;
    messages: boolean;
    promotions: boolean;
  };
  loading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  deactivate: () => Promise<void>;
  updateSettings: (key: 'appointments' | 'messages' | 'promotions', value: boolean) => void;
  setBadge: (count: number) => Promise<void>;
  clearAllBadges: () => Promise<void>;
  markAsRead: (notificationId: string) => void;
  clearAll: () => void;
  scheduleLocal: (title: string, body: string, data?: Record<string, any>) => Promise<void>;
  showLocal: (title: string, body: string, data?: Record<string, any>) => Promise<void>;
}

/**
 * Custom hook for managing notifications
 * Handles initialization, permissions, and navigation from notifications
 */
export const useNotification = (): UseNotificationReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    pushToken,
    permissionStatus,
    isInitialized,
    notifications,
    unreadCount,
    badgeCount,
    settings,
    loading,
    error,
  } = useSelector((state: RootState) => state.notification);

  const { user } = useSelector((state: RootState) => state.auth);

  /**
   * Initialize notifications service
   */
  const initialize = useCallback(async () => {
    if (!user?.id) {
      console.warn('⚠️ Cannot initialize notifications: User not logged in');
      return;
    }

    try {
      // Initialize notification service with handlers
      await notificationService.initialize({
        onNotificationReceived: (notification) => {
          console.log('📩 Notification received in hook:', notification);
          dispatch(addNotification(notification));

          // Update badge count
          const newBadgeCount = badgeCount + 1;
          dispatch(updateBadgeCount(newBadgeCount));
        },
        onNotificationTapped: (response) => {
          console.log('👆 Notification tapped in hook:', response);
          handleNotificationNavigation(response);

          // Mark as read
          dispatch(markNotificationAsRead(response.notification.request.identifier));

          // Decrement badge
          if (badgeCount > 0) {
            dispatch(updateBadgeCount(badgeCount - 1));
          }
        },
      });

      // Request permissions and get token
      await dispatch(initializeNotifications(user.id)).unwrap();

      // Check if there's a notification that launched the app
      const lastNotificationResponse = await notificationService.getLastNotificationResponse();
      if (lastNotificationResponse) {
        handleNotificationNavigation(lastNotificationResponse);
      }
    } catch (error) {
      console.error('❌ Failed to initialize notifications:', error);
    }
  }, [user?.id, badgeCount, dispatch]);

  /**
   * Deactivate device token
   */
  const deactivate = useCallback(async () => {
    if (!user?.id) {
      console.warn('⚠️ Cannot deactivate: User not logged in');
      return;
    }

    try {
      await dispatch(deactivateDevice(user.id)).unwrap();
    } catch (error) {
      console.error('❌ Failed to deactivate device:', error);
    }
  }, [user?.id, dispatch]);

  /**
   * Handle navigation based on notification data
   */
  const handleNotificationNavigation = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data;

      console.log('🧭 Navigating from notification:', data);

      // Navigate based on notification type
      if (data.conversationId) {
        // Navigate to chat detail
        router.push(`/chat-detail/${data.conversationId}`);
      } else if (data.appointmentId) {
        // Navigate to appointment detail
        router.push(`/appointment-history`);
      } else if (data.route) {
        // Custom route from notification
        router.push(data.route as any);
      } else {
        // Default: Navigate to notifications/home
        router.push('/(tabs)');
      }
    },
    [router]
  );

  /**
   * Update notification settings
   */
  const updateSettings = useCallback(
    (key: 'appointments' | 'messages' | 'promotions', value: boolean) => {
      dispatch(updateNotificationSettings({ key, value }));
    },
    [dispatch]
  );

  /**
   * Set badge count
   */
  const setBadge = useCallback(
    async (count: number) => {
      try {
        await dispatch(updateBadgeCount(count)).unwrap();
      } catch (error) {
        console.error('❌ Failed to set badge count:', error);
      }
    },
    [dispatch]
  );

  /**
   * Clear all badges
   */
  const clearAllBadges = useCallback(async () => {
    try {
      await dispatch(clearBadges()).unwrap();
    } catch (error) {
      console.error('❌ Failed to clear badges:', error);
    }
  }, [dispatch]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(
    (notificationId: string) => {
      dispatch(markNotificationAsRead(notificationId));
    },
    [dispatch]
  );

  /**
   * Clear all notifications
   */
  const clearAll = useCallback(() => {
    dispatch(clearAllNotifications());
  }, [dispatch]);

  /**
   * Schedule local notification
   */
  const scheduleLocal = useCallback(
    async (title: string, body: string, data?: Record<string, any>) => {
      await notificationService.scheduleLocalNotification(title, body, data);
    },
    []
  );

  /**
   * Show immediate local notification
   */
  const showLocal = useCallback(
    async (title: string, body: string, data?: Record<string, any>) => {
      await notificationService.showLocalNotification(title, body, data);
    },
    []
  );

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      // Don't remove listeners here, they should persist across component lifecycle
      // Only remove when user logs out
    };
  }, []);

  return {
    // State
    pushToken,
    permissionStatus,
    isInitialized,
    notifications,
    unreadCount,
    badgeCount,
    settings,
    loading,
    error,

    // Actions
    initialize,
    deactivate,
    updateSettings,
    setBadge,
    clearAllBadges,
    markAsRead,
    clearAll,
    scheduleLocal,
    showLocal,
  };
};
