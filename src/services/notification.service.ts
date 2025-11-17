// src/services/notification.service.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { apiAuth } from '../lib/axios';

/**
 * Configure how notifications are handled when app is in foreground
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationServiceConfig {
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void;
}

class NotificationService {
  private expoPushToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;
  private config: NotificationServiceConfig = {};

  /**
   * Initialize notification service
   * Must be called early in app lifecycle
   */
  async initialize(config?: NotificationServiceConfig) {
    this.config = config || {};

    try {
      console.log('🔔 Initializing Notification Service...');

      // Setup notification listeners
      this.setupNotificationListeners();

      console.log('✅ Notification Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Notification Service:', error);
      throw error;
    }
  }

  /**
   * Request notification permissions and get push token
   */
  async requestPermissionsAndGetToken(userId: string): Promise<string | null> {
    try {
      // Check if running on physical device
      if (!Device.isDevice) {
        console.warn('⚠️ Push notifications only work on physical devices');
        return null;
      }

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('❌ Notification permission denied');
        return null;
      }

      console.log('✅ Notification permission granted');

      // For Android, setup notification channel
      if (Platform.OS === 'android') {
        await this.setupAndroidNotificationChannel();
      }

      // Try to get Expo push token
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });

        this.expoPushToken = tokenData.data;
        console.log('📱 Expo Push Token:', this.expoPushToken);

        // Register token with backend
        await this.registerDeviceToken(userId, this.expoPushToken);

        return this.expoPushToken;
      } catch (tokenError: any) {
        // Handle Expo Go limitation gracefully
        if (tokenError.message?.includes('Expo Go') || 
            tokenError.message?.includes('development build') ||
            tokenError.code === 'ERR_NOT_AVAILABLE') {
          console.warn('⚠️ EXPO GO LIMITATION DETECTED');
          console.warn('📱 Push notifications require a development build or production build');
          console.warn('🔧 Options to fix:');
          console.warn('   1. Build development app: npx expo run:android (or npx expo run:ios)');
          console.warn('   2. Build with EAS: eas build --profile development --platform android');
          console.warn('   3. Use local notifications for testing (they work in Expo Go)');
          console.warn('');
          console.warn('ℹ️  Local notifications will work for testing UI/UX');
          console.warn('ℹ️  You can test with: notificationService.showLocalNotification()');
          
          // Return null but don't throw - allow app to continue
          return null;
        }
        
        // Re-throw other errors
        throw tokenError;
      }
    } catch (error) {
      console.error('❌ Error getting push token:', error);
      
      // Don't throw - allow app to continue without push notifications
      console.warn('⚠️ Continuing without push notifications...');
      console.warn('ℹ️  Local notifications will still work for testing');
      
      return null;
    }
  }

  /**
   * Setup Android notification channel (required for Android 8.0+)
   */
  private async setupAndroidNotificationChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
        sound: 'default',
      });

      // Channel for messages
      await Notifications.setNotificationChannelAsync('messages', {
        name: 'Tin nhắn',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3b82f6',
        sound: 'default',
      });

      // Channel for appointments
      await Notifications.setNotificationChannelAsync('appointments', {
        name: 'Lịch hẹn',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#10b981',
        sound: 'default',
      });

      console.log('✅ Android notification channels created');
    }
  }

  /**
   * Register device token with backend
   */
  private async registerDeviceToken(userId: string, token: string): Promise<void> {
    try {
      const deviceType = Platform.OS === 'ios' ? 'ios' : 'android';

      const response = await apiAuth.post('/notifications/device/register', {
        userId,
        deviceToken: token,
        deviceType,
      });

      console.log('✅ Device registered with backend:', response.data);
    } catch (error) {
      console.error('❌ Failed to register device token:', error);
      throw error;
    }
  }

  /**
   * Deactivate device token (call on logout)
   */
  async deactivateDeviceToken(userId: string): Promise<void> {
    try {
      if (!this.expoPushToken) {
        console.warn('⚠️ No push token to deactivate');
        return;
      }

      await apiAuth.delete('/notifications/device/deactivate', {
        data: {
          userId,
          deviceToken: this.expoPushToken,
        },
      });

      console.log('✅ Device token deactivated');
      this.expoPushToken = null;
    } catch (error) {
      console.error('❌ Failed to deactivate device token:', error);
      throw error;
    }
  }

  /**
   * Setup notification listeners
   */
  private setupNotificationListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📩 Notification received (foreground):', notification);

      if (this.config.onNotificationReceived) {
        this.config.onNotificationReceived(notification);
      }
    });

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notification tapped:', response);

      if (this.config.onNotificationTapped) {
        this.config.onNotificationTapped(response);
      }
    });

    console.log('✅ Notification listeners registered');
  }

  /**
   * Remove notification listeners (cleanup)
   */
  removeListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
      this.notificationListener = null;
    }

    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
      this.responseListener = null;
    }

    console.log('🧹 Notification listeners removed');
  }

  /**
   * Schedule a local notification (for testing)
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: Record<string, any>,
    delaySeconds: number = 1
  ) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: 'default',
        },
        trigger: { seconds: delaySeconds },
      });

      console.log('✅ Local notification scheduled');
    } catch (error) {
      console.error('❌ Failed to schedule local notification:', error);
    }
  }

  /**
   * Show immediate local notification
   */
  async showLocalNotification(
    title: string,
    body: string,
    data?: Record<string, any>
  ) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: 'default',
        },
        trigger: null, // Show immediately
      });

      console.log('✅ Local notification shown');
    } catch (error) {
      console.error('❌ Failed to show local notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ All notifications cancelled');
    } catch (error) {
      console.error('❌ Failed to cancel notifications:', error);
    }
  }

  /**
   * Get notification badge count
   */
  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('❌ Failed to get badge count:', error);
      return 0;
    }
  }

  /**
   * Set notification badge count
   */
  async setBadgeCount(count: number) {
    try {
      await Notifications.setBadgeCountAsync(count);
      console.log('✅ Badge count set to:', count);
    } catch (error) {
      console.error('❌ Failed to set badge count:', error);
    }
  }

  /**
   * Clear all badges
   */
  async clearBadges() {
    try {
      await Notifications.setBadgeCountAsync(0);
      console.log('✅ Badges cleared');
    } catch (error) {
      console.error('❌ Failed to clear badges:', error);
    }
  }

  /**
   * Get current push token
   */
  getCurrentToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Check if notifications are enabled
   */
  async areNotificationsEnabled(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('❌ Failed to check notification status:', error);
      return false;
    }
  }

  /**
   * Get last notification response (for deep linking on app launch)
   */
  async getLastNotificationResponse(): Promise<Notifications.NotificationResponse | null> {
    try {
      return await Notifications.getLastNotificationResponseAsync();
    } catch (error) {
      console.error('❌ Failed to get last notification response:', error);
      return null;
    }
  }

  /**
   * Dismiss all notifications
   */
  async dismissAllNotifications() {
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log('✅ All notifications dismissed');
    } catch (error) {
      console.error('❌ Failed to dismiss notifications:', error);
    }
  }

  /**
   * Dismiss specific notification by ID
   */
  async dismissNotification(notificationId: string) {
    try {
      await Notifications.dismissNotificationAsync(notificationId);
      console.log('✅ Notification dismissed:', notificationId);
    } catch (error) {
      console.error('❌ Failed to dismiss notification:', error);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export types
export type { Notifications };
