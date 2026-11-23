import { memo } from "react";
import { NavLink, useNavigate } from "react-router";

// Link    -> navigates without a full page reload
// NavLink -> a Link that knows whether it is "active" (matches the current URL)
const navClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

const Header = ({ title, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
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
      </nav>
    </header>
  );
};

export default memo(Header);
