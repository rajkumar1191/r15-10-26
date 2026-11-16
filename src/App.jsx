import Header from "./components/Header";
// import Footer from "./components/Footer";
import StudentList from "./components/StudentList";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import StudentFormUseReducer from "./components/StudentFormUseReducer";
import { addStudent, getStudents } from "./services/studentServices";

// const initialStudents = [
//   {
//     id: 1,
//     name: "Raj",
//     course: "React",
//   },
//   {
//     id: 2,
//     name: "Kumar",
//     course: "Angular",
//   },
// ];

const App = () => {
  let [name, setName] = useState("Student Management");
  const [count, setCount] = useState(0);
  // useState()-> hook
  // const [studentList, setStudentList] = useState(initialStudents);
  const [studentList, setStudentList] = useState([]);

  //no dependency array
  useEffect(() => {
    console.log("app rendered on every event");
  }); // triggers for every browser events

  //empty dependency array
  useEffect(() => {
    console.log("app rendered on mount");

    async function loadStudents() {
      try {
        const data = await getStudents();
        setStudentList(data);
      } catch (error) {
        console.log(error.message);
      }
    }

    loadStudents();
  }, []); // triggers only at the component mount

  //dependency array
  useEffect(() => {
    console.log("app rendered on name variable update");
  }, [name]); // triggers only on the dependency get updates

  const studentStats = useMemo(() => {
    console.log("calculating student statistics...");

    const total = studentList.length;

    const reactStudents = studentList.filter(
      (student) => student.course === "React",
    ).length;
    const angularStudents = studentList.filter(
      (student) => student.course === "Angular",
    ).length;

    return {
      total,
      reactStudents,
      angularStudents,
    };
  }, [studentList]);

  const handleAddSubmit = async (student) => {
    if (student.name) {
      const added = await addStudent(student);
      if (added.id) {
        async function loadStudents() {
          try {
            const data = await getStudents();
            setStudentList(data);
          } catch (error) {
            console.log(error.message);
          }
        }

        loadStudents();
      }
    }
    console.log(studentList);
    setName(`${name} - ${studentList.length}`);
  };

  const handleDeleteStudent = useCallback((id) => {
    setStudentList((previousState) =>
      previousState.filter((student) => student.id != id),
    );
  }, []);

  return (
    <div style={{ color: "orange", fontSize: "14px" }}>
      <Header title={name} />

      <button onClick={() => setCount(count + 1)}>Increment : {count}</button>
      <main>
        <section className="dashboard">
          <div className="stat-card">
            <h3>Total Students</h3>
            <h1>{studentStats.total}</h1>
          </div>
          <div className="stat-card">
            <h3>React Students</h3>
            <h1>{studentStats.reactStudents}</h1>
          </div>
          <div className="stat-card">
            <h3>Angular Students</h3>
            <h1>{studentStats.angularStudents}</h1>
          </div>
        </section>

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
