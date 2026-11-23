// import axios from "axios";
 import api from "./api";

// const API_URL = "http://localhost:3000/students";

export async function getStudents() {
  const response = await api.get("/students");

  return response.data;
}

export async function getStudentById(id) {
  const response = await api.get(`/students/${id}`);

  return response.data;
}

export async function addStudent(student) {
  const response = await api.post("/students", student);

  return response.data;
}

export async function updateStudent(student) {
  const response = await api.put(`/students/${student.id}`, student);

  return response.data;
}

export async function deleteStudent(id) {
  const response = await api.delete(`/students/${id}`);

  return response.data;
}
