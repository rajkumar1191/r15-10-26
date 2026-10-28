import Header from "./components/Header";
// import Footer from "./components/Footer";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";
import { useState } from "react";
import "./App.css";

const App = () => {
  const name = "Student Management";

  // useState()-> hook

  const students = [
    {
      id: 1,
      name: "Raj",
      course: "React",
    },
    {
      id: 2,
      name: "Kumar",
      course: "Angular",
    },
  ];

  const [studentList, setStudentList] = useState(students);

  const handleAddSubmit = (student) => {
    setStudentList((previousState) => [...previousState, student]);
    console.log(studentList);
  };

  const handleDeleteStudent = (id) => {
    setStudentList((previousState) =>
      previousState.filter((student) => student.id != id),
    );
  };

  return (
    <div style={{ color: "orange", fontSize: "14px" }}>
      <Header title={name} />
      <main>
        <StudentForm onAddSubmit={handleAddSubmit} />
        <StudentList
          students={studentList}
          onDeleteStudent={handleDeleteStudent}
        />
      </main>
    </div>
  );
};

export default App;
