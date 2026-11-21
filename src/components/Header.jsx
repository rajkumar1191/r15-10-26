import { memo } from "react";
import { Link, NavLink } from "react-router";

const Header = ({ title }) => {
  console.log("header component");
  return (
    <header>
      <h1>{title}</h1>
      <p>Learn React Components</p>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/students">Students</Link>
        <Link to="/students/add">Add Students</Link>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/students/add" className={({isActive})=> isActive ? "active": ""}>Add Students</NavLink>
      </nav>
    </header>
  );
};

export default memo(Header);
