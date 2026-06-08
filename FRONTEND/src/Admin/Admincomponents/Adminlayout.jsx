import { Outlet } from "react-router-dom";
import Slidebar from "./AdminSlidebar";
import "./Admin.css";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      <Slidebar />
      <main style={{
        marginLeft: "240px",
        flex: 1,
        padding: "88px 28px 40px",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}>
        <Outlet />
      </main>
    </div>
  );
}
