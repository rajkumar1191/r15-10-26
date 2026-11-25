import { useMemo } from "react";
import { useStudents } from "../context/StudentContext";

// Index route of /dashboard: shown at exactly "/dashboard"
const DashboardOverview = () => {
  const { students: studentList } = useStudents();
  const studentStats = useMemo(() => {
    console.log("calculating student statistics...");

    const total = studentList.length;

    const reactStudents = studentList.filter(
      (student) => student.course === "React",
    ).length;
    const angularStudents = studentList.filter(
      (student) => student.course === "Angular",
    ).length;

    return {
      total,
      reactStudents,
      angularStudents,
    };
  }, [studentList]);

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
