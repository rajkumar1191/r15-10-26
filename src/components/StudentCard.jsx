import { Link, useNavigate } from "react-router";
import "./StudentCard.css";

const StudentCard = ({ name, course, id, onDeleteStudent }) => {
  const navigate = useNavigate();

  return (
    <div className="student-card">
      <div>
        {/* Link with a route parameter -> /students/<id> */}
        <h3>
          <Link to={`/students/${id}`}>{name}</Link>
        </h3>
        <p style={{ color: course == "React" ? "aqua" : "blue" }}>
          Course: {course}
        </p>
      </div>
      <button
        className={course == "React" ? "del-button" : "button"}
        onClick={() => onDeleteStudent(id)}
      >
        Delete
      </button>

      {/* useNavigate -> navigate from code (here, from a click handler) */}
      <button
        className={course == "React" ? "del-button" : "button"}
        onClick={() => navigate(`/students/${id}/edit`)}
      >
        Edit
      </button>
    </div>
  );
};

export default StudentCard;
