import { User } from "../../types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isInitialized: false,
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
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isInitialized = true;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { setCredentials, clearAuth, setInitialized } = authSlice.actions;
export default authSlice.reducer;