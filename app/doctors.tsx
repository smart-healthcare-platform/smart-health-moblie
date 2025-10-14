import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { HeartPulse, Shield, Star, Calendar, Search, X, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { doctorService } from '../src/services/doctor.service';
import { setDoctor } from '../src/redux/slices/bookingSlice';
import { Doctor } from '../src/types';
import useDebounce from '../hooks/useDebounce';

export default function DoctorsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const doctorsPerPage = 6;
  const totalPages = Math.ceil(total / doctorsPerPage);

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const searchTerm = debouncedSearch.trim();
      
      const res = await doctorService.getPublicDoctors(
        currentPage,
        doctorsPerPage,
        searchTerm
      );

      setDoctors(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
      setDoctors([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Handle search change
  const handleSearchChange = (text: string) => {
    setSearch(text);
    setIsSearching(true);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Clear search
  const clearSearch = () => {
    setSearch('');
    setIsSearching(false);
    setCurrentPage(1);
  };

  // Handle booking
  const handleBook = (doctor: Doctor) => {
    dispatch(setDoctor(doctor));
    router.push('/booking');
  };

  // Handle view detail
  const handleViewDetail = (doctorId: string) => {
    router.push(`/doctors/${doctorId}` as any);
  };

  // Render doctor card
  const renderDoctor = ({ item }: { item: Doctor }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User size={32} color="#2563eb" />
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{item.display_name || item.full_name}</Text>
          <View style={styles.row}>
            <HeartPulse size={14} color="#ef4444" />
            <Text style={styles.specialty}>{item.specialty}</Text>
          </View>
          {item.degree && (
            <View style={styles.row}>
              <Shield size={14} color="#2563eb" />
              <Text style={styles.degree}>{item.degree}</Text>
            </View>
          )}
          {item.experience_years && (
            <View style={styles.row}>
              <Calendar size={14} color="#059669" />
              <Text style={styles.exp}>{item.experience_years} năm KN</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.button, styles.detailButton]}
          onPress={() => handleViewDetail(item.id)}
        >
          <Text style={styles.detailButtonText}>Chi tiết</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.bookButton]}
          onPress={() => handleBook(item)}
        >
          <Text style={styles.bookButtonText}>Đặt lịch</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
          onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageButtonText}>‹</Text>
        </TouchableOpacity>

        {startPage > 1 && (
          <>
            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => setCurrentPage(1)}
            >
              <Text style={styles.pageButtonText}>1</Text>
            </TouchableOpacity>
            {startPage > 2 && <Text style={styles.pageDots}>...</Text>}
          </>
        )}

        {pages.map((page) => (
          <TouchableOpacity
            key={page}
            style={[
              styles.pageButton,
              currentPage === page && styles.pageButtonActive,
            ]}
            onPress={() => setCurrentPage(page)}
          >
            <Text
              style={[
                styles.pageButtonText,
                currentPage === page && styles.pageButtonTextActive,
              ]}
            >
              {page}
            </Text>
          </TouchableOpacity>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <Text style={styles.pageDots}>...</Text>}
            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => setCurrentPage(totalPages)}
            >
              <Text style={styles.pageButtonText}>{totalPages}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.pageButtonDisabled,
          ]}
          onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageButtonText}>›</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (loading || isSearching) return null;

    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Search size={48} color="#9ca3af" />
        </View>
        <Text style={styles.emptyTitle}>Không tìm thấy bác sĩ</Text>
        <Text style={styles.emptyText}>
          {debouncedSearch
            ? `Không tìm thấy bác sĩ nào với từ khóa "${debouncedSearch}"`
            : 'Thử điều chỉnh từ khóa tìm kiếm'}
        </Text>
        {debouncedSearch && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.header}>
        <Text style={styles.title}>Bác sĩ chuyên khoa</Text>
        <Text style={styles.subtitle}>
          Hơn 50 bác sĩ giàu kinh nghiệm sẵn sàng tư vấn
        </Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm bác sĩ..."
            value={search}
            onChangeText={handleSearchChange}
            placeholderTextColor="#9ca3af"
          />
          {isSearching && (
            <ActivityIndicator size="small" color="#2563eb" style={styles.searchLoader} />
          )}
          {search.length > 0 && !isSearching && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Summary */}
      {!loading && !isSearching && doctors.length > 0 && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            Hiển thị {doctors.length} trong số {total} bác sĩ
          </Text>
        </View>
      )}

      {/* Doctor List */}
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          loading || isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : (
            renderPagination()
          )
        }
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#e0e7ff',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  searchLoader: {
    marginLeft: 8,
  },
  clearIcon: {
    padding: 4,
  },
  resultsInfo: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#e0e7ff',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
    color: '#ef4444',
    marginLeft: 4,
  },
  degree: {
    fontSize: 13,
    color: '#2563eb',
    marginLeft: 4,
  },
  exp: {
    fontSize: 13,
    color: '#059669',
    marginLeft: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailButton: {
    backgroundColor: '#f1f5f9',
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  bookButton: {
    backgroundColor: '#2563eb',
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pageButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  pageButtonTextActive: {
    color: '#fff',
  },
  pageDots: {
    fontSize: 14,
    color: '#9ca3af',
    paddingHorizontal: 4,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
