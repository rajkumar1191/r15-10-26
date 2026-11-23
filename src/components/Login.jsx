import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";

const Login = ({ user, onLogin }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ProtectedRoute put the page the user originally asked for in state.from
  const from = location.state?.from?.pathname || "/dashboard";

  // Already logged in? No need to show the form.
  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username.trim()) return;

    onLogin(username.trim());
    // replace: true -> pressing Back won't return to the login page
    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <p>You must log in to view {from}</p>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button className="button" type="submit">
        Login
      </button>
    </form>
  );
};

export default Login;
