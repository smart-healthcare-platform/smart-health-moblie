import { View, Text } from 'react-native';

export default function ProfileDetailScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Thông tin cá nhân</Text>
      <Text>Thông tin chi tiết hồ sơ bệnh nhân sẽ hiển thị ở đây.</Text>
    </View>
  );
}
