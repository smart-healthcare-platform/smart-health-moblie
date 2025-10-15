import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
import { Doctor, DoctorDetail } from '../../../../src/types';

interface BookingSummaryCardProps {
  doctor: Doctor | DoctorDetail | null;
  date: string | null;
  time: string | null;
  formData: {
    fullName?: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
    address?: string;
    notes?: string;
  };
}

export default function BookingSummaryCard({
  doctor,
  date,
  time,
  formData,
}: BookingSummaryCardProps) {
  const getGenderDisplay = (gender: string) => {
    if (gender === 'male') return 'Nam';
    if (gender === 'female') return 'Nữ';
    return 'Khác';
  };

  // Type guard to check if doctor has experience_years (Doctor type)
  const hasExperienceYears = (doc: Doctor | DoctorDetail): doc is Doctor => {
    return 'experience_years' in doc;
  };

  return (
    <>
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
              {hasExperienceYears(doctor) && doctor.experience_years && (
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
    </>
  );
}

const styles = StyleSheet.create({
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
    color: '#047857',
  },
  dateTimeGrid: {
    gap: 12,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTimeInfo: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  patientSection: {
    gap: 14,
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
    fontWeight: '500',
    color: '#1e293b',
    textAlign: 'right',
  },
  warningBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  warningText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
});
