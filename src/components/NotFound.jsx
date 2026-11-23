import { Link, useLocation } from "react-router";

// Rendered by the catch-all route: <Route path="*" />
const NotFound = () => {
  const location = useLocation();

  return (
    <section>
      <h2>404 - Page not found</h2>
      <p>No route matches {location.pathname}</p>
      <Link to="/">Go Home</Link>
    </section>
  );
};

export default NotFound;
