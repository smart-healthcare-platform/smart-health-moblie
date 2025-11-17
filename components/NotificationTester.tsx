// components/NotificationTester.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useNotification } from '@/hooks/useNotification';
import { notificationService } from '@/src/services/notification.service';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux';

/**
 * NotificationTester Component
 * 
 * Helper component để test notifications trong Expo Go
 * Sử dụng local notifications vì push notifications cần development build
 * 
 * Usage: Import và render trong Settings screen hoặc dev menu
 */
export const NotificationTester: React.FC = () => {
  const [lastResult, setLastResult] = useState<string>('');
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    pushToken,
    permissionStatus,
    isInitialized,
    badgeCount,
    settings,
  } = useNotification();

  const showResult = (message: string, isError = false) => {
    const prefix = isError ? '❌ ' : '✅ ';
    const fullMessage = prefix + message;
    setLastResult(fullMessage);
    console.log(fullMessage);
  };

  // Test 1: Immediate notification
  const testImmediateNotification = async () => {
    try {
      await notificationService.showLocalNotification(
        '🎉 Test Immediate',
        'This notification appears right now!',
        { testType: 'immediate', timestamp: Date.now() }
      );
      showResult('Immediate notification sent');
    } catch (error: any) {
      showResult('Failed: ' + error.message, true);
    }
  };

  // Test 2: Scheduled notification
  const testScheduledNotification = async () => {
    try {
      await notificationService.scheduleLocalNotification(
        '⏰ Scheduled Test',
        'This appears after 5 seconds',
        { testType: 'scheduled', timestamp: Date.now() },
        5
      );
      showResult('Scheduled notification for 5 seconds');
    } catch (error: any) {
      showResult('Failed: ' + error.message, true);
    }
  };

  // Test 3: Notification with navigation data
  const testNavigationNotification = async () => {
    try {
      await notificationService.showLocalNotification(
        '💬 Chat Message',
        'Tap to navigate to chat',
        { conversationId: 'test-conversation-123' }
      );
      showResult('Navigation notification sent (tap to test routing)');
    } catch (error: any) {
      showResult('Failed: ' + error.message, true);
    }
  };

  // Test 4: Appointment notification
  const testAppointmentNotification = async () => {
    try {
      await notificationService.showLocalNotification(
        '📅 Appointment Reminder',
        'You have an appointment in 1 hour',
        { appointmentId: 'test-appointment-456', type: 'appointment' }
      );
      showResult('Appointment notification sent');
    } catch (error: any) {
      showResult('Failed: ' + error.message, true);
    }
  };

  // Test 5: Badge count
  const testBadgeCount = async () => {
    try {
      const newCount = badgeCount + 1;
      await notificationService.setBadgeCount(newCount);
      showResult(`Badge count set to ${newCount}`);
    } catch (error: any) {
      showResult('Failed: ' + error.message, true);
    }
  };

  // Test 6: Clear badges
  const testClearBadges = async () => {
    try {
      await notificationService.clearBadges();
      showResult('All badges cleared');
    } catch (error: any) {
      showResult('Failed: ' + error.message, true);
    }
  };

  // Test 7: Multiple notifications
  const testMultipleNotifications = async () => {
    try {
      for (let i = 1; i <= 3; i++) {
        await notificationService.scheduleLocalNotification(
          `📨 Message ${i}`,
          `This is test message number ${i}`,
          { messageId: `test-${i}`, timestamp: Date.now() },
          i * 2 // Stagger by 2 seconds each
        );
      }
      showResult('Scheduled 3 notifications (2s, 4s, 6s)');
    } catch (error: any) {
      showResult('Failed: ' + error.message, true);
    }
  };

  // Test 8: Cancel all notifications
  const testCancelAll = async () => {
    try {
      await notificationService.cancelAllNotifications();
      showResult('All scheduled notifications cancelled');
    } catch (error: any) {
      showResult('Failed: ' + error.message, true);
    }
  };

  // Show system info
  const showSystemInfo = () => {
    const info = `
📱 Platform: ${Platform.OS} ${Platform.Version}
👤 User ID: ${user?.id || 'Not logged in'}
🔔 Permission: ${permissionStatus}
🎫 Push Token: ${pushToken ? pushToken.substring(0, 20) + '...' : 'None'}
✅ Initialized: ${isInitialized ? 'Yes' : 'No'}
🔢 Badge Count: ${badgeCount}
⚙️ Settings: Appointments=${settings.appointments}, Messages=${settings.messages}
    `.trim();

    Alert.alert('System Info', info);
  };

  // Show help
  const showHelp = () => {
    const help = `
🧪 NOTIFICATION TESTING GUIDE

📱 EXPO GO LIMITATIONS:
- Push notifications DON'T work in Expo Go
- Local notifications WORK perfectly
- Use this tool to test notification UI/UX

✅ WHAT WORKS:
- Immediate notifications
- Scheduled notifications
- Navigation from notifications
- Badge counts
- Permission requests

❌ WHAT DOESN'T WORK:
- Remote push notifications
- FCM integration

🔧 TO TEST PUSH NOTIFICATIONS:
1. Build development app:
   npx expo run:android
   
2. Or build with EAS:
   eas build --profile development --platform android

3. Install on physical device

💡 TIP:
Test all notification features with local notifications first,
then build to test actual push notifications.
    `.trim();

    Alert.alert('Help', help, [{ text: 'Got it' }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Notification Tester</Text>
        <Text style={styles.subtitle}>
          {Platform.OS === 'android' ? '🤖 Android' : '🍎 iOS'} • 
          {permissionStatus === 'granted' ? ' ✅ Enabled' : ' ⚠️ Disabled'}
        </Text>
      </View>

      {/* Warning for Expo Go */}
      {!pushToken && permissionStatus === 'granted' && (
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            ⚠️ Running in Expo Go - Push notifications unavailable
          </Text>
          <Text style={styles.warningSubtext}>
            Local notifications work fine for testing UI/UX
          </Text>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        {/* Basic Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Tests</Text>
          
          <TouchableOpacity style={styles.button} onPress={testImmediateNotification}>
            <Text style={styles.buttonText}>🎉 Immediate Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testScheduledNotification}>
            <Text style={styles.buttonText}>⏰ Scheduled (5s)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testMultipleNotifications}>
            <Text style={styles.buttonText}>📨 Multiple (3x)</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation Tests</Text>
          
          <TouchableOpacity style={styles.button} onPress={testNavigationNotification}>
            <Text style={styles.buttonText}>💬 Chat Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testAppointmentNotification}>
            <Text style={styles.buttonText}>📅 Appointment</Text>
          </TouchableOpacity>
        </View>

        {/* Badge Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badge Tests (Current: {badgeCount})</Text>
          
          <TouchableOpacity style={styles.button} onPress={testBadgeCount}>
            <Text style={styles.buttonText}>➕ Increment Badge</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={testClearBadges}>
            <Text style={styles.buttonText}>🧹 Clear Badges</Text>
          </TouchableOpacity>
        </View>

        {/* Utilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Utilities</Text>
          
          <TouchableOpacity style={styles.button} onPress={testCancelAll}>
            <Text style={styles.buttonText}>❌ Cancel All Scheduled</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={showSystemInfo}>
            <Text style={styles.buttonSecondaryText}>ℹ️ System Info</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={showHelp}>
            <Text style={styles.buttonSecondaryText}>❓ Help</Text>
          </TouchableOpacity>
        </View>

        {/* Result Display */}
        {lastResult && (
          <View style={styles.result}>
            <Text style={styles.resultText}>{lastResult}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    backgroundColor: '#10b981',
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#d1fae5',
  },
  warning: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  warningSubtext: {
    fontSize: 12,
    color: '#78350f',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  buttonSecondaryText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  result: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  resultText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default NotificationTester;