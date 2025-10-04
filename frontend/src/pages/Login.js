import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState(null);
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
   e.preventDefault();
   setError(null);
   try {
   const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      });
    if (!response.ok) {
         const errorData = await response.text();
         setError(errorData || "Login failed");
       } else {
 // Store your token here if returned from backend
 // const data = await response.json();
 // localStorage.setItem("token", data.token);
         localStorage.setItem("token", "dummy-token"); // For demo
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
          <p>Login in to continue to your account</p>

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

export default Login;
