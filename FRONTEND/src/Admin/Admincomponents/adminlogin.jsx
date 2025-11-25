import React, { useEffect, useState } from "react";
import "./adminLogin.css";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [loginForm, setLoginForm] = useState({
    Email: "",
    Password: "",
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginForm.Email || !loginForm.Password) {
      alert("Please fill all fields!");
      return;
    }

    if (loginForm.Email === "example@gmail.com" && loginForm.Password === "0099") {
      localStorage.setItem("authToken", JSON.stringify(true));
      navigate("/dashboard");
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

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
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}
