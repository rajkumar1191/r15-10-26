import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

// Protected route (layout route without a path):
//   - logged in      -> render the child route through <Outlet />
//   - not logged in  -> redirect to /login and remember where the user wanted
//                       to go (location) so Login can send them back.
const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
