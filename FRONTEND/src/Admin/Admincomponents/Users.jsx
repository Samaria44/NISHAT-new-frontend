import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInterceptor";
import { FiTrash2 } from "react-icons/fi";
import "./Admincontact.css";

export default function ContactAdmin() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      // axiosInstance has baseURL — use relative path only
      const res = await axiosInstance.get("/contact");
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching contact messages:", err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axiosInstance.delete(`/contact/${id}`);
      fetchMessages();
    } catch (err) {
      console.error("Error deleting contact message:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="contact-admin-wrapper">
      <h2 className="contact-title">Contact Messages</h2>
      <div className="contact-table-container">
        <table className="contact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="contact-empty">
                  No messages yet.
                </td>
              </tr>
            ) : (
              messages.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td className="contact-message-cell">{m.message}</td>
                  <td>
                    {m.date
                      ? new Date(m.date).toLocaleString()
                      : m.createdAt
                      ? new Date(m.createdAt).toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteMessage(m._id)}
                      className="contact-delete-btn"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
