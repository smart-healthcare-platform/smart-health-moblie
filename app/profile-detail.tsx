import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../src/redux';
import { Avatar, InfoCard, SectionHeader } from '../components/profile';
import { Ionicons } from '@expo/vector-icons';
import { updateProfile, changePassword } from '../src/redux/slices/authSlice';
import { Stack } from 'expo-router';

export default function ProfileDetailScreen() {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Type guard: Only PATIENT has profile
  const patientProfile = user?.role === 'PATIENT' ? user.profile : null;
  const fullName = patientProfile?.fullName || user?.username || '';
  const address = patientProfile?.address || '';

  // Edit form state
  const [editForm, setEditForm] = useState({
    fullName,
    phone: user?.phone || '',
    address,
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async () => {
    if (!user?.referenceId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin bệnh nhân');
      return;
    }

    try {
      await dispatch(
        updateProfile({
          patientId: user.referenceId,
          data: {
            fullName: editForm.fullName,
            phone: editForm.phone,
            address: editForm.address,
          },
        })
      ).unwrap();

      Alert.alert('Thành công', 'Cập nhật thông tin thành công');
      setShowEditModal(false);
    } catch (error: any) {
      Alert.alert('Lỗi', error || 'Cập nhật thông tin thất bại');
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      await dispatch(changePassword(passwordForm)).unwrap();

      Alert.alert('Thành công', 'Đổi mật khẩu thành công');
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      Alert.alert('Lỗi', error || 'Đổi mật khẩu thất bại');
    }
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>Vui lòng đăng nhập</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Thông tin cá nhân',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#059669',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerShadowVisible: true,
        }}
      />
      <ScrollView style={styles.container}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Avatar
            uri={user.avatarUrl}
            name={fullName}
            size="large"
            editable={false}
          />
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Personal Info Section */}
        <View style={styles.section}>
          <SectionHeader title="Thông tin cá nhân" icon="person" />

          <InfoCard icon="person-outline" label="Họ và tên" value={fullName || '---'} />

          <InfoCard
            icon="transgender"
            label="Giới tính"
            value={
              patientProfile?.gender === 'male'
                ? 'Nam'
                : patientProfile?.gender === 'female'
                ? 'Nữ'
                : patientProfile?.gender || '---'
            }
          />

          <InfoCard
            icon="calendar-outline"
            label="Ngày sinh"
            value={patientProfile?.dateOfBirth ? formatDate(patientProfile.dateOfBirth) : '---'}
          />

          <InfoCard icon="call-outline" label="Số điện thoại" value={user.phone || '---'} />

          <InfoCard icon="mail-outline" label="Email" value={user.email || '---'} />

          <InfoCard icon="location-outline" label="Địa chỉ" value={address || '---'} />
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setEditForm({
                fullName,
                phone: user?.phone || '',
                address,
              });
              setShowEditModal(true);
            }}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.passwordButton]}
            onPress={() => setShowPasswordModal(true)}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Info Modal */}
        <Modal visible={showEditModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Họ và tên</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.fullName}
                  onChangeText={(text) => setEditForm({ ...editForm, fullName: text })}
                  placeholder="Nhập họ và tên"
                />

                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.phone}
                  onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                />

                <Text style={styles.inputLabel}>Địa chỉ</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editForm.address}
                  onChangeText={(text) => setEditForm({ ...editForm, address: text })}
                  placeholder="Nhập địa chỉ"
                  multiline
                  numberOfLines={3}
                />
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleUpdateProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Lưu</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Change Password Modal */}
        <Modal visible={showPasswordModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
                <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Mật khẩu cũ</Text>
                <TextInput
                  style={styles.input}
                  value={passwordForm.oldPassword}
                  onChangeText={(text) => setPasswordForm({ ...passwordForm, oldPassword: text })}
                  placeholder="Nhập mật khẩu cũ"
                  secureTextEntry
                />

                <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                <TextInput
                  style={styles.input}
                  value={passwordForm.newPassword}
                  onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  secureTextEntry
                />

                <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
                <TextInput
                  style={styles.input}
                  value={passwordForm.confirmPassword}
                  onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
                  placeholder="Nhập lại mật khẩu mới"
                  secureTextEntry
                />
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowPasswordModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Đổi mật khẩu</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4', // Match system green tint
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669', // System primary green
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669', // System primary green
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordButton: {
    backgroundColor: '#f59e0b', // Keep warning color
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669', // System primary green
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1fae5', // Light green border
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#059669', // System primary green
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
