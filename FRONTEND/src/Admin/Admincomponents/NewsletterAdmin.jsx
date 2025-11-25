import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";



export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState([]);

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/newsletter");
      setSubscribers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubscriber = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/newsletter/${id}`);
      fetchSubscribers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div style={{ padding: "20px", marginLeft: "258px" }}>
      <h2>Newsletter Subscribers</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s) => (
            <tr key={s._id}>
              <td>{s.email}</td>
              <td>{new Date(s.date).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => deleteSubscriber(s._id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "red",
                    fontSize: "16px",
                  }}
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
