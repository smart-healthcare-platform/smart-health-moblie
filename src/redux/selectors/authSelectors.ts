import { RootState } from "../index"

export const selectIsLoggedIn = (state: RootState) =>
  state.auth.isInitialized && !!state.auth.token;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsInitialized = (state: RootState) =>
  state.auth.isInitialized;