import { User } from "../../types/auth";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/auth.service";

// Định nghĩa kiểu cho dữ liệu đăng nhập
interface LoginCredentials {
  email: string;
  password: string;
}

// Định nghĩa kiểu cho dữ liệu đăng ký
interface RegisterData {
  email: string;
  password: string;
  username: string;
  phone: string;
  fullName: string; // Giả định có trường này cho bệnh nhân
}

// Định nghĩa kiểu cho dữ liệu trả về từ API đăng nhập
interface LoginResponse {
  token: string;
  user: User;
}

// Async thunk cho đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      return response as LoginResponse; // Trả về dữ liệu đăng nhập
    } catch (error: any) {
      // Trả về lỗi để có thể xử lý ở component
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  }
);

// Async thunk cho đăng ký (sẽ hoàn thiện sau)
export const register = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      // Gọi API đăng ký
      // const response = await authService.register(userData);
      // return response.data;
      throw new Error("Chức năng đăng ký chưa được triển khai");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng ký thất bại"
      );
    }
  }
);

interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean;
  loading: boolean; // Thêm trạng thái loading
 error: string | null; // Thêm trường lỗi
}

const initialState: AuthState = {
  token: null,
  user: null,
  isInitialized: false, // Bắt đầu là false
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isInitialized = true;
      state.loading = false;
      state.error = null;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isInitialized = true;
      state.loading = false;
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    // Xử lý đăng nhập
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Xử lý khi trạng thái được phục hồi từ storage
      .addCase('persist/REHYDRATE', (state) => {
        state.isInitialized = true;
      });
  },
});

export const { setCredentials, clearAuth, setInitialized } = authSlice.actions;
export default authSlice.reducer;