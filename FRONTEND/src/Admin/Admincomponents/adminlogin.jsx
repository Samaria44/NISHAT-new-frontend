import React, { useEffect, useState } from "react";
import "./adminLogin.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLogin() {
  const [loginForm, setLoginForm] = useState({
    Email: "",
    Password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, isAuthenticated, roles } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Check if user has admin role
      const isAdmin = roles.includes('admin') || roles.includes('ROLE_ADMIN');
      if (isAdmin) {
        navigate("/dashboard");
      } else {
        setError("Access denied. Admin privileges required.");
      }
    }
  }, [isAuthenticated, roles, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginForm.Email || !loginForm.Password) {
      setError("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      const result = await login(loginForm.Email, loginForm.Password);
      
      if (result.success) {
        // Check if user has admin role
        const isAdmin = roles.includes('admin') || roles.includes('ROLE_ADMIN');
        if (isAdmin) {
          navigate("/dashboard");
        } else {
          setError("Access denied. Admin privileges required.");
        }
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        {error && (
          <div className="error-message" style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '15px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            name="Email"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={loginForm.Email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            name="Password"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={loginForm.Password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="login-btn"
          disabled={loading}
          style={{ 
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#666' 
        }}>
          <p>Use your admin credentials to login</p>
          <p>Contact administrator if you need access</p>
        </div>
      </form>
    </div>
  );
}
