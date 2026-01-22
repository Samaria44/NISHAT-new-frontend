import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import "./NewsletterAdmin.css";

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState([]);

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/newsletter`);
      setSubscribers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubscriber = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/newsletter/${id}`);
      fetchSubscribers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="newsletter-admin-wrapper">
      <h2 className="newsletter-title">Newsletter Subscribers</h2>
      <div className="newsletter-table-container">
        <table className="newsletter-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="newsletter-empty">
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map((s) => (
                <tr key={s._id}>
                  <td>{s.email}</td>
                  <td>{new Date(s.date).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => deleteSubscriber(s._id)}
                      className="newsletter-delete-btn"
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
