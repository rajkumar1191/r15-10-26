import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { selectStudents } from "../features/students/studentsSlice";

// Reads from both: the user from AuthContext (Context API) and the student
// list from the Redux store.
const Home = () => {
  const { user } = useAuth();
  const students = useSelector(selectStudents);

  return (
    <section>
      <h2>Welcome{user ? `, ${user}` : ""}!</h2>
      <p>There are {students.length} students enrolled.</p>
      <Link to="/students">View students</Link>
    </section>
  );
};

export default Home;
