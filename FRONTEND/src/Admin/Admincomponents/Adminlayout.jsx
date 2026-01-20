import { Outlet, useNavigate } from "react-router-dom";
import Slidebar from "../Admincomponents/AdminSlidebar";

import Admin from "../Adminpages/Dashboard";
import "../Adminpages/Dashboard";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/dashboard/login");
  };

  return (
    <div className="admin-layout">
      <Admin />
      <div className="admin-main">
        <Slidebar />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
