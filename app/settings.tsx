import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
} from "react-native";
import { Stack } from "expo-router";
import {
  SectionHeader,
  SettingToggle,
  MenuOption,
} from "../components/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNotification } from "@/hooks/useNotification";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux";
import { NotificationTester } from "@/components/NotificationTester";

const SETTINGS_KEY = "@app_settings";

interface AppSettings {
  notifications: {
    appointments: boolean;
    messages: boolean;
    promotions: boolean;
  };
  appearance: {
    language: "vi" | "en";
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
    language: "vi",
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
  const [showNotificationTester, setShowNotificationTester] = useState(false);

  // Use notification hook for managing notification settings
  const {
    settings: notificationSettings,
    updateSettings: updateNotificationSetting,
    permissionStatus,
    pushToken,
  } = useNotification();

  const { user } = useSelector((state: RootState) => state.auth);

  // Load settings from AsyncStorage
  useEffect(() => {
    loadSettings();
  }, []);

  // Sync notification settings from Redux
  useEffect(() => {
    if (notificationSettings) {
      setSettings((prev) => ({
        ...prev,
        notifications: notificationSettings,
      }));
    }
  }, [notificationSettings]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
      Alert.alert("Lỗi", "Không thể lưu cài đặt");
    }
  };

  const handleNotificationToggle = async (
    key: keyof AppSettings["notifications"],
    value: boolean,
  ) => {
    // Check if user is logged in
    if (!user?.id) {
      Alert.alert(
        "Thông báo",
        "Vui lòng đăng nhập để sử dụng tính năng thông báo",
      );
      return;
    }

    // Check permission status
    if (permissionStatus === "denied") {
      Alert.alert(
        "Quyền thông báo bị từ chối",
        "Vui lòng vào Cài đặt hệ thống để bật quyền thông báo cho ứng dụng",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Mở Cài đặt", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    // Update notification setting via Redux
    updateNotificationSetting(key, value);

    // Also save to local settings for backward compatibility
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    };
    saveSettings(newSettings);
  };

  const updateAppearanceSetting = (
    key: keyof AppSettings["appearance"],
    value: any,
  ) => {
    const newSettings = {
      ...settings,
      appearance: {
        ...settings.appearance,
        [key]: value,
      },
    };
    saveSettings(newSettings);
  };

  const updateSecuritySetting = (
    key: keyof AppSettings["security"],
    value: boolean,
  ) => {
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
      "Khôi phục cài đặt mặc định",
      "Bạn có chắc chắn muốn khôi phục tất cả cài đặt về mặc định?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Khôi phục",
          style: "destructive",
          onPress: () => saveSettings(DEFAULT_SETTINGS),
        },
      ],
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
          title: "Cài đặt",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#059669",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
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
            onToggle={(value) =>
              handleNotificationToggle("appointments", value)
            }
          />

          <SettingToggle
            icon="chatbubbles"
            label="Tin nhắn"
            description="Nhận thông báo khi có tin nhắn mới"
            value={settings.notifications.messages}
            onToggle={(value) => handleNotificationToggle("messages", value)}
          />

          <SettingToggle
            icon="pricetag"
            label="Khuyến mãi"
            description="Nhận thông báo về chương trình khuyến mãi"
            value={settings.notifications.promotions}
            onToggle={(value) => handleNotificationToggle("promotions", value)}
          />

          {/* Show notification status */}
          {user?.id && (
            <View style={styles.notificationStatus}>
              <Text style={styles.statusLabel}>Trạng thái:</Text>
              <View style={styles.statusBadge}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        permissionStatus === "granted" ? "#10b981" : "#ef4444",
                    },
                  ]}
                />
                <Text style={styles.statusText}>
                  {permissionStatus === "granted"
                    ? "Đã bật thông báo"
                    : permissionStatus === "denied"
                      ? "Đã tắt thông báo"
                      : "Chưa xác định"}
                </Text>
              </View>
              {pushToken && (
                <Text style={styles.tokenPreview} numberOfLines={1}>
                  Token: {pushToken.substring(0, 20)}...
                </Text>
              )}
            </View>
          )}

          {/* Notification Testing Tool (Development) */}
          {__DEV__ && user?.id && (
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => setShowNotificationTester(true)}
            >
              <Ionicons name="flask" size={20} color="#8b5cf6" />
              <Text style={styles.testButtonText}>
                🧪 Test Notifications (Dev Tool)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <SectionHeader title="Giao diện" icon="color-palette" />

          <MenuOption
            icon="language"
            label="Ngôn ngữ"
            value={
              settings.appearance.language === "vi" ? "Tiếng Việt" : "English"
            }
            iconColor="#f59e0b"
            iconBgColor="#fef3c7"
            onPress={() => {
              Alert.alert("Chọn ngôn ngữ", "", [
                {
                  text: "Tiếng Việt",
                  onPress: () => updateAppearanceSetting("language", "vi"),
                },
                {
                  text: "English",
                  onPress: () => updateAppearanceSetting("language", "en"),
                },
                { text: "Hủy", style: "cancel" },
              ]);
            }}
          />

          <SettingToggle
            icon="moon"
            label="Chế độ tối"
            description="Sử dụng giao diện tối (đang phát triển)"
            value={settings.appearance.darkMode}
            onToggle={(value) => updateAppearanceSetting("darkMode", value)}
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
            onToggle={(value) => updateSecuritySetting("biometricAuth", value)}
          />

          <SettingToggle
            icon="lock-closed"
            label="Yêu cầu mật khẩu"
            description="Yêu cầu nhập mật khẩu mỗi khi mở app (đang phát triển)"
            value={settings.security.requirePassword}
            onToggle={(value) =>
              updateSecuritySetting("requirePassword", value)
            }
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
            onPress={() =>
              Alert.alert(
                "Về ứng dụng",
                "Smart Health v1.0.0\n\nỨng dụng quản lý sức khỏe thông minh",
              )
            }
          />

          <MenuOption
            icon="shield"
            label="Điều khoản sử dụng"
            iconColor="#06b6d4"
            iconBgColor="#cffafe"
            onPress={() =>
              Alert.alert(
                "Điều khoản sử dụng",
                "Tính năng đang được phát triển",
              )
            }
          />

          <MenuOption
            icon="lock-closed"
            label="Chính sách bảo mật"
            iconColor="#10b981"
            iconBgColor="#d1fae5"
            onPress={() =>
              Alert.alert(
                "Chính sách bảo mật",
                "Tính năng đang được phát triển",
              )
            }
          />

          <MenuOption
            icon="help-circle"
            label="Trợ giúp & Hỗ trợ"
            iconColor="#f43f5e"
            iconBgColor="#ffe4e6"
            onPress={() => Linking.openURL("mailto:support@smarthealth.com")}
          />
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Phiên bản: 1.0.0</Text>
          <Text style={styles.copyrightText}>
            © 2025 Smart Health Platform
          </Text>
        </View>

        {/* Reset Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetSettings}
          >
            <Ionicons name="refresh" size={20} color="#ef4444" />
            <Text style={styles.resetButtonText}>
              Khôi phục cài đặt mặc định
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Notification Tester Modal */}
      <Modal
        visible={showNotificationTester}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotificationTester(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notification Tester</Text>
            <TouchableOpacity
              onPress={() => setShowNotificationTester(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <NotificationTester />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4", // Match system green tint
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    padding: 16,
  },
  notificationStatus: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#6b7280",
  },
  tokenPreview: {
    fontSize: 11,
    color: "#9ca3af",
    fontFamily: "monospace",
    marginTop: 4,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3e8ff",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: "#8b5cf6",
    borderStyle: "dashed",
  },
  testButtonText: {
    color: "#6b21a8",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#10b981",
    padding: 16,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalCloseButton: {
    padding: 4,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fecaca",
  },
  resetButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
