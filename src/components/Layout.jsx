import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { useStudents } from "../context/StudentContext";
import { useTheme } from "../context/ThemeContext";

// Layout route: renders the parts shared by every page (Header, Footer) and
// an <Outlet /> where the matched child route is displayed.
// Before Context, Layout received user/onLogout only to pass them to Header
// ("prop drilling"). Now Header reads them from AuthContext itself.
const Layout = ({ title }) => {
  const { loading } = useStudents();
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <Header title={title} />
      <main>
        {loading && <h3>Loading...</h3>}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
