import { Navigate, Outlet, useLocation } from "react-router";

// Protected route (layout route without a path):
//   - logged in      -> render the child route through <Outlet />
//   - not logged in  -> redirect to /login and remember where the user wanted
//                       to go (location) so Login can send them back.
const ProtectedRoute = ({ user }) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
