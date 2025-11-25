import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/Login");
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
