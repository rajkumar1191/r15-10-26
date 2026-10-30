import { useReducer } from "react";

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

const StudentFormUseReducer = ({ onAddSubmit }) => {
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

  const handleSubmit = (event) => {
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
      id: Date.now(),
      name: values.name,
      course: values.course,
    };

    onAddSubmit(obj);
    dispatch({ type: "RESET_FORM" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Student(via useReducer)</h2>
      <input
        type="text"
        placeholder="Student Name"
        name="name"
        value={values.name}
        onChange={handleChange}
      />
      {errors.name && <p>{errors.name}</p>}<br /><br />
      <input
        type="text"
        name="course"
        placeholder="Student Course"
        value={values.course}
        onChange={handleChange}
      />
      {errors.course && <p>{errors.course}</p>}<br /><br />
      <button className="button" type="submit">
        Add Student
      </button>
    </form>
  );
};

export default StudentFormUseReducer;
