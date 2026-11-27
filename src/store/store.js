import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "../features/students/studentsSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import { logger } from "./middleware/logger";

// configureStore:
//   - combines the slice reducers into one root reducer
//   - adds the default middleware (thunk + dev-only checks for mutations and
//     non-serializable values)
//   - turns on Redux DevTools (browser extension) automatically
export const store = configureStore({
  reducer: {
    students: studentsReducer, // state.students
    notifications: notificationsReducer, // state.notifications
  },
  // Keep the defaults and add our own logger (dev only)
  middleware: (getDefaultMiddleware) =>
    import.meta.env.DEV
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
});
