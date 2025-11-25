import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
const BACKEND_URL = "http://localhost:8000/api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/forgot-password`, { email });
      alert("Password reset email sent! Check console or email for token.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}
