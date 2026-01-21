import { Outlet } from "react-router-dom";
import Slidebar from "../Admincomponents/AdminSlidebar";

import Admin from "../Adminpages/Dashboard";
import "../Adminpages/Dashboard";

export default function AdminLayout() {
  
  
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
