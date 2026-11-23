import StudentList from "./components/StudentList";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import StudentFormUseReducer from "./components/StudentFormUseReducer";
import { deleteStudent, getStudents } from "./services/studentServicesByAxios";
import { Routes, Route } from "react-router";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import DashboardOverview from "./components/DashboardOverview";
import CourseStudents from "./components/CourseStudents";
import Layout from "./components/Layout";
import StudentDetails from "./components/StudentDetails";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";

// const initialStudents = [
//   {
//     id: 1,
//     name: "Raj",
//     course: "React",
//   },
//   {
//     id: 2,
//     name: "Kumar",
//     course: "Angular",
//   },
// ];

const App = () => {
  const [name] = useState("Student Management");
  const [loading, setLoading] = useState(true);
  // useState()-> hook
  // const [studentList, setStudentList] = useState(initialStudents);
  const [studentList, setStudentList] = useState([]);

  // Logged-in user (fake auth: just a name kept in localStorage so the
  // login survives a page refresh). Passed down as props.
  const [user, setUser] = useState(() => localStorage.getItem("user"));

  const handleLogin = (username) => {
    localStorage.setItem("user", username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  //no dependency array
  useEffect(() => {
    console.log("app rendered on every event");
  }); // triggers for every browser events

  // Reload after add / edit / delete (called from event handlers)
  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudentList(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  //empty dependency array
  useEffect(() => {
    console.log("app rendered on mount");

    let ignore = false;
    getStudents()
      .then((data) => {
        if (!ignore) setStudentList(data);
      })
      .catch((error) => console.log(error.message))
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true; // StrictMode runs effects twice in dev
    };
  }, []); // triggers only at the component mount

  //dependency array
  useEffect(() => {
    console.log("app rendered on name variable update");
  }, [name]); // triggers only on the dependency get updates

  const handleDeleteStudent = useCallback(
    async (id) => {
      if (!id) return;
      await deleteStudent(id);
      loadStudents();
    },
    [loadStudents],
  );

  /*
    Route tree (Module 9 - React Router)

    /                               Home                (index route)
    /login                          Login
    /students                       StudentList         (index route)
    /students/:id                   StudentDetails      (route parameter)
    /students/add                   Add form            (protected)
    /students/:id/edit              Edit form           (protected)
    /dashboard                      Dashboard > Overview        (protected, nested)
    /dashboard/courses/:courseName  Dashboard > CourseStudents  (protected, nested)
    *                               NotFound            (catch-all 404)

    Every page is nested in <Layout>, which renders Header/Footer + <Outlet />.
    Static segments win over dynamic ones, so "/students/add" matches the add
    route even though ":id" could also match "add".
  */
  return (
    <Routes>
      <Route
        element={
          <Layout
            title={name}
            loading={loading}
            user={user}
            onLogout={handleLogout}
          />
        }
      >
        <Route index element={<Home />} />
        <Route
          path="login"
          element={<Login user={user} onLogin={handleLogin} />}
        />

        <Route path="students" >
          <Route
            index
            element={
              <StudentList
                students={studentList}
                onDeleteStudent={handleDeleteStudent}
              />
            }
          />
          {/* students/231 */}
          <Route path=":id" element={<StudentDetails />} />

          {/* Protected: only logged-in users can add or edit */}
          {/* students/add */}

          <Route element={<ProtectedRoute user={user} />}>
            <Route
              path="add"
              element={<StudentFormUseReducer onSaved={loadStudents} />}
            />
            <Route
              path=":id/edit"
              element={<StudentFormUseReducer onSaved={loadStudents} />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute user={user} />}>
          <Route
            path="dashboard"
            element={<Dashboard studentList={studentList} />}
          >
            <Route
              index
              element={<DashboardOverview studentList={studentList} />}
            />
            <Route
              path="courses/:courseName"
              element={<CourseStudents studentList={studentList} />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
