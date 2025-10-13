// lib/axios.ts
import axios from "axios";
// Không import store và slice ở đây nữa để tránh require cycle
const BASE_URL = "https://d01jtfcv-8080.asse.devtunnels.ms/v1"; // Thay thế bằng URL API thực tế của bạn

// ===============
// API Instances
// ===============
/**
 * API cho các request yêu cầu token (Authenticated)
 */
export const apiAuth = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * API cho các request public (Login, Register, data public, v.v.)
 */
export const apiNoAuth = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});

/**
 * API riêng biệt chỉ dùng để refresh token
 */
export const apiRefresh = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ===============
// Interceptors
// ===============

// Hàm này sẽ được gọi từ bên ngoài để cấu hình interceptor
// sau khi store đã được khởi tạo.
export const injectStore = (store: any) => {
  apiAuth.interceptors.request.use(async (config) => {
    const token = store.getState().auth.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Có thể thêm interceptor cho response ở đây nếu cần
};

// Xử lý 401: refresh token và retry request
// apiAuth.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     // Nếu là login/register/refresh thì không retry
//     if (
//       originalRequest.url?.includes("/auth/login") ||
//       originalRequest.url?.includes("/auth/register") ||
//       originalRequest.url?.includes("/auth/refresh-token")
//     ) {
//       return Promise.reject(error);
//     }

//     // Nếu bị 401 và chưa retry
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const res = await apiRefresh.post("/auth/refresh-token");
//         const { token, user } = res.data.data;

//         // Lưu token mới vào redux
//         store.dispatch(setCredentials({ token, user }));

//         // Retry request với token mới
//         originalRequest.headers.Authorization = `Bearer ${token}`;
//         return apiAuth(originalRequest);
//       } catch (err) {
//         // Refresh thất bại → clear auth + redirect login
//         store.dispatch(clearAuth());
//         if (typeof window !== "undefined") {
//           window.location.href = "/login";
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );