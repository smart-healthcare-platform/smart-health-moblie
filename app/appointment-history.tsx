import { View, Text } from 'react-native';

export default function AppointmentHistoryScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Lịch sử đặt khám</Text>
      <Text>Danh sách các lần đặt lịch khám sẽ hiển thị ở đây.</Text>
    </View>
  );
}
