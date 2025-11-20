import { useContext } from "react";
import { ThemeContext, type ThemeContextType } from "../contexts/themeContext";

const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ContextProvider");
  }
  return context;
};

export default useTheme;
