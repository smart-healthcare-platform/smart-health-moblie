import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/redux';
import BookingSummaryCard from './components/form/BookingSummaryCard';
import { usePatientGuard } from '../../hooks/booking/usePatientGuard';
import LoadingState from './components/common/LoadingState';

export default function BookingSummaryStep() {
  const { doctor, date, time, formData } = useSelector(
    (state: RootState) => state.booking
  );

  // 🔒 Auth Guard - Bảo vệ màn hình này
  const isAuthorized = usePatientGuard();

  // Hiển thị loading khi đang kiểm tra auth
  if (!isAuthorized) {
    return <LoadingState message="Đang kiểm tra quyền truy cập..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận thông tin</Text>
      <Text style={styles.subtitle}>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</Text>

      <BookingSummaryCard
        doctor={doctor}
        date={date}
        time={time}
        formData={formData}
      />
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
});
