import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { User, Phone, Calendar, MapPin, FileText } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData } from '../../src/redux/slices/bookingSlice';
import { RootState } from '../../src/redux';

export default function PatientInfoStep() {
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.booking);
  const { user } = useSelector((state: RootState) => state.auth);

  // Auto-fill từ user profile
  useEffect(() => {
    if (user && user.role === 'PATIENT' && user.profile) {
      dispatch(
        setFormData({
          fullName: user.profile.fullName || '',
          birthDate: user.profile.dateOfBirth || '',
          gender: user.profile.gender || '',
          address: user.profile.address || '',
          phone: user.phone || '',
        })
      );
    }
  }, [user, dispatch]);

  const handleNotesChange = (text: string) => {
    dispatch(setFormData({ notes: text }));
  };

  const getGenderDisplay = (gender: string) => {
    if (gender === 'male') return 'Nam';
    if (gender === 'female') return 'Nữ';
    return 'Khác';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Thông tin bệnh nhân</Text>
      <Text style={styles.subtitle}>
        Thông tin được lấy từ hồ sơ của bạn
      </Text>

      <View style={styles.formCard}>
        {/* Họ và tên */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <User size={16} color="#10b981" />
            <Text style={styles.label}>Họ và tên *</Text>
          </View>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputText}>{formData.fullName || '---'}</Text>
          </View>
        </View>

        {/* Số điện thoại */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Phone size={16} color="#10b981" />
            <Text style={styles.label}>Số điện thoại *</Text>
          </View>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputText}>{formData.phone || '---'}</Text>
          </View>
        </View>

        {/* Ngày sinh */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Calendar size={16} color="#10b981" />
            <Text style={styles.label}>Ngày sinh *</Text>
          </View>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputText}>
              {formData.birthDate
                ? new Date(formData.birthDate).toLocaleDateString('vi-VN')
                : '---'}
            </Text>
          </View>
        </View>

        {/* Giới tính */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <User size={16} color="#10b981" />
            <Text style={styles.label}>Giới tính *</Text>
          </View>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputText}>
              {formData.gender ? getGenderDisplay(formData.gender) : '---'}
            </Text>
          </View>
        </View>

        {/* Địa chỉ */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <MapPin size={16} color="#10b981" />
            <Text style={styles.label}>Địa chỉ</Text>
          </View>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputText}>{formData.address || '---'}</Text>
          </View>
        </View>

        {/* Ghi chú - có thể chỉnh sửa */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <FileText size={16} color="#10b981" />
            <Text style={styles.label}>Ghi chú / Triệu chứng</Text>
          </View>
          <TextInput
            style={styles.textArea}
            value={formData.notes}
            onChangeText={handleNotesChange}
            placeholder="Nhập triệu chứng, ghi chú hoặc lý do khám bệnh"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Info Note */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Thông tin cá nhân được lấy từ hồ sơ của bạn. Để thay đổi, vui lòng
            cập nhật trong phần Hồ sơ cá nhân.
          </Text>
        </View>
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
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputText: {
    fontSize: 15,
    color: '#6b7280',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 15,
    color: '#1e293b',
    minHeight: 100,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
});
