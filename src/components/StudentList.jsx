import React, { useMemo, useRef, useState } from "react";
import StudentCard from "./StudentCard";
import styles from "./StudentList.module.css";

const StudentList = ({ students, onDeleteStudent }) => {
  // const [studentList, setStudentList] = useState(students);
  console.log("student list component")
  const [search, setSearchKey] = useState("");
  const searchRef = useRef(null);

  const handleFocus = () => {
    searchRef.current.focus();
  };

  const handleClear = () => {
    searchRef.current.value = "";
    searchRef.current.focus();
  };

  const filteredStudents = useMemo(() => {
    console.log("filtering students ...");
    return students.filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [students, search]);

  console.log(filteredStudents);

  return (
    <section>
      <h2>Student List</h2>

      <input
        ref={searchRef}
        type="text"
        placeholder="search student"
        onChange={(e) => setSearchKey(e.target.value)}
      />

      <button onClick={handleFocus}>Focus Search</button>
      <button onClick={handleClear}>Clear Focus</button>

      <div className={styles.container}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              name={student.name}
              course={student.course}
              id={student.id}
              onDeleteStudent={onDeleteStudent}
            />
          ))
        ) : (
          <p>No students found</p>
        )}
      </div>
      {/* <button className={styles.button}>Delete</button> */}
    </section>
  );
};

export default React.memo(StudentList);
