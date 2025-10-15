import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { User, HeartPulse, Shield, Calendar } from 'lucide-react-native';
import { Doctor } from '@/src/types';

interface DoctorCardProps {
  doctor: Doctor;
  isSelected: boolean;
  onSelect: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, isSelected, onSelect }: DoctorCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => onSelect(doctor)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        {doctor.avatar ? (
          <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User size={28} color="#10b981" />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{doctor.display_name || doctor.full_name}</Text>
          
          <View style={styles.infoRow}>
            <HeartPulse size={14} color="#ef4444" />
            <Text style={styles.specialty}>{doctor.specialty}</Text>
          </View>
          
          {doctor.degree && (
            <View style={styles.infoRow}>
              <Shield size={14} color="#2563eb" />
              <Text style={styles.degree}>{doctor.degree}</Text>
            </View>
          )}
          
          {doctor.experience_years && (
            <View style={styles.infoRow}>
              <Calendar size={14} color="#059669" />
              <Text style={styles.experience}>{doctor.experience_years} năm KN</Text>
            </View>
          )}
        </View>
      </View>

      {isSelected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>✓ Đã chọn</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  header: {
    flexDirection: 'row',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#ef4444',
  },
  degree: {
    fontSize: 13,
    color: '#2563eb',
  },
  experience: {
    fontSize: 13,
    color: '#059669',
  },
  selectedBadge: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#10b981',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});
