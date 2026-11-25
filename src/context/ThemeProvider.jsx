import { useState } from "react";
import { ThemeContext } from "./ThemeContext";

// 2. Provide the context.
// Every component inside <ThemeProvider> can read { theme, toggleTheme }
// without receiving them as props.
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((previous) => (previous === "light" ? "dark" : "light"));
  };

  return (
    // Classic syntax: <Context.Provider value={...}>
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
