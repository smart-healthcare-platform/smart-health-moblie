import { apiNoAuth, apiAuth, apiRefresh } from '../lib/axios'

export const authService = {
  refreshToken: async () => {
    const res = await apiRefresh.post('/auth/refresh-token')
    return res.data.data
  },
  login: async (email: string, password: string) => {
    const res = await apiNoAuth.post('/auth/login', { email, password })
    return res.data.data
  },
  logout: async () => {
    try {
      await apiAuth.post('/auth/logout')
    } catch (err) {
      console.warn('Logout API failed:', err)
    } finally {
      // Trong React Native, việc quản lý trạng thái đăng nhập
      // sẽ do Redux và AsyncStorage xử lý, không cần trực tiếp xóa item.
      // localStorage.removeItem("isLogin")
    }
  },
}