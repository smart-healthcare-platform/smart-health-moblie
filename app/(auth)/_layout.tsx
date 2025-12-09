import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </>
  );
}