// Custom middleware: runs for EVERY dispatched action, between dispatch()
// and the reducers.
//
//   store => next => action => { ... }
//     store  -> { getState, dispatch }
//     next   -> passes the action on to the next middleware / the reducers
//     action -> the action that was dispatched
export const logger = (store) => (next) => (action) => {
  console.groupCollapsed(`action: ${action.type}`);
  console.log("prev state", store.getState());
  console.log("action", action);

  const result = next(action); // let the reducers update the state

  console.log("next state", store.getState());
  console.groupEnd();
  return result;
};
