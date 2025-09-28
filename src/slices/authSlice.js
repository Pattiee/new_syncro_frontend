import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  isLoading: true,
  userProfile: null,
  status: "idle",   // added to support async flows
  error: null,      // added to support error tracking
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload?.isAuthenticated ?? false;
      state.token = action.payload?.token ?? "";
      state.refreshToken = action.payload?.refreshToken ?? "";
      state.userProfile = action.payload?.userProfile ?? null;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.userProfile = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Actions
export const { setAuth, clearAuth, setLoading, setStatus, setError } =
  authSlice.actions;

// Reducer
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = state => state?.auth?.userProfile;
export const selectAuthStatus = state => state?.auth?.status;
export const selectAuthError = state => state?.auth?.error;
export const selectIsAuthenticated = state => state?.auth?.isAuthenticated;
