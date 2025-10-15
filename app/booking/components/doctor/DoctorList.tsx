import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { Doctor } from '@/src/types';
import DoctorCard from './DoctorCard';
import Pagination from '../common/Pagination';

interface DoctorListProps {
  doctors: Doctor[];
  loading: boolean;
  selectedDoctor: Doctor | null;
  onDoctorSelect: (doctor: Doctor) => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

export default function DoctorList({
  doctors,
  loading,
  selectedDoctor,
  onDoctorSelect,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPagination = false,
}: DoctorListProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Đang tải danh sách bác sĩ...</Text>
      </View>
    );
  }

  if (doctors.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không tìm thấy bác sĩ nào</Text>
        <Text style={styles.emptySubtext}>Vui lòng thử tìm kiếm với từ khóa khác</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Replace FlatList with map to avoid VirtualizedList nesting warning */}
      <View style={styles.listContent}>
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            isSelected={selectedDoctor?.id === doctor.id}
            onSelect={onDoctorSelect}
          />
        ))}
      </View>
      
      {showPagination && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          loading={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
});
