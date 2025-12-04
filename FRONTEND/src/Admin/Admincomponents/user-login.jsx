import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInterceptor";
import "./user.css";

const UserLogin = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("accessToken");

      // If token missing → show message
      if (!token) {
        setUsers([]);
        setError("You are not logged in.");
        return;
      }

      try {
        setLoading(true);
        const res = await axiosInstance.get("/auth", {
          headers: { "x-access-token": token },
        });

        console.log("API Response:", res.data);

        // Handle backend response structure
        // If res.data is an array → use it
        // If res.data has users property → use that
        const userList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.users)
          ? res.data.users
          : [];

        if (userList.length === 0) {
          setError("No users found.");
        } else {
          setError("");
        }

        setUsers(userList);
      } catch (err) {
        console.error("Fetch Users Error:", err);
        setError(err.response?.data?.message || "Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-login-page">
      <div className="user-login-header">
        <h2>Registered Users</h2>
      </div>

      {loading && <p className="no-users">Loading...</p>}
      {error && !loading && (
        <p className="no-users" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!loading && !error && users.length > 0 && (
        <table className="user-login-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td data-label="First Name">{user.firstName}</td>
                <td data-label="Last Name">{user.lastName}</td>
                <td data-label="Email">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserLogin;
