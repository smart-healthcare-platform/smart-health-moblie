import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../src/redux/slices/authSlice';
import { RootState, AppDispatch } from '../../src/redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SocialButton from '../../components/ui/SocialButton';
import { Heart, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu.');
      return;
    }

    try {
      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        Alert.alert('Thành công', 'Đăng nhập thành công!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      }
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  const handleNavigateToRegister = () => {
    router.replace('/(auth)/register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Background decorative elements */}
      <View style={styles.backgroundDecorations}>
        <View style={[styles.circle, { top: 40, left: 10, width: 120, height: 120, backgroundColor: '#dbeafe', opacity: 0.2 }]} />
        <View style={[styles.circle, { top: '25%', right: 20, width: 100, height: 100, backgroundColor: '#d1fae5', opacity: 0.3 }]} />
        <View style={[styles.circle, { bottom: 20, left: '25%', width: 160, height: 160, backgroundColor: '#ede9fe', opacity: 0.15 }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Heart color="white" size={32} />
              </View>
              <Text style={styles.title}>Đăng Nhập</Text>
              <Text style={styles.subtitle}>Chăm sóc sức khỏe thông minh của bạn</Text>
            </View>

            <ErrorMessage message={error} />

            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="Nhập email của bạn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={error ? 'Email hoặc mật khẩu không đúng.' : undefined}
              />
              <View style={styles.passwordInputContainer}>
                <Input
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  error={error ? 'Email hoặc mật khẩu không đúng.' : undefined}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff color="#4b5563" size={18} /> : <Eye color="#4b5563" size={18} />}
                </TouchableOpacity>
              </View>
              <Button title={loading ? 'Đang đăng nhập...' : 'Đăng Nhập'} onPress={handleLogin} disabled={loading} />
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
              <TouchableOpacity onPress={handleNavigateToRegister} style={styles.linkContainer}>
                <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký ngay</Text>
              </TouchableOpacity>
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
    backgroundColor: '#eff6ff', // from-blue-50
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
    // For gradient background, consider using a library like `react-native-linear-gradient`
    backgroundColor: '#f8fafc', // Default background, will be covered by gradient if implemented
  },
  circle: {
    position: 'absolute',
    borderRadius: 999, // rounded-full
    // opacity được set trực tiếp trong component
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
  // ... giữ nguyên các style khác ...
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
    backgroundColor: '#3b82f6', // blue-500
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
    borderColor: '#ef444', // red-400
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
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.1,
  },
});