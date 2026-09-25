import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define a strict type for your allowed theme states
export type ThemeMode = "light" | "dark";

// Read from localStorage and assert that it must match our explicit ThemeMode type, defaulting to "light"
const initialState: ThemeMode = (localStorage.getItem("themeState") as ThemeMode) || "light";

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state: ThemeMode): ThemeMode {
      const nextTheme = state === "light" ? "dark" : "light";
      localStorage.setItem("themeState", nextTheme); // Synchronise local storage directly during mutations
      return nextTheme;
    },
    setTheme(_state: ThemeMode, action: PayloadAction<ThemeMode>): ThemeMode {
      localStorage.setItem("themeState", action.payload);
      return action.payload;
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;