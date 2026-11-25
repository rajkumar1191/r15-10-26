import { useCallback, useEffect, useMemo, useState } from "react";
import { StudentContext } from "./StudentContext";
import {
  deleteStudent,
  getStudents,
} from "../services/studentServicesByAxios";

// Global state for the student list.
// The state and the functions that change it live here, in one place.
// Any component can read or update it with useStudents().
const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reload after add / edit / delete (called from event handlers)
  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load when the app starts
  useEffect(() => {
    let ignore = false;
    getStudents()
      .then((data) => {
        if (!ignore) setStudents(data);
      })
      .catch((error) => console.log(error.message))
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true; // StrictMode runs effects twice in dev
    };
  }, []);

  const removeStudent = useCallback(
    async (id) => {
      if (!id) return;
      await deleteStudent(id);
      await loadStudents();
    },
    [loadStudents],
  );

  // useMemo -> the value object keeps the same reference until something in
  // it changes, so consumers don't re-render on every provider render.
  const value = useMemo(
    () => ({ students, loading, loadStudents, removeStudent }),
    [students, loading, loadStudents, removeStudent],
  );

  return <StudentContext value={value}>{children}</StudentContext>;
};

export default StudentProvider;
