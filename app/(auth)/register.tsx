import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../src/redux/slices/authSlice';
import { RootState, AppDispatch } from '../../src/redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/ui/ErrorMessage';
import PasswordStrengthBar from '../../components/ui/PasswordStrengthBar';
import Checkbox from '../../components/ui/Checkbox';
import SocialButton from '../../components/ui/SocialButton';
import { UserPlus, Shield, Activity, Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Thêm state cho xác nhận mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState(''); // Giả định trường này cho hồ sơ bệnh nhân
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>(); // Sử dụng AppDispatch
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const handleRegister = async () => {
    if (!email || !password || !username || !phone || !fullName) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (!acceptTerms) {
      Alert.alert('Lỗi', 'Vui lòng đồng ý với điều khoản sử dụng.');
      return;
    }
    try {
      const resultAction = await dispatch(register({ email, password, username, phone, fullName }));
      if (register.fulfilled.match(resultAction)) {
        Alert.alert('Thành công', 'Đăng ký thành công!', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  const handleNavigateToLogin = () => {
    router.replace('/(auth)/login'); // Điều hướng đến màn hình login trong nhóm (auth)
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.backgroundDecorations}>
        <View style={[styles.circle, { top: 40, left: 10, width: 120, height: 120, backgroundColor: '#ede9fe', opacity: 0.2 }]} />
        <View style={[styles.circle, { top: '25%', right: 20, width: 100, height: 100, backgroundColor: '#dbeafe', opacity: 0.3 }]} />
        <View style={[styles.circle, { bottom: 20, left: '25%', width: 160, height: 160, backgroundColor: '#d1fae5', opacity: 0.15 }]} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContentContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <UserPlus color="white" size={32} />
              </View>
              <Text style={styles.title}>Đăng Ký</Text>
              <Text style={styles.subtitle}>Tạo tài khoản để bắt đầu hành trình sức khỏe</Text>
            </View>
            <ErrorMessage message={error} />
            <View style={styles.form}>
              <Input
                label="Họ và tên"
                placeholder="Nhập họ và tên của bạn"
                value={fullName}
                onChangeText={setFullName}
              />
              <Input
                label="Tên người dùng"
                placeholder="Nhập tên người dùng của bạn"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <Input
                label="Số điện thoại"
                placeholder="Nhập số điện thoại của bạn"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <Input
                label="Email"
                placeholder="Nhập email của bạn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.passwordInputContainer}>
                <Input
                  label="Mật khẩu"
                  placeholder="Tạo mật khẩu mạnh"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <PasswordStrengthBar password={password} />
              </View>
              <View style={styles.passwordInputContainer}>
                <Input
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
              </View>
              <View style={{ marginTop: 8, marginBottom: 8 }}>
                <Checkbox
                  checked={acceptTerms}
                  onChange={setAcceptTerms}
                  label="Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật"
                />
              </View>
              <Button title={loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'} onPress={handleRegister} disabled={loading} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
                <Text style={{ marginHorizontal: 8, color: '#6b7280', fontSize: 13 }}>hoặc</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
              </View>
              <SocialButton
                title="Facebook"
                color="#3b82f6"
                icon={<View style={{ width: 20, height: 20, backgroundColor: '#3b82f6', borderRadius: 4 }} />}
                onPress={() => {}}
              />
              <SocialButton
                title="Google"
                color="#ef4444"
                icon={<View style={{ width: 20, height: 20, backgroundColor: '#ef4444', borderRadius: 10 }} />}
                onPress={() => {}}
              />
              <TouchableOpacity onPress={handleNavigateToLogin} style={styles.linkContainer}>
                <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.footerFeatures}>
            <View style={{ alignItems: 'center' }}>
              <Shield size={20} color="#a855f7" />
              <Text style={styles.footerText}>Thông tin bảo mật</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <UserPlus size={20} color="#3b82f6" />
              <Text style={styles.footerText}>Đăng ký miễn phí</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Activity size={20} color="#22c55e" />
              <Text style={styles.footerText}>Hỗ trợ 24/7</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // from-purple-50 via-white to-blue-50
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  backgroundDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
    zIndex: 0,
  },
  footerFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999, // rounded-full
    opacity: 0.2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 48,
    position: 'relative',
    zIndex: 10,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 12,
    paddingHorizontal: 28,
    paddingVertical: 36,
    borderWidth: 0,
    marginHorizontal: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16, // rounded-2xl
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    // For gradient, consider using a library like `react-native-linear-gradient`
    backgroundColor: '#a855f7', // Temporary solid color for gradient from-purple-500 to-blue-500
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 15,
    color: '#4b5563',
    marginTop: 2,
  },
  errorMessageContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fef2f2', // red-50
    borderLeftWidth: 4,
    borderColor: '#ef4444', // red-400
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorMessage: {
    color: '#b91c1c', // red-700
    fontSize: 12,
    marginLeft: 8,
  },
  form: {
    gap: 22,
    marginTop: 8,
    marginBottom: 8,
  },
  passwordInputContainer: {
    position: 'relative',
    marginBottom: 2,
  },
  eyeIcon: {
    position: 'absolute',
    right: 18,
    top: 36,
    padding: 8,
  },
  linkContainer: {
    marginTop: 28,
    alignItems: 'center',
  },
  linkText: {
    color: '#9333ea',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.1,
  },
});