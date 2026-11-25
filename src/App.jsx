import StudentList from "./components/StudentList";
import { useEffect, useState } from "react";
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

  // Module 10: the student list, loading flag and logged-in user used to be
  // state here and were passed down as props. They now live in
  // StudentProvider / AuthProvider (see main.jsx) and components read them
  // with useStudents() / useAuth().

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
