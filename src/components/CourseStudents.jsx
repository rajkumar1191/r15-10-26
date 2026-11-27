import { Link, useParams } from "react-router";
import { useSelector } from "react-redux";
import { selectStudents } from "../features/students/studentsSlice";

// Route: /dashboard/courses/:courseName (nested inside /dashboard)
// One <Route> handles every course; the course comes from the URL.
const CourseStudents = () => {
  const studentList = useSelector(selectStudents);
  const { courseName } = useParams();

  const students = studentList.filter(
    (student) => student.course === courseName,
  );

  return (
    <section>
      <h3>
        {courseName} students ({students.length})
      </h3>
      {students.length === 0 ? (
        <p>No students in {courseName}</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              <Link to={`/students/${student.id}`}>{student.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CourseStudents;
