import Header from "./components/Header";
// import Footer from "./components/Footer";
import StudentList from "./components/StudentList";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import StudentFormUseReducer from "./components/StudentFormUseReducer";
import {
  addStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "./services/studentServicesByAxios";

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
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  // useState()-> hook
  // const [studentList, setStudentList] = useState(initialStudents);
  const [studentList, setStudentList] = useState([]);

  //no dependency array
  useEffect(() => {
    console.log("app rendered on every event");
  }); // triggers for every browser events

  const delay = (ms) =>{
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  //empty dependency array
  useEffect(() => {
    console.log("app rendered on mount");

    async function loadStudents() {
      try {
        console.log(loading);
        setLoading(true);

        await delay(5000)
        const data = await getStudents();
        setStudentList(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
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
            setLoading(true);
            const data = await getStudents();
            setStudentList(data);
          } catch (error) {
            console.log(error.message);
          } finally {
            setLoading(false);
          }
        }

        loadStudents();
      }
    }
    console.log(studentList);
    setName(`${name} - ${studentList.length}`);
  };

  const handleEditSubmit = async (student) => {
    if (student.name) {
      const added = await updateStudent(student);
      if (added.id) {
        async function loadStudents() {
          try {
            setLoading(true);
            const data = await getStudents();
            setStudentList(data);
          } catch (error) {
            console.log(error.message);
          } finally {
            setLoading(false);
          }
        }

        loadStudents();
      }
    }
    console.log(studentList);
    setName(`${name} - ${studentList.length}`);
  };

  const handleDeleteStudent = useCallback(async (id) => {
    if (id) {
      const added = await deleteStudent(id);
      if (added.id) {
        async function loadStudents() {
          try {
            setLoading(true);
            const data = await getStudents();
            setStudentList(data);
          } catch (error) {
            console.log(error.message);
          } finally {
            setLoading(false);
          }
        }

        loadStudents();
      }
    }
    console.log(studentList);
    setName(`${name} - ${studentList.length}`);
  }, []);

  const handleEditStudent = useCallback(
    (id) => {
      const selectedStudent = studentList.find((student) => student.id === id);

      setEditData(selectedStudent);
    },
    [studentList],
  );

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
        {loading && <h3>Loading...</h3>}
        <StudentFormUseReducer
          onAddSubmit={handleAddSubmit}
          editData={editData}
          onEditStudent={handleEditSubmit}
        />
        <StudentList
          students={studentList}
          onDeleteStudent={handleDeleteStudent}
          onEditStudent={handleEditStudent}
        />
      </main>
    </div>
  );
};

export default App;
