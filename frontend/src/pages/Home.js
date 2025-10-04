import React from "react";

import "../styles/Home.css";
import { NavLink } from "react-router-dom";
function Home() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">Finance</div>
        <ul className="menu">
  <li>
    <NavLink 
      to="/home" 
      className={({ isActive }) => isActive ? "active" : ""}
    >
      Home
    </NavLink>
  </li>
  <li>
    <NavLink 
      to="/expense" 
      className={({ isActive }) => isActive ? "active" : ""}
    >
      Expense
    </NavLink>
  </li>
  <li>
    <NavLink 
      to="/transactions" 
      className={({ isActive }) => isActive ? "active" : ""}
    >
      Transactions
    </NavLink>
  </li>
  <li>
    <NavLink 
      to="/budgets" 
      className={({ isActive }) => isActive ? "active" : ""}
    >
      Budgets
    </NavLink>
  </li>
  <li>
    <NavLink 
      to="/account" 
      className={({ isActive }) => isActive ? "active" : ""}
    >
      Account
    </NavLink>
  </li>
</ul>

      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="topbar">
          <h2>Overview</h2>
          <div className="topbar-right">
            <button className="notification-btn">🔔</button>
            <div className="avatar">👩</div>
          </div>
        </div>

        {/* Cards Section */}
        <section className="cards-container">
          <div className="card spending-summary">
            <div className="card-title">Spending Summary</div>
            <div className="amount">$2,450.00</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "65%" }}></div>
            </div>
            <div className="progress-text">65% of monthly budget</div>
          </div>

          <div className="card budget-allocation">
            <div className="card-title">Budget Allocation</div>

            <div className="budget-item">
              <span>Food & Dining</span>
              <span>$750 / $1,000</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "75%" }}></div>
              </div>
            </div>

            <div className="budget-item">
              <span>Transportation</span>
              <span>$250 / $500</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "50%" }}></div>
              </div>
            </div>

            <div className="budget-item">
              <span>Entertainment</span>
              <span>$900 / $1,000</span>
              <div className="progress-bar">
                <div className="progress-fill grey" style={{ width: "90%" }}></div>
              </div>
            </div>

            <div className="budget-item">
              <span>Shopping</span>
              <span>$550 / $2,500</span>
              <div className="progress-bar">
                <div className="progress-fill grey" style={{ width: "25%" }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="transactions">
          <div className="card-title">Recent Transactions</div>
          <ul>
            <li>
              <span>☕ Coffee Shop</span>
              <div>Cafe Mocha</div>
              <span className="amount">- $5.50</span>
            </li>
            <li>
              <span>🚖 Transportation</span>
              <div>Taxi Ride</div>
              <span className="amount">- $25.00</span>
            </li>
            <li>
              <span>🛒 Supermarket</span>
              <div>Grocery Shopping</div>
              <span className="amount">- $120.00</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Home;
