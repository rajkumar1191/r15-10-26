import "./StudentCard.css";

const StudentCard = ({ name, course, id, onDeleteStudent }) => {
  return (
    <div className="student-card">
      <div>
        <h3>{name}</h3>
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
    </div>
  );
};

export default StudentCard;
