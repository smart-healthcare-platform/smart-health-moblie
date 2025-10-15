import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState } from '../../src/redux';

/**
 * Custom hook để bảo vệ các màn hình booking
 * Chỉ cho phép user đã đăng nhập với role PATIENT truy cập
 * 
 * @returns {boolean} isAuthorized - true nếu user được phép truy cập
 */
export function usePatientGuard(): boolean {
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Kiểm tra nếu chưa đăng nhập
    if (!token || !user) {
      console.log('[Auth Guard] User not logged in, redirecting to login...');
      router.replace('/login');
      return;
    }

    // Kiểm tra role PATIENT
    if (user.role !== 'PATIENT') {
      console.log(`[Auth Guard] User role is ${user.role}, not PATIENT. Going back...`);
      // Có thể redirect về home hoặc back
      router.back();
      return;
    }

    console.log('[Auth Guard] User authorized as PATIENT');
  }, [token, user, router]);

  // Return true nếu đã đăng nhập và là PATIENT
  return !!(token && user && user.role === 'PATIENT');
}
