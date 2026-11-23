import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

// Layout route: renders the parts shared by every page (Header, Footer) and
// an <Outlet /> where the matched child route is displayed.
const Layout = ({ title, loading, user, onLogout }) => {
  return (
    <>
      <Header title={title} user={user} onLogout={onLogout} />
      <main>
        {loading && <h3>Loading...</h3>}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
