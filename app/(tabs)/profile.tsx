
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../../src/redux/slices/authSlice';
import { RootState } from '../../src/redux';
import { useRouter } from 'expo-router';
import { User } from '../../src/types/auth';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => {
            dispatch(clearAuth());
          },
        },
      ]
    );
  };

  if (!token || !user) {
    // Guest UI: Đăng nhập/Đăng ký
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chào mừng bạn!</Text>
        <Text style={styles.desc}>Vui lòng đăng nhập hoặc đăng ký để sử dụng các tính năng cá nhân.</Text>
        <View style={styles.authBtnRow}>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerBtnText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Đã đăng nhập: hiển thị các option
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xin chào, {user.profile?.fullName || user.username}!</Text>
      <View style={styles.menuList}>
        <MenuItem label="Tài khoản cá nhân" onPress={() => router.push('/profile-detail')} />
        <MenuItem label="Lịch sử đặt khám" onPress={() => router.push('/appointment-history')} />
        <MenuItem label="Lịch sử trò chuyện" onPress={() => router.push('/chat-history')} />
        <MenuItem label="Cài đặt" onPress={() => router.push('/settings')} />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

function MenuItem({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0fdf4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#059669',
    textAlign: 'center',
  },
  desc: {
    color: '#374151',
    fontSize: 15,
    marginBottom: 18,
    textAlign: 'center',
  },
  authBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  loginBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  registerBtn: {
    borderWidth: 1,
    borderColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  registerBtnText: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 15,
  },
  menuList: {
    width: '100%',
    marginVertical: 18,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItemText: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});