import { createSlice, isRejected } from "@reduxjs/toolkit";
import {
  createStudent,
  editStudent,
  removeStudent,
} from "../students/studentsSlice";

// A second slice that LISTENS to the students' actions.
// One action can be handled by many slices: the students slice updates the
// list, this slice shows a message. The student components know nothing
// about notifications.
const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { message: null, type: "info" },
  reducers: {
    dismissNotification(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStudent.fulfilled, (state, action) => {
        state.message = `Added ${action.payload.name}`;
        state.type = "success";
      })
      .addCase(editStudent.fulfilled, (state, action) => {
        state.message = `Updated ${action.payload.name}`;
        state.type = "success";
      })
      .addCase(removeStudent.fulfilled, (state) => {
        state.message = "Student deleted";
        state.type = "success";
      })
      // matcher: any rejected thunk, from any slice
      .addMatcher(isRejected, (state, action) => {
        state.message = action.payload ?? action.error.message;
        state.type = "error";
      });
  },
});

export const { dismissNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
