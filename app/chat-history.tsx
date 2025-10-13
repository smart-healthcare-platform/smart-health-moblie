import { View, Text, StyleSheet } from 'react-native';
import { MessageCircle } from 'lucide-react-native';

export default function ChatHistoryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <MessageCircle color="#a855f7" size={38} />
      </View>
      <Text style={styles.title}>Lịch sử trò chuyện</Text>
      <Text style={styles.desc}>Danh sách các cuộc trò chuyện với bác sĩ sẽ hiển thị ở đây khi bạn sử dụng chức năng chat.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  iconWrap: {
    backgroundColor: '#ede9fe',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: 8,
  },
  desc: {
    color: '#64748b',
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 320,
  },
});
