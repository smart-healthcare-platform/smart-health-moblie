import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setDoctor } from '../../src/redux/slices/bookingSlice';
import { RootState } from '../../src/redux';
import { Doctor } from '../../src/types';
import { useDoctors } from '../../hooks/booking/useDoctors';
import DoctorSearch from './components/doctor/DoctorSearch';
import DoctorList from './components/doctor/DoctorList';
import ErrorState from './components/common/ErrorState';

export default function DoctorSelectionStep() {
  const dispatch = useDispatch();
  const { doctor: selectedDoctor } = useSelector((state: RootState) => state.booking);

  const {
    doctors,
    loading,
    error,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    total,
    totalPages,
    refetch,
  } = useDoctors(6); // 6 doctors per page for better pagination UX

  const handleSelectDoctor = (doctor: Doctor) => {
    dispatch(setDoctor(doctor));
  };

  // Convert selectedDoctor to Doctor type for the component
  const selectedDoctorAsDoctor = selectedDoctor && 'degree' in selectedDoctor 
    ? selectedDoctor 
    : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn bác sĩ</Text>
      <Text style={styles.subtitle}>Tìm kiếm và chọn bác sĩ phù hợp với bạn</Text>

      <DoctorSearch value={search} onChange={setSearch} />

      {total > 0 && !loading && (
        <Text style={styles.totalText}>Tìm thấy {total} bác sĩ</Text>
      )}

      {error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <DoctorList
          doctors={doctors}
          loading={loading}
          selectedDoctor={selectedDoctorAsDoctor}
          onDoctorSelect={handleSelectDoctor}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showPagination={true}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
});
