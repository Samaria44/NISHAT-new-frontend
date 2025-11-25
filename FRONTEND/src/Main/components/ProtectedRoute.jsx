import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");

  if (!token || token === "false") {
    return <Navigate to="/Login" replace />;
  }

  return children;
}
