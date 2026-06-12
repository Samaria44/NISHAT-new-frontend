import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function User() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-center mt-8">
      <button
        className="bg-white text-black px-4 py-2 rounded-md border hover:bg-gray-100"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
