import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("themeState") || "light";

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      return state === "light" ? "dark" : "light";
    },
    setTheme(state, action) {
      return action.payload;
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
