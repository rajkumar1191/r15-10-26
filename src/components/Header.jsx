import { memo } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// Link    -> navigates without a full page reload
// NavLink -> a Link that knows whether it is "active" (matches the current URL)
const navClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

const Header = ({ title }) => {
  // useContext (via custom hooks): read shared values directly, no props
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // programmatic navigation
  };

  return (
    <header>
      <h1>{title}</h1>
      <p>Learn React Components</p>
      <nav>
        {/* end -> "/" is active only on exactly "/", not on every page */}
        <NavLink to="/" end className={navClass}>
          Home
        </NavLink>
        <NavLink to="/dashboard" className={navClass}>
          Dashboard
        </NavLink>
        {/* end -> not highlighted while on /students/add */}
        <NavLink to="/students" end className={navClass}>
          Students
        </NavLink>
        <NavLink to="/students/add" className={navClass}>
          Add Student
        </NavLink>

        {user ? (
          <>
            <span> Hi, {user} </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login" className={navClass}>
            Login
          </NavLink>
        )}

        <button onClick={toggleTheme}>
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </nav>
    </header>
  );
};

export default memo(Header);
