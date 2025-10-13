import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { User, HeartPulse } from 'lucide-react-native';

export default function AppointmentHistoryScreen() {
  // Mock data lịch sử đặt khám
  const appointments = [
    {
      id: '1',
      doctor: 'BS. Nguyễn Văn A',
      specialty: 'Tim mạch',
      date: '2025-10-10',
      time: '09:00',
      status: 'Hoàn thành',
    },
    {
      id: '2',
      doctor: 'BS. Trần Thị B',
      specialty: 'Nội tổng quát',
      date: '2025-09-28',
      time: '14:30',
      status: 'Đã hủy',
    },
    {
      id: '3',
      doctor: 'BS. Lê Minh C',
      specialty: 'Nhi khoa',
      date: '2025-09-15',
      time: '16:00',
      status: 'Hoàn thành',
    },
  ];

  const renderItem = ({ item }: { item: typeof appointments[0] }) => (
    <View style={styles.card}>
      <View style={styles.iconCol}><User color="#2563eb" size={28} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.doctor}>{item.doctor}</Text>
        <Text style={styles.specialty}><HeartPulse size={13} color="#ef4444" /> {item.specialty}</Text>
        <Text style={styles.date}>{item.date} lúc {item.time}</Text>
        <Text style={[styles.status, item.status === 'Hoàn thành' ? styles.statusDone : styles.statusCancel]}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử đặt khám</Text>
      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingTop: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 1,
    gap: 12,
  },
  iconCol: {
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
  },
  doctor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  specialty: {
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    color: '#2563eb',
    fontSize: 13,
    marginBottom: 2,
  },
  status: {
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 2,
  },
  statusDone: {
    color: '#059669',
  },
  statusCancel: {
    color: '#ef4444',
  },
});
