import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Search, X, User, HeartPulse, Shield, Calendar } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setDoctor } from '../../src/redux/slices/bookingSlice';
import { doctorService } from '../../src/services/doctor.service';
import { Doctor } from '../../src/types';
import { RootState } from '../../src/redux';
import useDebounce from '../../hooks/useDebounce';

export default function DoctorSelectionStep() {
  const dispatch = useDispatch();
  const { doctor: selectedDoctor } = useSelector((state: RootState) => state.booking);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await doctorService.getPublicDoctors(1, 20, debouncedSearch.trim());
      setDoctors(res.data || []);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleSelectDoctor = (doctor: Doctor) => {
    dispatch(setDoctor(doctor));
  };

  const renderDoctor = ({ item }: { item: Doctor }) => {
    const isSelected = selectedDoctor?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.doctorCard, isSelected && styles.doctorCardSelected]}
        onPress={() => handleSelectDoctor(item)}
      >
        <View style={styles.doctorHeader}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={28} color="#10b981" />
            </View>
          )}

          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{item.display_name || item.full_name}</Text>
            <View style={styles.infoRow}>
              <HeartPulse size={14} color="#ef4444" />
              <Text style={styles.specialty}>{item.specialty}</Text>
            </View>
            {item.degree && (
              <View style={styles.infoRow}>
                <Shield size={14} color="#2563eb" />
                <Text style={styles.degree}>{item.degree}</Text>
              </View>
            )}
            {item.experience_years && (
              <View style={styles.infoRow}>
                <Calendar size={14} color="#059669" />
                <Text style={styles.experience}>{item.experience_years} năm KN</Text>
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn bác sĩ</Text>
      <Text style={styles.subtitle}>Tìm kiếm và chọn bác sĩ phù hợp với bạn</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bác sĩ..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearIcon}>
            <X size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Doctor List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải danh sách bác sĩ...</Text>
        </View>
      ) : doctors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy bác sĩ nào</Text>
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  clearIcon: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  doctorCard: {
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
  doctorCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  doctorHeader: {
    flexDirection: 'row',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#d1fae5',
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
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
