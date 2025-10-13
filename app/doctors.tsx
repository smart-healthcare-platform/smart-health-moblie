import { View, Text } from 'react-native';

export default function DoctorsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Danh sách bác sĩ</Text>
      <Text>Danh sách và thông tin bác sĩ sẽ hiển thị ở đây.</Text>
    </View>
  );
}
