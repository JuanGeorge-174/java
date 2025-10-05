import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";  // import CSS

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Finance</div>

      <div className="links">
        
        <NavLink to="/home" className="navlink">Home</NavLink>
        
        <NavLink to="/transactions" className="navlink">Transactions</NavLink>
        <NavLink to="/budgets" className="navlink">Budgets</NavLink>
        <NavLink to="/account" className="navlink">Account</NavLink>
      </div>

      <div className="avatar">
        <img src="https://via.placeholder.com/40" alt="avatar"/>
      </div>
    </nav>
  );
}

export default Navbar;
