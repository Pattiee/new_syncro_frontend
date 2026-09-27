import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define strict type interfaces for state sub-entities
export interface UserProfile {
  id: string | number;
  username: string;
  email: string;
  givenName?: string;  // Aligned with Profile.tsx, UserCard.tsx, and AuthStatus.tsx properties
  familyName?: string; // Aligned with your frontend component data streams
  phone?: string;
  roles: (string | null)[];
  avatarUrl?: string;
  usernameVerified?: boolean;
  [key: string]: unknown; // Secure type safe replacement for 'any' wildcard parameters
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  userProfile: UserProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// 2. Safely read and validate pre-existing sessions from localStorage
const storedToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
const storedRefreshToken = typeof window !== "undefined" ? localStorage.getItem("auth_refresh_token") : null;
const storedProfile = typeof window !== "undefined" ? localStorage.getItem("auth_user_profile") : null;

const initialState: AuthState = {
  isAuthenticated: !!storedToken,
  token: storedToken,
  refreshToken: storedRefreshToken,
  isLoading: false, // Default to false on mount to avoid freezing layout states
  userProfile: storedProfile ? JSON.parse(storedProfile) : null,
  status: "idle",
  error: null,
};

// 3. Define payload schemas for state mutations
export interface SetAuthPayload {
  isAuthenticated: boolean;
  token: string;
  refreshToken: string;
  userProfile: UserProfile | null;
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<Partial<SetAuthPayload>>) => {
      state.isAuthenticated = action.payload?.isAuthenticated ?? false;
      state.token = action.payload?.token ?? null;
      state.refreshToken = action.payload?.refreshToken ?? null;
      state.userProfile = action.payload?.userProfile ?? null;
      state.status = "succeeded";
      state.error = null;

      // Synchronize persistence configurations safely 
      if (typeof window !== "undefined") {
        if (action.payload?.token) {
          localStorage.setItem("auth_token", action.payload.token);
        }
        if (action.payload?.refreshToken) {
          localStorage.setItem("auth_refresh_token", action.payload.refreshToken);
        }
        if (action.payload?.userProfile) {
          localStorage.setItem("auth_user_profile", JSON.stringify(action.payload.userProfile));
        }
      }
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.userProfile = null;
      state.status = "idle";
      state.error = null;

      // Complete persistence purge cycles
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_refresh_token");
        localStorage.removeItem("auth_user_profile");
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setStatus: (state, action: PayloadAction<AuthState["status"]>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.status = "failed";
      }
    },
  },
});

// Actions Export Block
export const { setAuth, clearAuth, setLoading, setStatus, setError } = authSlice.actions;

// Reducer Target Export Block
export default authSlice.reducer;

// 4. Strongly-Typed Selectors Framework
type ExpectedRootState = { auth: AuthState; [key: string]: unknown };

export const selectCurrentUser = (state: ExpectedRootState): UserProfile | null => state?.auth?.userProfile;
export const selectAuthStatus = (state: ExpectedRootState): AuthState["status"] => state?.auth?.status;
export const selectAuthError = (state: ExpectedRootState): string | null => state?.auth?.error;
export const selectIsAuthenticated = (state: ExpectedRootState): boolean => state?.auth?.isAuthenticated;
export const selectIsLoading = (state: ExpectedRootState): boolean => state?.auth?.isLoading;