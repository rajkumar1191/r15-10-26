import { useEffect, useReducer } from "react";
import {
  addStudent,
  getStudentById,
  updateStudent,
} from "../services/studentServicesByAxios";
import { useNavigate, useParams } from "react-router";

const initialFormState = {
  values: {
    name: "",
    course: "",
  },
  errors: {},
};

const studentFormReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        values: {
          ...state.values,
          [action.payload.name]: action.payload.value,
        },
        errors: {
          ...state.errors,
          [action.payload.name]: "",
        },
      };
    case "LOAD_FORM":
      return {
        ...state,
        values: {
          name: action.payload.name,
          course: action.payload.course,
        },
        errors: {},
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: "",
        },
      };
    case "RESET_FORM":
      return initialFormState;

    default:
      return state;
  }
};

// Used by two routes:
//   /students/add       -> no :id param   -> add mode
//   /students/:id/edit  -> :id param      -> edit mode (student loaded by id)
const StudentFormUseReducer = ({ onSaved }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  /*

    const [state, dispatch] = useReducer(reducer, initialState)

    state -> hold current state value
    dispatch -> function used to send actions
    reducer -> function which use to decide how state changes
    initialState -> initial state value

    function reducer(state, action){
        //decide how state changes
      return newState
    }

  */

  const [formState, dispatch] = useReducer(
    studentFormReducer,
    initialFormState,
  );

  // const [name, setName] = useState("");
  // const [course, setCourse] = useState("");

  const { values, errors } = formState;

  // Load the student whenever the :id in the URL changes
  useEffect(() => {
    if (!id) return;

    let ignore = false;
    getStudentById(id)
      .then((student) => {
        if (!ignore) dispatch({ type: "LOAD_FORM", payload: student });
      })
      .catch(() => {
        // unknown id -> back to the list
        if (!ignore) navigate("/students", { replace: true });
      });

    return () => {
      ignore = true;
    };
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    dispatch({
      type: "UPDATE_FIELD",
      payload: { name, value },
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!values.name.trim()) {
      newErrors.name = "Student name is required";
    }

    if (!values.course.trim()) {
      newErrors.course = "Student course is required";
    }

    return newErrors;
  };

  // const handleAddSubmit = async (student) => {
  // if (student.name) {
  //   const added = await addStudent(student);
  //   if (added.id) {
  //     async function loadStudents() {
  //       try {
  //         setLoading(true);
  //         const data = await getStudents();
  //         setStudentList(data);
  //       } catch (error) {
  //         console.log(error.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }

  //     loadStudents();
  //   }
  // }
  // console.log(studentList);
  // setName(`${name} - ${studentList.length}`);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validateErrors = validateForm();

    if (Object.keys(validateErrors).length > 0) {
      dispatch({
        type: "SET_ERRORS",
        payload: validateErrors,
      });

      return;
    }

    dispatch({
      type: "CLEAR_ERROR",
      payload: validateErrors,
    });

    const obj = {
      id: isEdit ? id : String(Date.now()),
      name: values.name,
      course: values.course,
    };

    const saved = isEdit ? await updateStudent(obj) : await addStudent(obj);

    if (saved) {
      dispatch({ type: "RESET_FORM" });
      await onSaved?.(); // let App reload the list
      navigate(`/students/${saved.id}`); // go to the details page
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEdit ? "Edit Student" : "Add Student"} (via useReducer)</h2>
      <input
        type="text"
        placeholder="Student Name"
        name="name"
        value={values.name}
        onChange={handleChange}
      />
      {errors.name && <p>{errors.name}</p>}
      <br />
      <br />
      <input
        type="text"
        name="course"
        placeholder="Student Course"
        value={values.course}
        onChange={handleChange}
      />
      {errors.course && <p>{errors.course}</p>}
      <br />
      <br />
      <button className="button" type="submit">
        {isEdit ? "Update Student" : "Add Student"}
      </button>
    </form>
  );
};

export default StudentFormUseReducer;
