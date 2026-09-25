import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

// Helper function to check browser/system level dark mode preferences
const getSystemThemeFallback = (): ThemeMode => {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

// Initial state reads localStorage first; if empty, it adapts to the system's current theme perfectly
const initialState: ThemeMode = 
  (localStorage.getItem("themeState") as ThemeMode) || getSystemThemeFallback();

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state: ThemeMode): ThemeMode {
      const nextTheme = state === "light" ? "dark" : "light";
      localStorage.setItem("themeState", nextTheme);
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