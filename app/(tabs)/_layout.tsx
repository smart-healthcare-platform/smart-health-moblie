import { Tabs } from 'expo-router';
import { Text } from 'react-native'; // Temporary, will be replaced with icons

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color }}>🏠</Text> // Temporary icon
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Khác',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color }}>⚙️</Text> // Temporary icon
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color }}>👤</Text> // Temporary icon
          ),
        }}
      />
    </Tabs>
  );
}
