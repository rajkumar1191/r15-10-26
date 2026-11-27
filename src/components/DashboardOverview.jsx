import { useSelector } from "react-redux";
import { selectStudentStats } from "../features/students/studentsSlice";

// Index route of /dashboard: shown at exactly "/dashboard"
const DashboardOverview = () => {
  // The stats calculation moved into a memoized selector in the slice
  const studentStats = useSelector(selectStudentStats);

  return (
    <section className="dashboard">
      <div className="stat-card">
        <h3>Total Students</h3>
        <h1>{studentStats.total}</h1>
      </div>
      <div className="stat-card">
        <h3>React Students</h3>
        <h1>{studentStats.reactStudents}</h1>
      </div>
      <div className="stat-card">
        <h3>Angular Students</h3>
        <h1>{studentStats.angularStudents}</h1>
      </div>
    </section>
  );
};

export default DashboardOverview;
