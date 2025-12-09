import { User } from "../../types/auth";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/auth.service";
import { patientService } from "../../services/patient.service";
import { apiNoAuth } from "../../lib/axios";
import { UpdatePatientDto, ChangePasswordDto } from "../../types/patient";

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
      const { token, user } = response as LoginResponse;
      
      // Fetch profile data based on user role (matching website pattern)
      if (user.role === "PATIENT") {
        try {
          const patientRes = await apiNoAuth.get(`/patients/by-user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const patient = patientRes.data.data;
          
          // Return enhanced user with profile (matching website pattern)
          return {
            token,
            user: {
              ...user,
              phone: patient.phone,  // ✅ Get phone from patient table
              role: "PATIENT" as const,
              referenceId: patient.id,
              profile: {
                fullName: patient.full_name,
                gender: patient.gender,
                address: patient.address,
                dateOfBirth: patient.date_of_birth
              }
            }
          };
        } catch (profileError: any) {
          console.log('Patient profile not found, using basic user info');
          // If profile fetch fails, return user without profile
          return { token, user };
        }
      }
      
      // For non-patient roles, return as-is
      return { token, user };
    } catch (error: any) {
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

// Async thunk cho cập nhật profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ patientId, data }: { patientId: string; data: UpdatePatientDto }, { rejectWithValue }) => {
    try {
      const updatedPatient = await patientService.updateProfile(patientId, data);
      return updatedPatient;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Cập nhật thông tin thất bại"
      );
    }
  }
);

// Async thunk cho đổi mật khẩu
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data: ChangePasswordDto, { rejectWithValue }) => {
    try {
      // Validate passwords match
      if (data.newPassword !== data.confirmPassword) {
        throw new Error("Mật khẩu xác nhận không khớp");
      }
      
      const response = await authService.changePassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Đổi mật khẩu thất bại"
      );
    }
  }
);

// Async thunk cho upload avatar
export const uploadAvatar = createAsyncThunk(
  "auth/uploadAvatar",
  async ({ patientId, formData }: { patientId: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const result = await patientService.uploadAvatar(patientId, formData);
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Upload ảnh đại diện thất bại"
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
      // Xử lý cập nhật profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Update user profile in state
        if (state.user && state.user.role === 'PATIENT') {
          state.user.phone = action.payload.phone;  // ✅ Update phone too
          state.user.profile = {
            fullName: action.payload.full_name || action.payload.fullName,
            gender: action.payload.gender,
            address: action.payload.address,
            dateOfBirth: action.payload.date_of_birth || action.payload.dateOfBirth,
          };
        }
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Xử lý đổi mật khẩu
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Xử lý upload avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        // Update avatar URL in user state
        if (state.user) {
          state.user.avatarUrl = action.payload.avatarUrl || action.payload.avatar_url;
        }
        state.error = null;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
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