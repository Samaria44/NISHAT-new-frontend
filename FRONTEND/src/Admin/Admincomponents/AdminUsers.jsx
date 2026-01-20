import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInterceptor";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/users");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
        alert("Failed to load users");
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="admin-users">
      <h2>Registered Users</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
          
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td>
                {u.roles && u.roles.length > 0 
                  ? u.roles.map(role => role.name || role).join(', ')
                  : 'No Role'
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
