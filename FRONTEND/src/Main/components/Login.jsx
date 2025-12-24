import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInterceptor";
import "./Login.css";

const BACKEND_URL = "https://nishat-api.vercel.app/auth"; // backend API

const UserSidebar = ({ open, onClose, onLoginSuccess }) => {
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // LOGIN
  const handleLogin = async () => {
    if (!form.email || !form.password) return alert("Enter email & password");
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/auth/signin`, {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Login successful!");
      onLoginSuccess?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP
  const handleSignup = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password)
      return alert("All fields are required!");
    try {
      setLoading(true);
      await axiosInstance.post(`/auth/signup`, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      alert("Account created successfully! Please login.");
      setView("login");
      setForm({ firstName: "", lastName: "", email: "", password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD
  const handleForgot = async () => {
    if (!form.email) return alert("Enter your email");
    try {
      setLoading(true);
      await axiosInstance.post(`/auth/forgot-password`, { email: form.email });
      alert("Password reset link sent! Check your email.");
      setView("login");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`user-sidebar ${open ? "open" : ""}`}>
        <div className="user-sidebar-header">
          <h3>
            {view === "login" && "Login"}
            {view === "signup" && "Create Account"}
            {view === "forgot" && "Forgot Password"}
          </h3>
          <FiX className="close-icon" onClick={onClose} />
        </div>

        <div className="user-sidebar-content">
          {/* LOGIN */}
          {view === "login" && (
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input"
                value={form.password}
                onChange={handleChange}
              />
              <button className="primary-btn" onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <p className="link" onClick={() => setView("forgot")}>Forgot Password?</p>
              <p className="switch-text">
                Don't have an account?{" "}
                <span className="link" onClick={() => setView("signup")}>Sign up</span>
              </p>
            </div>
          )}

          {/* SIGNUP */}
          {view === "signup" && (
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="input"
                value={form.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="input"
                value={form.lastName}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input"
                value={form.password}
                onChange={handleChange}
              />
              <button className="primary-btn" onClick={handleSignup} disabled={loading}>
                {loading ? "Signing up..." : "Create Account"}
              </button>
              <p className="switch-text">
                Already have an account?{" "}
                <span className="link" onClick={() => setView("login")}>Login</span>
              </p>
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {view === "forgot" && (
            <div>
              <p>Enter your email and we'll send password reset link.</p>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={handleChange}
              />
              <button className="primary-btn" onClick={handleForgot} disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <p className="switch-text">
                Back to{" "}
                <span className="link" onClick={() => setView("login")}>Login</span>
              </p>
            </div>
          )}
        </div>
      </div>
      {open && <div className="overlay" onClick={onClose}></div>}
    </>
  );
};

export default UserSidebar;
