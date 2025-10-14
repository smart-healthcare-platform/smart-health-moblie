import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import {
  User,
  HeartPulse,
  Calendar,
  Clock,
  Phone,
  MapPin,
  FileText,
  Shield,
} from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/redux';

export default function BookingSummaryStep() {
  const { doctor, date, time, formData } = useSelector(
    (state: RootState) => state.booking
  );

  const getGenderDisplay = (gender: string) => {
    if (gender === 'male') return 'Nam';
    if (gender === 'female') return 'Nữ';
    return 'Khác';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Xác nhận thông tin</Text>
      <Text style={styles.subtitle}>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</Text>

      {/* Doctor Info */}
      {doctor && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin bác sĩ</Text>
          <View style={styles.doctorSection}>
            {doctor.avatar ? (
              <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={32} color="#10b981" />
              </View>
            )}
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>
                {doctor.display_name || doctor.full_name}
              </Text>
              <View style={styles.infoRow}>
                <HeartPulse size={14} color="#ef4444" />
                <Text style={styles.specialty}>{doctor.specialty}</Text>
              </View>
              {doctor.experience_years && (
                <View style={styles.infoRow}>
                  <Shield size={14} color="#059669" />
                  <Text style={styles.experience}>
                    {doctor.experience_years} năm kinh nghiệm
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Date & Time */}
      {date && time && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thời gian khám</Text>
          <View style={styles.dateTimeGrid}>
            <View style={styles.dateTimeItem}>
              <View style={styles.iconCircle}>
                <Calendar size={20} color="#10b981" />
              </View>
              <View style={styles.dateTimeInfo}>
                <Text style={styles.dateTimeLabel}>Ngày khám</Text>
                <Text style={styles.dateTimeValue}>
                  {new Date(date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.dateTimeItem}>
              <View style={styles.iconCircle}>
                <Clock size={20} color="#10b981" />
              </View>
              <View style={styles.dateTimeInfo}>
                <Text style={styles.dateTimeLabel}>Giờ khám</Text>
                <Text style={styles.dateTimeValue}>{time}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Patient Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin bệnh nhân</Text>
        <View style={styles.patientSection}>
          <View style={styles.patientRow}>
            <View style={styles.patientLabel}>
              <User size={16} color="#6b7280" />
              <Text style={styles.patientLabelText}>Họ tên</Text>
            </View>
            <Text style={styles.patientValue}>{formData.fullName || '---'}</Text>
          </View>

          <View style={styles.patientRow}>
            <View style={styles.patientLabel}>
              <Phone size={16} color="#6b7280" />
              <Text style={styles.patientLabelText}>Điện thoại</Text>
            </View>
            <Text style={styles.patientValue}>{formData.phone || '---'}</Text>
          </View>

          <View style={styles.patientRow}>
            <View style={styles.patientLabel}>
              <Calendar size={16} color="#6b7280" />
              <Text style={styles.patientLabelText}>Ngày sinh</Text>
            </View>
            <Text style={styles.patientValue}>
              {formData.birthDate
                ? new Date(formData.birthDate).toLocaleDateString('vi-VN')
                : '---'}
            </Text>
          </View>

          <View style={styles.patientRow}>
            <View style={styles.patientLabel}>
              <User size={16} color="#6b7280" />
              <Text style={styles.patientLabelText}>Giới tính</Text>
            </View>
            <Text style={styles.patientValue}>
              {formData.gender ? getGenderDisplay(formData.gender) : '---'}
            </Text>
          </View>

          {formData.address && (
            <View style={styles.patientRow}>
              <View style={styles.patientLabel}>
                <MapPin size={16} color="#6b7280" />
                <Text style={styles.patientLabelText}>Địa chỉ</Text>
              </View>
              <Text style={[styles.patientValue, { flex: 1 }]}>
                {formData.address}
              </Text>
            </View>
          )}

          {formData.notes && (
            <View style={[styles.patientRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
              <View style={styles.patientLabel}>
                <FileText size={16} color="#6b7280" />
                <Text style={styles.patientLabelText}>Ghi chú</Text>
              </View>
              <Text style={[styles.patientValue, { marginTop: 8, marginLeft: 0 }]}>
                {formData.notes}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Warning */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Vui lòng đến đúng giờ đã đặt. Nếu có thay đổi, vui lòng liên hệ với
          phòng khám trước 24 giờ.
        </Text>
      </View>
    </ScrollView>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  doctorSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
  experience: {
    fontSize: 13,
    color: '#059669',
  },
  dateTimeGrid: {
    gap: 12,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTimeInfo: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  dateTimeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  patientSection: {
    gap: 12,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patientLabelText: {
    fontSize: 14,
    color: '#6b7280',
  },
  patientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'right',
  },
  warningBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
});
