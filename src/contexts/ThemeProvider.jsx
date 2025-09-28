import { useEffect } from "react";
import { useSelector } from "react-redux";

export const ThemeProvider = ({ children }) => {
  const theme = useSelector(state => state?.theme || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return children;
}