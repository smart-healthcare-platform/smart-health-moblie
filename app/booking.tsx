import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { User, HeartPulse } from 'lucide-react-native';

export default function BookingScreen() {
  // Mock data lịch đặt mới
  const bookings = [
    {
      id: '1',
      doctor: 'BS. Nguyễn Văn A',
      specialty: 'Tim mạch',
      date: '2025-10-20',
      time: '10:00',
      status: 'Sắp tới',
    },
    {
      id: '2',
      doctor: 'BS. Trần Thị B',
      specialty: 'Nội tổng quát',
      date: '2025-10-22',
      time: '15:30',
      status: 'Sắp tới',
    },
  ];

  const renderItem = ({ item }: { item: typeof bookings[0] }) => (
    <View style={styles.card}>
      <View style={styles.iconCol}><User color="#059669" size={28} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.doctor}>{item.doctor}</Text>
        <Text style={styles.specialty}><HeartPulse size={13} color="#ef4444" /> {item.specialty}</Text>
        <Text style={styles.date}>{item.date} lúc {item.time}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lịch khám mới</Text>
      <FlatList
        data={bookings}
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
      color: '#059669',
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
      backgroundColor: '#d1fae5',
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
      color: '#059669',
      fontWeight: 'bold',
      fontSize: 13,
      marginTop: 2,
    },
  });