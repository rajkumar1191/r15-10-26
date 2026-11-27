import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { selectStudentsStatus } from "../features/students/studentsSlice";
import { dismissNotification } from "../features/notifications/notificationsSlice";
import { useTheme } from "../context/ThemeContext";

// Layout route: renders the parts shared by every page (Header, Footer) and
// an <Outlet /> where the matched child route is displayed.
// Before Context, Layout received user/onLogout only to pass them to Header
// ("prop drilling"). Now Header reads them from AuthContext itself.
const Layout = ({ title }) => {
  // useSelector: read from the Redux store (re-renders when the value changes)
  const status = useSelector(selectStudentsStatus);
  const notification = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <Header title={title} />
      <main>
        {status === "loading" && <h3>Loading...</h3>}
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
            <button onClick={() => dispatch(dismissNotification())}>x</button>
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
