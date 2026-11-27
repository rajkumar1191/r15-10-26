import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import {
  addStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "../../services/studentServicesByAxios";

// ---------------------------------------------------------------------------
// Async thunks: functions for async work (API calls).
// Each one automatically dispatches 3 actions:
//   students/fetchAll/pending   -> request started
//   students/fetchAll/fulfilled -> success, action.payload = returned value
//   students/fetchAll/rejected  -> error,   action.error / action.payload
// ---------------------------------------------------------------------------
export const fetchStudents = createAsyncThunk(
  "students/fetchAll",
  async () => getStudents(),
  {
    // Skip if a request is already running (StrictMode runs effects twice)
    condition: (_, { getState }) => getState().students.status !== "loading",
  },
);

export const createStudent = createAsyncThunk("students/create", (student) =>
  addStudent(student),
);

export const editStudent = createAsyncThunk("students/update", (student) =>
  updateStudent(student),
);

export const removeStudent = createAsyncThunk(
  "students/remove",
  async (id, { rejectWithValue }) => {
    try {
      await deleteStudent(id);
      return id; // becomes action.payload in "fulfilled"
    } catch (error) {
      // custom error payload instead of the default serialized error
      return rejectWithValue(`Could not delete student ${id}: ${error.message}`);
    }
  },
);

// ---------------------------------------------------------------------------
// Slice: state + reducers + action creators for one feature
// ---------------------------------------------------------------------------
const initialState = {
  items: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
  courseFilter: "All",
};

const studentsSlice = createSlice({
  name: "students",
  initialState,

  // Sync reducers. createSlice generates an action creator for each one:
  //   setCourseFilter("React")
  //     -> { type: "students/setCourseFilter", payload: "React" }
  // Immer lets us write "mutating" code; it produces a new immutable state.
  reducers: {
    setCourseFilter(state, action) {
      state.courseFilter = action.payload;
    },
    clearStudentsError(state) {
      state.error = null;
    },
  },

  // extraReducers: respond to actions defined OUTSIDE this slice
  // (here: the pending / fulfilled / rejected actions of the thunks)
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editStudent.fulfilled, (state, action) => {
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(removeStudent.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      })
      .addCase(removeStudent.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setCourseFilter, clearStudentsError } = studentsSlice.actions;
export default studentsSlice.reducer;

// ---------------------------------------------------------------------------
// Selectors: read data from the state. Components use them with useSelector.
// createSelector memoizes: the result is recalculated only when its inputs
// change, so components don't re-render because of a new array/object.
// ---------------------------------------------------------------------------
export const selectStudents = (state) => state.students.items;
export const selectStudentsStatus = (state) => state.students.status;
export const selectStudentsError = (state) => state.students.error;
export const selectCourseFilter = (state) => state.students.courseFilter;

export const selectCourses = createSelector([selectStudents], (students) => [
  ...new Set(students.map((s) => s.course)),
]);

export const selectFilteredStudents = createSelector(
  [selectStudents, selectCourseFilter],
  (students, course) =>
    course === "All" ? students : students.filter((s) => s.course === course),
);

export const selectStudentStats = createSelector(
  [selectStudents],
  (students) => ({
    total: students.length,
    reactStudents: students.filter((s) => s.course === "React").length,
    angularStudents: students.filter((s) => s.course === "Angular").length,
  }),
);
