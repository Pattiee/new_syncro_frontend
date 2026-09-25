import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define strict type interfaces for state sub-entities
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  roles: string[];
  [key: string]: any; // Allows flexibility for custom payload shapes
}

export interface AuthState {
  is_authenticated: boolean;
  token: string | null;
  refresh_token: string | null;
  is_loading: boolean;
  user_profile: UserProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// 2. Safely read and validate pre-existing sessions from localStorage
const storedToken = localStorage.getItem("auth_token");
const storedRefreshToken = localStorage.getItem("auth_refresh_token");
const storedProfile = localStorage.getItem("auth_user_profile");

const initialState: AuthState = {
  is_authenticated: !!storedToken,
  token: storedToken,
  refresh_token: storedRefreshToken,
  is_loading: false, // Default to false on mount to avoid freezing layout states
  user_profile: storedProfile ? JSON.parse(storedProfile) : null,
  status: "idle",
  error: null,
};

// 3. Define payload schemas for payload mutations
export interface SetAuthPayload {
  is_authenticated: boolean;
  token: string;
  refresh_token: string;
  user_profile: UserProfile | null;
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<Partial<SetAuthPayload>>) => {
      state.is_authenticated = action.payload?.is_authenticated ?? false;
      state.token = action.payload?.token ?? null;
      state.refresh_token = action.payload?.refresh_token ?? null;
      state.user_profile = action.payload?.user_profile ?? null;
      state.status = "succeeded";
      state.error = null;

      // Synchronize persistence configurations safely 
      if (action.payload?.token) {
        localStorage.setItem("auth_token", action.payload.token);
      }
      if (action.payload?.refresh_token) {
        localStorage.setItem("auth_refresh_token", action.payload.refresh_token);
      }
      if (action.payload?.user_profile) {
        localStorage.setItem("auth_user_profile", JSON.stringify(action.payload.user_profile));
      }
    },
    clearAuth: (state) => {
      state.is_authenticated = false;
      state.token = null;
      state.refresh_token = null;
      state.user_profile = null;
      state.status = "idle";
      state.error = null;

      // Complete persistence purge cycles
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_refresh_token");
      localStorage.removeItem("auth_user_profile");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.is_loading = action.payload;
    },
    setStatus: (state, action: PayloadAction<AuthState["status"]>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) state.status = "failed";
    },
  },
});

// Actions Export Block
export const { setAuth, clearAuth, setLoading, setStatus, setError } = authSlice.actions;

// Reducer Target Export Block
export default authSlice.reducer;

// 4. Strongly-Typed Selectors Framework (Assumes RootState matches your global configuration mapping)
type ExpectedRootState = { auth: AuthState; [key: string]: any };

export const selectCurrentUser = (state: ExpectedRootState): UserProfile | null => state?.auth?.user_profile;
export const selectAuthStatus = (state: ExpectedRootState): AuthState["status"] => state?.auth?.status;
export const selectAuthError = (state: ExpectedRootState): string | null => state?.auth?.error;
export const selectIsAuthenticated = (state: ExpectedRootState): boolean => state?.auth?.is_authenticated;
export const selectIsLoading = (state: ExpectedRootState): boolean => state?.auth?.is_loading;