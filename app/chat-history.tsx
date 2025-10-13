import { View, Text } from 'react-native';

export default function ChatHistoryScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Lịch sử trò chuyện</Text>
      <Text>Danh sách các cuộc trò chuyện với bác sĩ sẽ hiển thị ở đây.</Text>
    </View>
  );
}
