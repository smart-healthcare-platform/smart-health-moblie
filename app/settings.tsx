import { View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Cài đặt</Text>
      <Text>Các tuỳ chọn cài đặt tài khoản sẽ hiển thị ở đây.</Text>
    </View>
  );
}
