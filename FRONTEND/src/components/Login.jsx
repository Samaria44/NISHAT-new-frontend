import React, { useState, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = ({ onClose, onLoginSuccess }) => {
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Enter email & password");
      return;
    }
    
    try {
      setLoading(true);
      const result = await login(form.email, form.password);
      
      if (result.success) {
        alert("Login successful!");
        onLoginSuccess?.();
        onClose();
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("All fields are required!");
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          roles: ['user'] // Default role for new users
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Account created successfully! Please login.");
        setView("login");
        setForm({ firstName: "", lastName: "", email: "", password: "" });
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD
  const handleForgot = async (e) => {
    e.preventDefault();
    if (!form.email) {
      setError("Enter your email");
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Password reset link sent! Check your email.");
        setView("login");
      } else {
        setError(data.message || "Error sending reset link");
      }
    } catch (err) {
      setError(err.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`user-sidebar ${view === "login" ? "open" : ""}`}>
        <div className="user-sidebar-header">
          <h3>
            {view === "login" && "Login"}
            {view === "signup" && "Create Account"}
            {view === "forgot" && "Forgot Password"}
          </h3>
          <button className="close-icon" onClick={onClose}>×</button>
        </div>

        <div className="user-sidebar-content">
          {/* LOGIN */}
          {view === "login" && (
            <form onSubmit={handleLogin}>
              {error && <div className="error-message">{error}</div>}
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <p type="button" className="link" onClick={() => setView("forgot")}>
                Forgot Password?
              </p>
              <p className="switch-text">
                Don't have an account?{" "}
                <span className="link" onClick={() => setView("signup")}>Sign up</span>
              </p>
            </form>
          )}

          {/* SIGNUP */}
          {view === "signup" && (
            <form onSubmit={handleSignup}>
              {error && <div className="error-message">{error}</div>}
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="input"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="input"
                value={form.lastName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Signing up..." : "Create Account"}
              </button>
              <p className="switch-text">
                Already have an account?{" "}
                <span className="link" onClick={() => setView("login")}>Login</span>
              </p>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {view === "forgot" && (
            <form onSubmit={handleForgot}>
              {error && <div className="error-message">{error}</div>}
              <p>Enter your email and we'll send password reset link.</p>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={handleChange}
                required
              />
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <p className="switch-text">
                Back to{" "}
                <span className="link" onClick={() => setView("login")}>Login</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
