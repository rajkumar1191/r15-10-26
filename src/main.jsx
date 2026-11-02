import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/*
===============================================================================
React notes
===============================================================================

1. What is React?
-----------------
React is an open-source JavaScript library for building dynamic and interactive
user interfaces. An application is divided into small, reusable components.
Each component receives input, renders UI, and can manage its own state.

Important React ideas:

  - Declarative UI: describe what the UI should look like for the current data.
    React updates the DOM when the data changes.
  - Components: split a large UI into independent, reusable pieces.
  - Virtual DOM and reconciliation: React compares the new element tree with
    the previous tree and applies the required DOM changes.
  - One-way data flow: data normally moves from a parent to a child through
    props. A child communicates with a parent by calling a callback prop.
  - Re-rendering: a component re-renders when its state changes, when its
    parent re-renders, or when a value used by the component changes.

2. Application entry point
--------------------------
createRoot(document.getElementById("root")).render(<App />);

  - createRoot connects React to the DOM element with id "root".
  - render mounts the React component tree.
  - StrictMode enables additional development checks. It may invoke certain
    rendering/effect logic more than once in development; this does not happen
    as an extra production behavior.
  - Imports ending in .jsx can contain both JavaScript and JSX.

3. JSX
------
JSX is a syntax extension for JavaScript that makes it possible to write
HTML-like markup inside JavaScript:

  const heading = <h1>Hello React</h1>;

JSX rules:

  - Return one parent element, or use a Fragment: <>...</>.
  - Use className instead of class.
  - Use camelCase event names such as onClick and onChange.
  - JavaScript expressions go inside curly braces: <h1>{title}</h1>.
  - Component names start with an uppercase letter; HTML elements are lowercase.
  - JSX attributes can receive expressions, for example:
      <div style={{ color: "orange", fontSize: "14px" }} />
  - JSX is transformed into JavaScript calls that create React elements. It is
    not a string of HTML.

4. Components
-------------
A function component is a JavaScript function that returns JSX:

  const Header = ({ title }) => {
    return <h1>{title}</h1>;
  };

Components should be focused and reusable. In this application:

  - App coordinates the student-management state and page layout.
  - Header displays the page title.
  - StudentFormUseReducer manages the form and validation.
  - StudentList renders the collection of students.
  - StudentCard renders one student.
  - Footer is an additional reusable component that can be rendered when needed.

Component names must be uppercase so React can distinguish components from
native HTML elements.

5. Props
--------
Props are read-only values passed from a parent to a child:

  <Header title={name} />
  <StudentList
    students={studentList}
    onDeleteStudent={handleDeleteStudent}
  />

The child reads them through its function parameter:

  const Header = ({ title }) => <h1>{title}</h1>;

Props can contain strings, numbers, objects, arrays, or functions. A child
must not mutate props directly. Passing a function as a prop is called a
callback prop; it lets the child notify the parent about an event while the
parent remains responsible for changing shared state.

6. State and useState
---------------------
State is data that can change during the lifetime of a component. useState
returns the current value and a setter:

  const [name, setName] = useState("Student Management");

  - name is the current state value.
  - setName schedules the next state value.
  - The initial value is used during the first render.
  - Calling the setter causes a re-render.
  - State updates are scheduled; reading the variable immediately after the
    setter can still show the previous render's value.

For values derived from the previous state, use the functional updater:

  setStudentList((previousState) => [...previousState, student]);

This is safer when multiple updates may be queued. State should be treated as
immutable: create a new array/object rather than changing the existing value.

Examples from this application:

  - studentList stores the current students.
  - name stores the title shown by Header.
  - A form can use separate state values for name and course when useState is
    sufficient.

7. useEffect
------------
useEffect synchronizes a component with an external system after rendering.
Typical uses include:

  - Fetching data from an API.
  - Updating the browser document title.
  - Adding and removing event listeners.
  - Starting and clearing timers or intervals.
  - Subscribing and unsubscribing from external services.
  - Reading from or writing to browser storage.

General form:

  useEffect(() => {
    // Synchronization or side-effect logic

    return () => {
      // Cleanup logic
    };
  }, [dependencies]);

Dependency behavior:

  - No dependency array: runs after every completed render.
  - []: runs after the initial mount (and can be checked more than once by
    StrictMode during development).
  - [name]: runs after mount and whenever name changes.

Effects are not event handlers. An effect without dependencies runs after
renders, not after every browser event. Use an event handler such as onClick or
onChange when logic should run specifically because of a user action.

Cleanup is important for subscriptions, timers, and listeners so that old
resources do not remain active after a component unmounts or dependencies
change.

8. Event handling
-----------------
React event handlers receive a synthetic event:

  <input onChange={handleChange} />
  <form onSubmit={handleSubmit}>

The function is passed to the event prop; it is not called while rendering:

  onClick={handleClick}       // correct
  onClick={handleClick()}     // calls immediately; usually incorrect

For forms:

  - event.preventDefault() prevents the browser's default page reload.
  - event.target is the element that triggered the event.
  - event.target.value is the current input value.
  - event.target.name identifies which field changed.

9. Controlled form inputs
-------------------------
An input is controlled when React state is its source of truth:

  <input
    name="course"
    value={values.course}
    onChange={handleChange}
  />

The value displayed in the input comes from state, and onChange updates that
state. This makes validation, reset behavior, and form submission predictable.
After a successful submission, resetting state clears the input.

The basic StudentForm uses separate useState values. The reducer-based form
stores both fields in one values object and uses one shared change handler.

10. useReducer
--------------
useReducer is useful when state has several related fields or transitions:

  const [state, dispatch] = useReducer(reducer, initialState);

Concepts:

  - state: the current state object.
  - dispatch: sends an action describing what happened.
  - action: usually has a type and optional payload.
  - reducer: a pure function that calculates the next state.
  - initialState: the starting state.

Example action:

  dispatch({
    type: "UPDATE_FIELD",
    payload: { name, value },
  });

The reducer should not perform side effects. It receives the previous state and
action, then returns a new state:

  function reducer(state, action) {
    switch (action.type) {
      case "UPDATE_FIELD":
        return nextState;
      default:
        return state;
    }
  }

Transitions implemented in StudentFormUseReducer:

  - UPDATE_FIELD updates one field and clears that field's old error.
  - SET_ERRORS stores validation messages.
  - CLEAR_ERROR clears an error.
  - RESET_FORM returns the form to its initial state.

Keeping transitions in a reducer makes complex form behavior explicit and
keeps state updates consistent.

11. Validation
--------------
The form validates before creating a student:

  - trim() ignores input containing only whitespace.
  - An error is added when the student name is empty.
  - An error is added when the course is empty.
  - Object.keys(errors).length identifies whether any errors exist.

If errors exist, SET_ERRORS is dispatched and submission stops. If validation
passes, the object is sent to the parent through onAddSubmit and the form is
reset. Validation messages are conditionally rendered:

  {errors.name && <p>{errors.name}</p>}

12. Lists and keys
------------------
Arrays are rendered with map():

  students.map((student) => (
    <StudentCard key={student.id} ... />
  ))

The key gives each sibling a stable identity so React can efficiently track
insertions, removals, and reordering. Use a stable unique id from the data,
not the array index when list items can change. Keys are used by React and are
not automatically received as a component prop.

13. Conditional rendering
-------------------------
JavaScript expressions can decide whether JSX is rendered:

  {errors.name && <p>{errors.name}</p>}

The && operator renders the right-hand JSX only when the left-hand value is
truthy. The ternary operator is useful when there are two alternatives:

  {course === "React" ? "React course" : "Other course"}

This application uses conditional expressions to display validation messages
and to choose different card colors/classes based on the course.

14. Updating and deleting students
-----------------------------------
Adding a student creates a new object and appends it without mutating the
previous array:

  setStudentList((previousState) => [...previousState, student]);

Deleting uses filter(), which returns a new array containing every student
whose id does not match the selected id:

  setStudentList((previousState) =>
    previousState.filter((student) => student.id != id)
  );

The child card calls onDeleteStudent(id), while App owns the state update. This
is a common React pattern: state stays in the nearest common parent and
children receive data plus event callbacks.

15. Styling in React
--------------------
This project demonstrates several styling approaches:

  - Global stylesheet import: import "./App.css".
  - Regular component stylesheet import: import "./StudentCard.css".
  - CSS Modules: import styles from "./StudentList.module.css"; then use
    className={styles.container}. CSS Modules create locally scoped class names.
  - Inline styles: style={{ color: "orange", fontSize: "14px" }}.

Inline style values are JavaScript object properties, so CSS property names use
camelCase and numeric values are generally interpreted as pixels. Use class
names or CSS Modules for reusable and larger style definitions.

16. Common React rules to remember
-----------------------------------
  - Do not mutate state or props directly.
  - Do not call hooks inside loops, conditions, or nested functions. Call them
    at the top level of a component.
  - Hooks can be used only in React function components or custom hooks.
  - Keep keys stable and unique among siblings.
  - Keep render logic pure; put external synchronization in useEffect.
  - Use functional state updates when the next value depends on old state.
  - Pass callbacks when a child needs to request a parent-owned state change.
  - Use strict equality (===) for comparisons unless loose equality is
    deliberately required.
*/
