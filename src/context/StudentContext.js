import { createContext, useContext } from "react";

export const StudentContext = createContext(null);

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudents must be used inside <StudentProvider>");
  }
  return context;
};
