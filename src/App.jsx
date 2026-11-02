import Header from "./components/Header";
// import Footer from "./components/Footer";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";
import { useEffect, useState } from "react";
import "./App.css";
import StudentFormUseReducer from "./components/StudentFormUseReducer";

const App = () => {
  let [name, setName] = useState("Student Management");

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

  useEffect(() => {
    console.log("app rendered on every event");
  }); // triggers for every browser events

  useEffect(() => {
    console.log("app rendered on mount");
  }, []); // triggers only at the component mount

  useEffect(() => {
    console.log("app rendered on name variable update");
  }, [name]); // triggers only on the dependency get updates

  const handleAddSubmit = (student) => {
    setStudentList((previousState) => [...previousState, student]);
    console.log(studentList);
    setName(`${name} - ${students.length}`);
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
        {/* <StudentForm onAddSubmit={handleAddSubmit} /> */}
        <StudentFormUseReducer onAddSubmit={handleAddSubmit} />
        <StudentList
          students={studentList}
          onDeleteStudent={handleDeleteStudent}
        />
      </main>
    </div>
  );
};

export default App;
