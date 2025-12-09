import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData } from '../../src/redux/slices/bookingSlice';
import { RootState } from '../../src/redux';
import PatientInfoForm from './components/form/PatientInfoForm';
import { usePatientGuard } from '../../hooks/booking/usePatientGuard';
import LoadingState from './components/common/LoadingState';

export default function PatientInfoStep() {
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.booking);
  const { user } = useSelector((state: RootState) => state.auth);
  
  // 🔒 Auth Guard - Bảo vệ màn hình này
  const isAuthorized = usePatientGuard();

  // Auto-fill form with user profile (fetched during login)
  useEffect(() => {
    if (!user || user.role !== 'PATIENT') return;

    console.log('=== Loading Patient Info from Redux ===');
    console.log('User:', JSON.stringify(user, null, 2));
    
    // Check if user has profile data (fetched during login)
    if (user.role === 'PATIENT' && 'profile' in user && user.profile) {
      console.log('Profile found in Redux state');
      
      dispatch(
        setFormData({
          fullName: user.profile.fullName || user.username || '',
          birthDate: user.profile.dateOfBirth || '',
          gender: user.profile.gender || '',
          address: user.profile.address || '',
          phone: user.phone || '', // ⚠️ phone có thể là null - cần cập nhật trong profile
        })
      );
      
      console.log('FormData set with profile:', {
        fullName: user.profile.fullName,
        birthDate: user.profile.dateOfBirth,
        gender: user.profile.gender,
        phone: user.phone,
      });
    } else {
      console.log('No profile found - using basic user info');
      
      // Fallback to basic user info
      dispatch(
        setFormData({
          fullName: user.username || '',
          birthDate: '',
          gender: '',
          address: '',
          phone: user.phone || '', // ⚠️ phone có thể là null - cần cập nhật trong profile
        })
      );
    }
    
    console.log('==================');
  }, [user, dispatch]);

  const handleNotesChange = (value: string) => {
    dispatch(setFormData({ notes: value }));
  };

  // Show loading while auth check
  if (!isAuthorized) {
    return <LoadingState message="Đang kiểm tra quyền truy cập..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin bệnh nhân</Text>
      <Text style={styles.subtitle}>
        Thông tin được lấy từ hồ sơ của bạn. {!user?.phone && '⚠️ Vui lòng cập nhật số điện thoại trong Hồ sơ cá nhân.'}
      </Text>

      <PatientInfoForm formData={formData} onNotesChange={handleNotesChange} />
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
