import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getStudentById } from "../services/studentServicesByAxios";

// Route: /students/:id
// ":id" is a route parameter. For the URL /students/3, useParams() returns
// { id: "3" }. Route params are always strings.
const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  // Re-fetch whenever the id in the URL changes
  useEffect(() => {
    let ignore = false;

    getStudentById(id)
      .then((data) => {
        if (!ignore) {
          setStudent(data);
          setError("");
        }
      })
      .catch(() => {
        if (!ignore) setError(`Student with id ${id} not found`);
      });

    return () => {
      ignore = true; // ignore a late response from a previous id
    };
  }, [id]);

  if (error) {
    return (
      <section>
        <p>{error}</p>
        <Link to="/students">Back to list</Link>
      </section>
    );
  }

  if (!student) return <p>Loading student...</p>;

  return (
    <section className="stat-card">
      <h2>{student.name}</h2>
      <p>Id: {student.id}</p>
      <p>
        Course:{" "}
        <Link to={`/dashboard/courses/${student.course}`}>{student.course}</Link>
      </p>

      {/* navigate(-1) works like the browser Back button */}
      <button onClick={() => navigate(-1)}>Back</button>
      <Link to={`/students/${student.id}/edit`}>
        <button className="button">Edit</button>
      </Link>
    </section>
  );
};

export default StudentDetails;
