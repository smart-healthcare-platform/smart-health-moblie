import { Tabs } from 'expo-router';
import { Home, Activity, Bot, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="diagnosis"
        options={{
          title: 'Diagnosis',
          tabBarIcon: ({ color, focused }) => (
            <Activity color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chat-bot',
          tabBarIcon: ({ color, focused }) => (
            <Bot color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Người dùng',
          tabBarIcon: ({ color, focused }) => (
            <User color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
