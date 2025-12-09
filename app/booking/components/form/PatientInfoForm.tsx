import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { User, Phone, Calendar, MapPin, FileText } from 'lucide-react-native';

interface PatientInfoFormProps {
  formData: {
    fullName?: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
    address?: string;
    notes?: string;
  };
  onNotesChange: (text: string) => void;
}

export default function PatientInfoForm({
  formData,
  onNotesChange,
}: PatientInfoFormProps) {
  const hasCompleteProfile = formData.fullName && formData.birthDate && formData.gender;
  const hasPhone = formData.phone && formData.phone.trim() !== '';
  const isProfileIncomplete = !hasCompleteProfile || !hasPhone;
  
  const getGenderDisplay = (gender: string) => {
    if (gender === 'MALE') return 'Nam';
    if (gender === 'FEMALE') return 'Nữ';
    if (gender === 'male') return 'Nam';
    if (gender === 'female') return 'Nữ';
    return 'Khác';
  };

  const getMissingFields = () => {
    const missing: string[] = [];
    if (!formData.fullName) missing.push('Họ và tên');
    if (!formData.phone) missing.push('Số điện thoại');
    if (!formData.birthDate) missing.push('Ngày sinh');
    if (!formData.gender) missing.push('Giới tính');
    return missing;
  };

  return (
    <View style={styles.formCard}>
      {/* Warning if profile is incomplete */}
      {isProfileIncomplete && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Thông tin chưa đầy đủ</Text>
          <Text style={styles.warningText}>
            Bạn cần cập nhật các thông tin sau trong Hồ sơ cá nhân để có thể đặt lịch khám:
          </Text>
          <View style={styles.missingFieldsList}>
            {getMissingFields().map((field, index) => (
              <Text key={index} style={styles.missingFieldItem}>
                • {field}
              </Text>
            ))}
          </View>
          <Text style={styles.warningAction}>
            👉 Vào Hồ sơ cá nhân → Chỉnh sửa thông tin
          </Text>
        </View>
      )}
      
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
        <View style={[styles.inputDisabled, !hasPhone && styles.inputError]}>
          <Text style={[styles.inputText, !hasPhone && styles.inputTextError]}>
            {formData.phone || '⚠️ Chưa cập nhật'}
          </Text>
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
          onChangeText={onNotesChange}
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
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputText: {
    fontSize: 14,
    color: '#6b7280',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#d1d5db',
    minHeight: 100,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  infoText: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  warningBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '700',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
    marginBottom: 8,
  },
  missingFieldsList: {
    marginLeft: 8,
    marginBottom: 8,
  },
  missingFieldItem: {
    fontSize: 13,
    color: '#92400e',
    fontWeight: '600',
    lineHeight: 20,
  },
  warningAction: {
    fontSize: 13,
    color: '#92400e',
    fontWeight: '700',
    marginTop: 4,
  },
  inputError: {
    borderColor: '#f87171',
    borderWidth: 2,
    backgroundColor: '#fef2f2',
  },
  inputTextError: {
    color: '#dc2626',
    fontWeight: '600',
  },
});
