import { useState } from "react";
import { AuthContext } from "./AuthContext";

// Fake auth for learning purposes: the "user" is just a name saved in
// localStorage so the login survives a page refresh. A real app would call
// an API and store a token instead.
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem("user"));

  const login = (username) => {
    localStorage.setItem("user", username);
    setUser(username);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    // React 19 syntax: the context itself can be used as the provider.
    // Same as <AuthContext.Provider value={...}>
    <AuthContext value={{ user, login, logout }}>{children}</AuthContext>
  );
};

export default AuthProvider;
