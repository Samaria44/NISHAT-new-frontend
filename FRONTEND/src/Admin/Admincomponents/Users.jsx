import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import "./Admincontact.css"; // 👈 NEW

export default function ContactAdmin() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:8000/contact");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/contact/${id}`);
      fetchMessages();
    } catch (err) {
      console.error(err);
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
                  <td>{new Date(m.date).toLocaleString()}</td>
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
