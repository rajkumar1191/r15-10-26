import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import ThemeProvider from "./context/ThemeProvider.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Redux: makes the store available to useSelector / useDispatch */}
    <Provider store={store}>
      <BrowserRouter>
        {/* Context providers for theme and auth */}
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
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

  useRef -> access DOM elements and maintain values without triggering renders
    - creates mutable reference objects
    // const variableName = useRef(initialValue)

  useMemo -> useMemo is mainly used to memorize the result of a calculation. 
    -> it remembers a calculated value and recalculate it only when its dependencies change

    const memorizedValue = useMemo(()=>{
      return calculateFn();
    },[dependencies])

  useCallback  -> memorized function references
    const memorizedFn = useCallback(()=>{
      //function logic  
    },[dependencies])

  fetch -> fetch is a buildin Javascript
    fetch(url, options).then(response => response.json()).then(data =>{
        //logic to handle data
      }).catch(error =>{
        //logic to handle error
        })


  axios -> 
    1. automatically convert response to json
    2. reject 2xx

===============================================================================
Module 9: React Router  (package: "react-router", v7+/v8 - import everything
from "react-router"; "react-router-dom" is no longer needed)
===============================================================================

17. React Router setup
----------------------
React Router maps URLs to components so a single-page app can have several
"pages" without the browser reloading.

  npm install react-router

  <BrowserRouter>        // uses the browser History API (clean URLs)
    <App />
  </BrowserRouter>

  - BrowserRouter must wrap every component that uses routing hooks or Link.

18. Route configuration
-----------------------
  <Routes>                                     // picks the best match
    <Route path="/" element={<Home />} />
    <Route path="/students" element={<StudentList />} />
    <Route path="*" element={<NotFound />} />  // catch-all (404)
  </Routes>

  - path: the URL pattern. element: the JSX to render when it matches.
  - index route: <Route index element={...} /> is the default child shown at
    the parent's exact path (e.g. "/students").
  - Route without path but with element = "layout route" (e.g. Layout,
    ProtectedRoute): it wraps children without adding a URL segment.
  - Route with path but without element: only groups child paths
    (path="students" groups ":id", "add", ":id/edit").
  - Ranking: static segments beat dynamic ones, so "/students/add" matches the
    "add" route, not ":id".

19. Route parameters
--------------------
A segment that starts with ":" is a parameter:

  <Route path="/students/:id" element={<StudentDetails />} />

  const { id } = useParams();   // /students/3  ->  { id: "3" }

  - Params are always strings.
  - When only the param changes (/students/1 -> /students/2) the component
    is NOT remounted; it re-renders, so use the param in useEffect
    dependencies: useEffect(() => { load(id) }, [id]).
  - Query strings (?search=raj) are read with useSearchParams(), not params.

20. Dynamic routing
-------------------
Routes and links are driven by data instead of being hard-coded:

  - One route "courses/:courseName" serves every course.
  - Dashboard builds its menu from the data:
      courses.map(c => <NavLink to={`courses/${c}`}>{c}</NavLink>)
    A new course added in db.json gets its own page with no code change.
  - Links are built from values: <Link to={`/students/${id}`} />.

21. Nested routes
-----------------
Child routes render inside their parent through <Outlet />:

  <Route path="dashboard" element={<Dashboard />}>
    <Route index element={<DashboardOverview />} />          // /dashboard
    <Route path="courses/:courseName" element={<CourseStudents />} />
  </Route>

  - Child paths are relative (no leading "/").
  - Parent UI (title, menu) stays on screen; only the Outlet part changes.
  - Layout uses the same idea for Header/Footer around every page.
  - Relative links inside a nested component: to="." (current route),
    to="courses/React", to=".." (parent).

22. Navigation
--------------
  Declarative:
    <Link to="/students">Students</Link>    // no full page reload (not <a>)
    <NavLink to="/students" end className={({ isActive }) => ...}>
      - NavLink knows if it is active; "end" = active only on exact match.
    <Navigate to="/login" replace />        // redirect while rendering

  Programmatic:
    const navigate = useNavigate();
    navigate("/students");                  // go to a path
    navigate(`/students/${id}/edit`);       // with a param
    navigate(-1);                           // back (like browser Back)
    navigate("/", { replace: true });       // replace history entry
    navigate("/login", { state: { from } }) // pass data -> useLocation().state

  useLocation() returns { pathname, search, state, ... } for the current URL.

23. Protected routes
--------------------
A layout route that checks auth before rendering its children:

  const ProtectedRoute = ({ user }) => {
    const location = useLocation();
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
    return <Outlet />;
  };

  <Route element={<ProtectedRoute user={user} />}>
    <Route path="dashboard" element={<Dashboard />} />
  </Route>

  The logged-in user is plain state in App (saved in localStorage so it
  survives a refresh) and is passed down as props to Header, Login and
  ProtectedRoute.

  Flow: open /dashboard while logged out -> redirected to /login with the
  original location in state -> after login, navigate(from, { replace: true })
  returns the user to /dashboard. replace keeps /login out of the history.

  Note: client-side protection only hides UI. The real security check must
  happen on the server/API.

  Module 10 update: user now comes from AuthContext (useAuth()) instead of
  props - see section 27.

===============================================================================
Module 10: Context API
===============================================================================

24. Introduction to Context API
-------------------------------
Problem - "prop drilling": data needed deep in the tree must be passed through
every component in between, even ones that never use it.

  Before (Module 9):
    App (user) -> Layout (user, only to pass on) -> Header (uses user)
    App (studentList) -> Dashboard / DashboardOverview / CourseStudents ...

Context lets a parent PROVIDE a value once, and any component below it READ
the value directly, no matter how deep.

Use context for data many components need: logged-in user, theme, language,
shared app data. Do NOT put everything in context: state used by one
component (form inputs, search text) should stay local with useState.

Three steps:  createContext  ->  Provider  ->  useContext

25. Creating Context
--------------------
  // context/ThemeContext.js
  import { createContext } from "react";
  export const ThemeContext = createContext(defaultValue);

  - defaultValue is used ONLY when a component has no matching Provider
    above it. ThemeContext uses { theme: "light", toggleTheme: () => {} }.
  - AuthContext / StudentContext use null and a custom hook that throws a
    clear error if the Provider is missing.
  - Keep the context object in its own file (.js) and the Provider component
    in another (.jsx), so files export either components or non-components
    (needed for Vite fast refresh).

26. Provider and Consumer
------------------------
Provider - supplies the value to everything inside it:

  <ThemeContext.Provider value={{ theme, toggleTheme }}>
    {children}
  </ThemeContext.Provider>

  React 19 shorter syntax (same thing):
  <AuthContext value={{ user, login, logout }}>{children}</AuthContext>

  - A Provider is usually wrapped in its own component (ThemeProvider,
    AuthProvider, StudentProvider) that owns the state with useState.
  - When value changes, every component that reads the context re-renders.
  - Providers can be nested; main.jsx wraps App with all three.
  - The nearest Provider above a component wins.

Consumer - the older (pre-hooks) way to read a context. Its child is a
function that receives the value (see Footer.jsx):

  <ThemeContext.Consumer>
    {({ theme }) => <footer>Theme: {theme}</footer>}
  </ThemeContext.Consumer>

27. useContext Hook
-------------------
The modern way to read a context in a function component:

  const { theme, toggleTheme } = useContext(ThemeContext);

  - Returns the value of the nearest Provider above the component.
  - Follows the normal hook rules (top level of a component / custom hook).
  - Custom hook pattern used in this project:

      export const useAuth = () => {
        const context = useContext(AuthContext);
        if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
        return context;
      };

      const { user, logout } = useAuth();   // in Header, Login, ProtectedRoute

  - React 19 also has use(ThemeContext), which can be called inside if
    statements; useContext is still the common choice.

28. Global State Management
---------------------------
Context + useState (or useReducer) = simple global state.
StudentProvider owns:

  state:    students, loading
  actions:  loadStudents(), removeStudent(id)

  const value = useMemo(
    () => ({ students, loading, loadStudents, removeStudent }),
    [students, loading, loadStudents, removeStudent],
  );
  return <StudentContext value={value}>{children}</StudentContext>;

  - Components never call setStudents directly; they call the actions.
    All the logic for changing the data is in one place.
  - useMemo / useCallback keep the value reference stable, so consumers
    re-render only when something in it really changes.
  - Split contexts by concern (Theme, Auth, Students): a theme change does
    not re-render components that only read students.
  - For large apps with complex updates, libraries such as Redux Toolkit or
    Zustand are common; Context is enough for this app.

29. Sharing Data Across Components
----------------------------------
Unrelated components now read the same data with no props:

  Home            -> useAuth().user, useStudents().students
  Header          -> useAuth() (user, logout), useTheme() (toggle button)
  Layout          -> useStudents().loading, useTheme().theme (CSS class)
  StudentList     -> useStudents() (students, removeStudent)
  Dashboard, DashboardOverview, CourseStudents -> useStudents().students
  StudentForm     -> useStudents().loadStudents after saving
  Login / ProtectedRoute -> useAuth()
  Footer          -> ThemeContext.Consumer

Deleting a student in StudentList updates the global list, so the Home
count and Dashboard stats update too.

Props are still right for parent -> direct child data
(e.g. StudentList -> StudentCard name/course/onDeleteStudent).

  Module 11 update: the student list moved from StudentProvider (Context) to
  Redux Toolkit. Theme and Auth stay in Context - see section 38.

===============================================================================
Module 11: Redux Toolkit
  npm install @reduxjs/toolkit react-redux
===============================================================================

30. Introduction to Redux
-------------------------
Redux keeps the app's global state in ONE place, the store, and allows it to
change only in one predictable way:

    UI --dispatch(action)--> middleware --> reducers --> new state --> UI

  - Store: one object tree holding the global state.
      { students: { items, status, error, courseFilter },
        notifications: { message, type } }
  - Action: a plain object describing WHAT happened.
      { type: "students/setCourseFilter", payload: "React" }
  - Reducer: a pure function (state, action) => newState. No API calls, no
    random values, no mutation of the old state (the new state is a copy).
  - dispatch(action): the only way to change the state.
  - Selector: a function that reads a piece of state: state => state.x

Why: every change goes through actions, so state changes are easy to follow
and debug (Redux DevTools shows each action and the state before/after).

Context vs Redux: Context only PASSES a value down; you still
write the state logic yourself (useState in a Provider). Redux is a full
state-management library: store, actions, reducers, middleware, DevTools,
and components re-render only for the part of the state they select.

31. Redux Toolkit (RTK)
-----------------------
The official, recommended way to write Redux. Plain Redux needed a lot of
hand-written code (action type constants, action creators, switch
reducers, spread copies, thunk setup). RTK provides:

  configureStore    store with good defaults (thunk, DevTools, dev checks)
  createSlice       state + reducers + action creators in one place
  createAsyncThunk  async logic (API calls) with pending/fulfilled/rejected
  createSelector    memoized selectors
  Immer (built in)  write "mutating" code that produces immutable updates

react-redux connects Redux to React:
  <Provider store={store}>  make the store available (main.jsx)
  useSelector(selector)     read state; re-render when that value changes
  useDispatch()             get dispatch to send actions

32. Store Configuration
-----------------------
  // store/store.js
  export const store = configureStore({
    reducer: {
      students: studentsReducer,           // -> state.students
      notifications: notificationsReducer, // -> state.notifications
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(logger),
  });

  // main.jsx
  <Provider store={store}>
    <App />
  </Provider>

  - The reducer object keys become the top-level keys of the state.
  - configureStore combines the reducers (combineReducers) for you.

33. Slices
----------
A slice = one feature's state + the reducers that update it
(features/students/studentsSlice.js).

  const studentsSlice = createSlice({
    name: "students",                       // prefix of the action types
    initialState: { items: [], status: "idle", error: null, courseFilter: "All" },
    reducers: { setCourseFilter(state, action) { ... } },
    extraReducers: (builder) => { ... },    // actions from outside the slice
  });

  export const { setCourseFilter } = studentsSlice.actions;  // action creators
  export default studentsSlice.reducer;                      // for the store

Organise by feature: features/students, features/notifications, each
with its slice, thunks and selectors together.

34. Actions
-----------
createSlice generates an action creator for every reducer:

  setCourseFilter("React")
  // -> { type: "students/setCourseFilter", payload: "React" }

  dispatch(setCourseFilter("React"));   // StudentList dropdown
  dispatch(dismissNotification());      // Layout "x" button

  - type = "<slice name>/<reducer name>"
  - payload = the argument passed to the action creator
  - Thunks also produce actions: students/remove/pending, .../fulfilled,
    .../rejected

35. Reducers
------------
  reducers: {
    setCourseFilter(state, action) {
      state.courseFilter = action.payload;   // looks like mutation...
    },
  }

  - Immer: you "mutate" a draft; RTK turns it into a new immutable state.
    Either mutate the draft OR return a new value - never both.
  - Reducers must stay pure: no API calls, no Date.now(), no navigate().
  - extraReducers handle actions created elsewhere:
      builder.addCase(fetchStudents.fulfilled, (state, action) => {
        state.items = action.payload;
      })
  - One action can be handled by MANY slices: removeStudent.fulfilled
    updates students.items AND sets notifications.message.
  - addMatcher(isRejected, ...) handles every rejected thunk in one place.

36. Async Thunks
----------------
Reducers cannot be async, so API calls go in thunks:

  export const fetchStudents = createAsyncThunk(
    "students/fetchAll",
    async () => getStudents(),          // returned value -> action.payload
  );

  Dispatching it sends:
    students/fetchAll/pending    -> status = "loading"
    students/fetchAll/fulfilled  -> status = "succeeded", items = payload
    students/fetchAll/rejected   -> status = "failed", error = message

  Thunks in this app: fetchStudents (App start), createStudent and
  editStudent (form), removeStudent (Delete button).

  - Second argument thunkAPI: { dispatch, getState, rejectWithValue, ... }
  - rejectWithValue(msg): send your own error payload (removeStudent).
  - condition option: skip the thunk, e.g. if already loading.
  - In a component: await dispatch(createStudent(obj)).unwrap()
    unwrap() returns the payload, or throws if the thunk was rejected, so
    the form can navigate only after a successful save.
  - Track request status in state ("idle" | "loading" | "succeeded" | "failed")
    instead of a separate loading boolean.

37. Middleware
--------------
Middleware sits between dispatch and the reducers. Every action passes
through it, so it can log, change, delay or stop actions, or start side
effects.

  const logger = (store) => (next) => (action) => {
    console.log("dispatching", action);
    const result = next(action);           // pass on to the reducers
    console.log("next state", store.getState());
    return result;
  };

  - Default middleware from configureStore:
      redux-thunk     lets dispatch accept functions (createAsyncThunk)
      immutability    dev-only: warns if state is mutated outside reducers
      serializability dev-only: warns about non-serializable values
                      (Promises, class instances, functions) in state/actions
  - Add your own with getDefaultMiddleware().concat(logger).
    Do not replace the defaults unless you mean to remove them.
  - Open the browser console and click Delete: you will see
    students/remove/pending, students/remove/fulfilled, each with the
    state before and after.

38. State Architecture
----------------------
Choose where each piece of state lives:

  Local state (useState / useReducer) - used by one component
    StudentList search text, StudentForm fields + errors (useReducer)

  URL (React Router) - should survive refresh / be shareable
    /students/:id, /dashboard/courses/:courseName

  Context - simple values that change rarely and are needed everywhere
    ThemeContext (theme), AuthContext (user)

  Redux store - shared app data, changed in many places, async loading
    students (items, status, error, courseFilter), notifications

Store layout guidelines:
  - One slice per feature; keep related state, thunks and selectors together.
  - Keep state minimal; DERIVE everything else with selectors
    (selectFilteredStudents, selectCourses, selectStudentStats) instead of
    storing copies that can go out of sync.
  - Memoize derived data with createSelector.
  - Store only serializable data (no functions, Promises, DOM nodes).
  - Components dispatch "what happened"; reducers decide how the state
    changes.
  - Large lists: createEntityAdapter normalises them into { ids, entities }.
  - Lots of server data: RTK Query (part of RTK) can handle fetching and
    caching for you.

  parent -> child -> child -> child -> child -> child -> child -> child -> props drilling

  context api

*/
