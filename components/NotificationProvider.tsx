// components/NotificationProvider.tsx
import React, { useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux';
import { useNotification } from '@/hooks/useNotification';
import { Alert } from 'react-native';

interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * NotificationProvider - Manages notification lifecycle for the entire app
 *
 * Responsibilities:
 * - Initialize notifications when user logs in
 * - Deactivate notifications when user logs out
 * - Handle notification listeners
 * - Manage badge counts
 *
 * Usage: Wrap your app in this provider (typically in _layout.tsx)
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const {
    initialize,
    deactivate,
    isInitialized,
    permissionStatus,
    error,
  } = useNotification();

  /**
   * Initialize notifications when user logs in
   */
  useEffect(() => {
    if (user?.id && token && !isInitialized) {
      console.log('👤 User logged in, initializing notifications...');

      initialize()
        .then(() => {
          console.log('✅ Notifications initialized successfully');
        })
        .catch((err) => {
          console.error('❌ Failed to initialize notifications:', err);

          // Check if it's Expo Go limitation
          const isExpoGoLimitation = err?.message?.includes('Expo Go') || 
                                      err?.message?.includes('development build') ||
                                      err?.code === 'ERR_NOT_AVAILABLE';

          if (isExpoGoLimitation) {
            // Don't show alert for Expo Go limitation - just log
            console.warn('⚠️ Running in Expo Go - push notifications not available');
            console.warn('ℹ️  Local notifications will work for testing');
          } else if (permissionStatus === 'denied') {
            // Don't show alert for permission denied, user explicitly denied
            console.warn('⚠️ User denied notification permissions');
          } else {
            // Show alert for other errors
            Alert.alert(
              'Lỗi thông báo',
              'Không thể khởi tạo thông báo. Một số tính năng có thể không hoạt động.',
              [{ text: 'OK' }]
            );
          }
        });
    }
  }, [user?.id, token, isInitialized, initialize, permissionStatus]);

  /**
   * Deactivate notifications when user logs out
   */
  useEffect(() => {
    // If user was logged in but now logged out
    if (!user?.id && !token && isInitialized) {
      console.log('👋 User logged out, deactivating notifications...');

      deactivate()
        .then(() => {
          console.log('✅ Notifications deactivated successfully');
        })
        .catch((err) => {
          console.error('❌ Failed to deactivate notifications:', err);
          // Don't show error to user on logout, just log it
        });
    }
  }, [user?.id, token, isInitialized, deactivate]);

  /**
   * Log notification errors for debugging
   */
  useEffect(() => {
    if (error) {
      console.error('🔔 Notification error:', error);
    }
  }, [error]);

  /**
   * Log permission status changes
   */
  useEffect(() => {
    if (permissionStatus !== 'undetermined') {
      console.log('🔔 Notification permission status:', permissionStatus);
    }
  }, [permissionStatus]);

  // Render children without any UI
  return <>{children}</>;
};

export default NotificationProvider;
