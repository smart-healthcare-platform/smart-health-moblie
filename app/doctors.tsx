import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { HeartPulse, Shield, Star, Calendar } from 'lucide-react-native';
export default function DoctorsScreen() {
  // Mock data mẫu dựa trên website
  const doctors = [
    {
      id: '1',
      name: 'BS. Nguyễn Văn A',
      specialty: 'Tim mạch',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.8,
      experience: 12,
      hospital: 'Bệnh viện Bạch Mai',
    },
    {
      id: '2',
      name: 'BS. Trần Thị B',
      specialty: 'Nội tổng quát',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 4.6,
      experience: 8,
      hospital: 'Bệnh viện Chợ Rẫy',
    },
    {
      id: '3',
      name: 'BS. Lê Minh C',
      specialty: 'Nhi khoa',
      avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
      rating: 4.9,
      experience: 15,
      hospital: 'Bệnh viện Nhi Trung Ương',
    },
  ];

  const renderDoctor = ({ item }: { item: typeof doctors[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.specialty}><HeartPulse size={16} color="#ef4444" /> {item.specialty}</Text>
        <Text style={styles.hospital}><Shield size={14} color="#2563eb" /> {item.hospital}</Text>
        <View style={styles.row}>
          <View style={styles.row}>
            <Star size={15} color="#facc15" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <View style={[styles.row, { marginLeft: 16 }]}> 
            <Calendar size={15} color="#059669" />
            <Text style={styles.exp}>{item.experience} năm KN</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách bác sĩ</Text>
      <FlatList
        data={doctors}
        keyExtractor={item => item.id}
        renderItem={renderDoctor}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: '#e0e7ff',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  specialty: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hospital: {
    color: '#2563eb',
    fontSize: 13,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: '#facc15',
    fontWeight: 'bold',
    marginLeft: 2,
    fontSize: 14,
  },
  exp: {
    color: '#059669',
    fontWeight: 'bold',
    marginLeft: 2,
    fontSize: 14,
  },
});
