import { createContext, useContext } from "react";

// 1. Create the context.
// The argument is the DEFAULT value. It is used only when a component reads
// the context but has no <ThemeContext.Provider> above it.
export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

// Small custom hook so components write useTheme() instead of
// useContext(ThemeContext).
export const useTheme = () => useContext(ThemeContext);
