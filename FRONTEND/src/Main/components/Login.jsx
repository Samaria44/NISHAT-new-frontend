import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const BACKEND_URL = "http://localhost:8000/api/auth";

export default function Login() {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) navigate("/user");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      alert("Enter all fields");
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/signin`, loginForm);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify({
        id: res.data.id,
        email: res.data.email,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        roles: res.data.roles,
      }));
      navigate("/user");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <div className="input-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={loginForm.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={loginForm.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-btn">Sign in</button>

        <div className="login-links">
          <a href="/forgot-password">Forgot Password?</a>
          <span> | </span>
          <a href="/signup">Create an Account</a>
          <span> | </span>
          <a href="/reset-password">Reset Password</a>
        </div>
      </form>
    </div>
  );
}
