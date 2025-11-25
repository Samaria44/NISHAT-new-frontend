import React, { useEffect, useState } from "react";
import axios from "axios";

const UserLogin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("accessToken"); // Correct token
      if (!token) {
        alert("You are not logged in!");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/users", {
          headers: { "x-access-token": token },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        alert(
          err.response?.data?.message || "Unauthorized or token expired!"
        );
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Registered Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.firstName} {user.lastName} — {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserLogin;
