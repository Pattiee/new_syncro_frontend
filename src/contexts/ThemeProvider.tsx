import React, { useEffect } from "react";
import { useSelector } from "react-redux";

// Interface representing the slice structure for your global design appearance
interface ThemeStateSlice {
  theme: "light" | "dark";
}

// Interface defining your global Redux store schema
interface ReduxRootState {
  theme?: "light" | "dark" | ThemeStateSlice;
}

// Define the incoming props signature contract for layout nodes
export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Strongly type the inline selector state criteria parameters
  const theme = useSelector((state: ReduxRootState) => {
    if (typeof state?.theme === "object" && state.theme !== null) {
      return state.theme.theme;
    }
    return state?.theme || "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;