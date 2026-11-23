import { useMemo } from "react";
import { NavLink, Outlet } from "react-router";

// Parent of the nested dashboard routes:
//   /dashboard                     -> <DashboardOverview />  (index route)
//   /dashboard/courses/:courseName -> <CourseStudents />
// The parent keeps its own UI (title + course menu) and the matched child is
// rendered where <Outlet /> is placed.
const Dashboard = ({ studentList }) => {
  // Dynamic routing: the course links are generated from the data, so a new
  // course in db.json automatically gets its own page without a new <Route>.
  const courses = useMemo(
    () => [...new Set(studentList.map((student) => student.course))],
    [studentList],
  );

  return (
    <section>
      <h2>Dashboard</h2>
      <nav>
        {/* relative path "." -> /dashboard ; end -> active only there */}
        <NavLink to="." end>
          Overview
        </NavLink>
        {courses.map((course) => (
          // relative link: resolves to /dashboard/courses/<course>
          <NavLink key={course} to={`courses/${course}`}>
            {course}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </section>
  );
};

export default Dashboard;
