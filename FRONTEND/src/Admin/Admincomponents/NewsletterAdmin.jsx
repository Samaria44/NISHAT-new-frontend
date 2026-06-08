import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInterceptor";
import { FiTrash2 } from "react-icons/fi";
import "./NewsletterAdmin.css";

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState([]);

  const fetchSubscribers = async () => {
    try {
      // axiosInstance already has baseURL set — use relative path only
      const res = await axiosInstance.get("/newsletter");
      setSubscribers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
    }
  };

  const deleteSubscriber = async (id) => {
    try {
      await axiosInstance.delete(`/newsletter/${id}`);
      fetchSubscribers();
    } catch (err) {
      console.error("Error deleting subscriber:", err);
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
                  <td>
                    {s.date
                      ? new Date(s.date).toLocaleString()
                      : s.createdAt
                      ? new Date(s.createdAt).toLocaleString()
                      : "—"}
                  </td>
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
