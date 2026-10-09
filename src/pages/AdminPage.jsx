import { Outlet } from "react-router-dom";
import AdminNav from "../components/AdminNav";

function AdminPage({ isMenuOpen, setIsMenuOpen }) {
  return (
    <main>
      <AdminNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <Outlet />
    </main>
  );
}

export default AdminPage;
