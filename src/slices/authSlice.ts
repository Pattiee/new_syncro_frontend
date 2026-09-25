import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
}

// Check if a token already exists from a previous session
const initialToken = localStorage.getItem("auth_token");

const initialState: AuthState = {
  token: initialToken,
  username: localStorage.getItem("auth_username"),
  isAuthenticated: !!initialToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; username: string }>
    ) => {
      const { token, username } = action.payload;
      state.token = token;
      state.username = username;
      state.isAuthenticated = true;

      // Persist to local storage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_username", username);
    },
    logOut: (state) => {
      state.token = null;
      state.username = null;
      state.isAuthenticated = false;

      // Clean up local storage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_username");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;