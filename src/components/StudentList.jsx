import StudentCard from "./StudentCard";
import styles from "./StudentList.module.css";

const StudentList = ({ students, onDeleteStudent }) => {
  return (
    <section>
      <h2>Student List</h2>
      <div className={styles.container}>
        {students.map((student) => (
          <StudentCard
            key={student.id}
            name={student.name}
            course={student.course}
            id={student.id}
            onDeleteStudent={onDeleteStudent}
          />
        ))}
      </div>
      <button className={styles.button}>Delete</button>
    </section>
  );
};

export default StudentList;
