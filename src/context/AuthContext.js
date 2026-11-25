import { createContext, useContext } from "react";

// null default -> if useAuth() returns null, the component is not inside
// <AuthProvider>. The hook turns that mistake into a clear error.
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};
