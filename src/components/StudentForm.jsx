import { useState } from "react";

const StudentForm = ({ onAddSubmit }) => {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const obj = {
      id: Date.now(),
      name: name,
      course: course,
    };

    onAddSubmit(obj);
    setName("");
    setCourse("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Student</h2>
      <input type="text" placeholder="Student Name" value={name} onChange={(e)=>setName(e.target.value)} />
      <input type="text" placeholder="Student Course" value={course} onChange={(e)=>setCourse(e.target.value)}  />
      <button className="button" type="submit">Add Student</button>
    </form>
  );
};

export default StudentForm;
