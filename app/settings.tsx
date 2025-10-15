import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { SectionHeader, SettingToggle, MenuOption } from '../components/profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const SETTINGS_KEY = '@app_settings';

interface AppSettings {
  notifications: {
    appointments: boolean;
    messages: boolean;
    promotions: boolean;
  };
  appearance: {
    language: 'vi' | 'en';
    darkMode: boolean;
  };
  security: {
    biometricAuth: boolean;
    requirePassword: boolean;
  };
}

const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    appointments: true,
    messages: true,
    promotions: false,
  },
  appearance: {
    language: 'vi',
    darkMode: false,
  },
  security: {
    biometricAuth: false,
    requirePassword: false,
  },
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load settings from AsyncStorage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('Lỗi', 'Không thể lưu cài đặt');
    }
  };

  const updateNotificationSetting = (key: keyof AppSettings['notifications'], value: boolean) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    };
    saveSettings(newSettings);
  };

  const updateAppearanceSetting = (key: keyof AppSettings['appearance'], value: any) => {
    const newSettings = {
      ...settings,
      appearance: {
        ...settings.appearance,
        [key]: value,
      },
    };
    saveSettings(newSettings);
  };

  const updateSecuritySetting = (key: keyof AppSettings['security'], value: boolean) => {
    const newSettings = {
      ...settings,
      security: {
        ...settings.security,
        [key]: value,
      },
    };
    saveSettings(newSettings);
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Khôi phục cài đặt mặc định',
      'Bạn có chắc chắn muốn khôi phục tất cả cài đặt về mặc định?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục',
          style: 'destructive',
          onPress: () => saveSettings(DEFAULT_SETTINGS),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Cài đặt',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#059669',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerShadowVisible: true,
        }}
      />
      <ScrollView style={styles.container}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <SectionHeader title="Thông báo" icon="notifications" />

          <SettingToggle
            icon="calendar"
            label="Lịch hẹn"
            description="Nhận thông báo nhắc nhở lịch hẹn khám bệnh"
            value={settings.notifications.appointments}
            onToggle={(value) => updateNotificationSetting('appointments', value)}
          />

          <SettingToggle
            icon="chatbubbles"
            label="Tin nhắn"
            description="Nhận thông báo khi có tin nhắn mới"
            value={settings.notifications.messages}
            onToggle={(value) => updateNotificationSetting('messages', value)}
          />

          <SettingToggle
            icon="pricetag"
            label="Khuyến mãi"
            description="Nhận thông báo về chương trình khuyến mãi"
            value={settings.notifications.promotions}
            onToggle={(value) => updateNotificationSetting('promotions', value)}
          />
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <SectionHeader title="Giao diện" icon="color-palette" />

          <MenuOption
            icon="language"
            label="Ngôn ngữ"
            value={settings.appearance.language === 'vi' ? 'Tiếng Việt' : 'English'}
            iconColor="#f59e0b"
            iconBgColor="#fef3c7"
            onPress={() => {
              Alert.alert(
                'Chọn ngôn ngữ',
                '',
                [
                  {
                    text: 'Tiếng Việt',
                    onPress: () => updateAppearanceSetting('language', 'vi'),
                  },
                  {
                    text: 'English',
                    onPress: () => updateAppearanceSetting('language', 'en'),
                  },
                  { text: 'Hủy', style: 'cancel' },
                ]
              );
            }}
          />

          <SettingToggle
            icon="moon"
            label="Chế độ tối"
            description="Sử dụng giao diện tối (đang phát triển)"
            value={settings.appearance.darkMode}
            onToggle={(value) => updateAppearanceSetting('darkMode', value)}
          />
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <SectionHeader title="Bảo mật" icon="shield-checkmark" />

          <SettingToggle
            icon="finger-print"
            label="Xác thực sinh trắc học"
            description="Sử dụng vân tay / Face ID để đăng nhập (đang phát triển)"
            value={settings.security.biometricAuth}
            onToggle={(value) => updateSecuritySetting('biometricAuth', value)}
          />

          <SettingToggle
            icon="lock-closed"
            label="Yêu cầu mật khẩu"
            description="Yêu cầu nhập mật khẩu mỗi khi mở app (đang phát triển)"
            value={settings.security.requirePassword}
            onToggle={(value) => updateSecuritySetting('requirePassword', value)}
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <SectionHeader title="Thông tin" icon="information-circle" />

          <MenuOption
            icon="document-text"
            label="Về ứng dụng"
            iconColor="#8b5cf6"
            iconBgColor="#ede9fe"
            onPress={() => Alert.alert('Về ứng dụng', 'Smart Health v1.0.0\n\nỨng dụng quản lý sức khỏe thông minh')}
          />

          <MenuOption
            icon="shield"
            label="Điều khoản sử dụng"
            iconColor="#06b6d4"
            iconBgColor="#cffafe"
            onPress={() => Alert.alert('Điều khoản sử dụng', 'Tính năng đang được phát triển')}
          />

          <MenuOption
            icon="lock-closed"
            label="Chính sách bảo mật"
            iconColor="#10b981"
            iconBgColor="#d1fae5"
            onPress={() => Alert.alert('Chính sách bảo mật', 'Tính năng đang được phát triển')}
          />

          <MenuOption
            icon="help-circle"
            label="Trợ giúp & Hỗ trợ"
            iconColor="#f43f5e"
            iconBgColor="#ffe4e6"
            onPress={() => Linking.openURL('mailto:support@smarthealth.com')}
          />
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Phiên bản: 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 Smart Health Platform</Text>
        </View>

        {/* Reset Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetSettings}>
            <Ionicons name="refresh" size={20} color="#ef4444" />
            <Text style={styles.resetButtonText}>Khôi phục cài đặt mặc định</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4', // Match system green tint
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 16,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  resetButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
