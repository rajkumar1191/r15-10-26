import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useStudents } from "../context/StudentContext";

// Sharing data across components: Home is not related to StudentList or
// Header, yet it reads the same user and student list from context.
const Home = () => {
  const { user } = useAuth();
  const { students } = useStudents();

  return (
    <section>
      <h2>Welcome{user ? `, ${user}` : ""}!</h2>
      <p>There are {students.length} students enrolled.</p>
      <Link to="/students">View students</Link>
    </section>
  );
};

export default Home;
