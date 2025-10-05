import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({
    budgets: [],
    spendingThisMonth: {},
    recentExpenses: [],
    accounts: [],
    monthlyBudgetLimit: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      
      const response = await api.get('/api/overview/home');
      
      setData(response.data);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const totalSpending = Object.values(data.spendingThisMonth).reduce((sum, amount) => sum + amount, 0);
  const totalBudget = data.monthlyBudgetLimit || data.budgets.reduce((sum, budget) => sum + (budget.amount || 0), 0);
  const percentageSpent = totalBudget > 0 ? (totalSpending / totalBudget * 100).toFixed(0) : 0;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'red';
    if (percentage >= 75) return 'orange';
    return '';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="logo">Finance</div>
          <ul className="menu">
            <li><NavLink to="/home">Home</NavLink></li>
            <li><NavLink to="/transactions">Transactions</NavLink></li>
            <li><NavLink to="/budgets">Budgets</NavLink></li>
            <li><NavLink to="/account">Account</NavLink></li>
          </ul>
        </aside>
        <main className="main-content">
          <div className="topbar">
            <h2>Overview</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Loading...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="logo">Finance</div>
          <ul className="menu">
            <li><NavLink to="/home">Home</NavLink></li>
            <li><NavLink to="/transactions">Transactions</NavLink></li>
            <li><NavLink to="/budgets">Budgets</NavLink></li>
            <li><NavLink to="/account">Account</NavLink></li>
          </ul>
        </aside>
        <main className="main-content">
          <div className="topbar">
            <h2>Overview</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h3 style={{ color: 'red' }}>Error Loading Data</h3>
            <p>{error}</p>
            <button 
              onClick={fetchOverviewData} 
              style={{ 
                padding: '10px 20px', 
                marginTop: '20px', 
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">Finance</div>
        <ul className="menu">
          <li><NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
          <li><NavLink to="/transactions" className={({ isActive }) => isActive ? "active" : ""}>Transactions</NavLink></li>
          <li><NavLink to="/budgets" className={({ isActive }) => isActive ? "active" : ""}>Budgets</NavLink></li>
          <li><NavLink to="/account" className={({ isActive }) => isActive ? "active" : ""}>Account</NavLink></li>
        </ul>
        <button 
          onClick={handleLogout}
          style={{
            marginTop: 'auto',
            padding: '12px',
            backgroundColor: 'transparent',
            border: '1px solid #a3b8a5',
            borderRadius: '8px',
            color: '#a3b8a5',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s',
            width: '90%',
            marginLeft: '5%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#25633d';
            e.currentTarget.style.color = '#75dc85';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#a3b8a5';
          }}
        >
          Logout
        </button>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <h2>Overview</h2>
          <div className="topbar-right">
            <button 
              className="notification-btn" 
              onClick={fetchOverviewData}
              title="Refresh data"
              style={{ cursor: 'pointer' }}
            >
              Refresh
            </button>
            <div className="avatar">👩</div>
          </div>
        </div>

        <section className="cards-container">
          <div className="card spending-summary">
            <div className="card-title">Spending Summary</div>
            <div className="amount">{formatCurrency(totalSpending)}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(percentageSpent, 100)}%` }}
              ></div>
            </div>
            <div className="progress-text">{percentageSpent}% of monthly budget</div>
          </div>

          <div className="card budget-allocation">
            <div className="card-title">Budget Allocation</div>

            {data.budgets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                No budgets found. Create a budget to get started!
              </div>
            ) : (
              data.budgets.map((budget, index) => {
                const spent = data.spendingThisMonth[budget.name] || 0;
                const limit = budget.amount || 0;
                const percentage = limit > 0 ? (spent / limit * 100).toFixed(0) : 0;

                return (
                  <div className="budget-item" key={index}>
                    <span>{budget.name || 'Unnamed Budget'}</span>
                    <span>{formatCurrency(spent)} / {formatCurrency(limit)}</span>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${getProgressColor(percentage)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="transactions">
          <div className="card-title">Recent Transactions</div>
          {data.recentExpenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              No recent transactions found.
            </div>
          ) : (
            <ul>
              {data.recentExpenses.map((expense, index) => {
                let category = 'Uncategorized';
                let description = expense.description || expense.note || 'No description';
                
                if (description) {
                  const match = description.match(/^\[([^\]]+)\]\s*(.*)/);
                  if (match) {
                    category = match[1];
                    description = match[2] || description;
                  }
                }
                
                return (
                  <li key={index}>
                    <span>{category}</span>
                    <div>{description}</div>
                    <span className="amount">- {formatCurrency(expense.amount)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;