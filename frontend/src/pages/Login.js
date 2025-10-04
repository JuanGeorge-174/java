import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        setError(errorData || "Login failed");
      } else {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/home", { replace: true });
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="logo">💰 Expense Tracker</h2>
        <h3>Welcome Back</h3>
        <p>Login to continue to your account</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="register-text">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
