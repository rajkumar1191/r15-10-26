const API_URL = "http://localhost:3000/students";

export async function getStudents() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return await response.json();
}


export async function addStudent(student) {
  const response = await fetch(API_URL,{
    method: "POST",
    headers: {
        'Content-Type': "application/json"
    },
    body: JSON.stringify(student)
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return await response.json();
}
