import StudentList from "./components/StudentList";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchStudents } from "./features/students/studentsSlice";
import "./App.css";
import StudentFormUseReducer from "./components/StudentFormUseReducer";
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
  const dispatch = useDispatch();

  // Load students once when the app starts (async thunk -> Redux store)
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Module 10: the logged-in user lives in AuthProvider (Context).
  // Module 11: the student list lives in the Redux store (see store/store.js);
  // components read it with useSelector and change it with useDispatch.

  //no dependency array
  useEffect(() => {
    console.log("app rendered on every event");
  }); // triggers for every browser events

  //dependency array
  useEffect(() => {
    console.log("app rendered on name variable update");
  }, [name]); // triggers only on the dependency get updates

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
      <Route element={<Layout title={name} />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />

        <Route path="students" >
          <Route index element={<StudentList />} />
          {/* students/231 */}
          <Route path=":id" element={<StudentDetails />} />

          {/* Protected: only logged-in users can add or edit */}
          {/* students/add */}

          <Route element={<ProtectedRoute />}>
            <Route path="add" element={<StudentFormUseReducer />} />
            <Route path=":id/edit" element={<StudentFormUseReducer />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="courses/:courseName" element={<CourseStudents />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
