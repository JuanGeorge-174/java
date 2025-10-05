// src/pages/Home.js - DEBUG VERSION
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
    accounts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('=== HOME COMPONENT MOUNTED ===');
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }
    fetchOverviewData();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing data...');
      fetchOverviewData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    console.log('Route changed to:', location.pathname);
    if (location.pathname === '/home') {
      fetchOverviewData();
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleDataUpdate = (event) => {
      console.log('Data update event received:', event.type);
      fetchOverviewData();
    };

    window.addEventListener('expenseUpdated', handleDataUpdate);
    window.addEventListener('budgetUpdated', handleDataUpdate);
    window.addEventListener('accountUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('expenseUpdated', handleDataUpdate);
      window.removeEventListener('budgetUpdated', handleDataUpdate);
      window.removeEventListener('accountUpdated', handleDataUpdate);
    };
  }, []);

  const fetchOverviewData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('❌ No authentication token found');
        navigate('/login');
        return;
      }

      console.log('🔄 Fetching data from: /api/overview/home');
      console.log('📤 Request config:', {
        url: 'http://localhost:8080/api/overview/home',
        method: 'GET',
        hasToken: !!token
      });
      
      setLoading(true);
      
      const response = await api.get('/api/overview/home');
      
      console.log('✅ Response received:', response);
      console.log('📊 Response status:', response.status);
      console.log('📦 Response data:', response.data);
      console.log('🔍 DETAILED DATA:');
      console.log('  - Budgets:', response.data?.budgets);
      console.log('  - Spending this month:', response.data?.spendingThisMonth);
      console.log('  - Recent expenses:', response.data?.recentExpenses);
      console.log('  - Accounts:', response.data?.accounts);
      console.log('📋 Data structure:', {
        budgets: response.data?.budgets?.length || 0,
        spendingKeys: Object.keys(response.data?.spendingThisMonth || {}),
        spendingValues: Object.values(response.data?.spendingThisMonth || {}),
        recentExpenses: response.data?.recentExpenses?.length || 0,
        accounts: response.data?.accounts?.length || 0
      });
      
      setData(response.data);
      setError(null);
      setLoading(false);
      
      console.log('✅ State updated successfully');
    } catch (err) {
      console.error('❌ Fetch error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        console.log('🔒 Authentication failed, redirecting to login');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const totalSpending = Object.values(data.spendingThisMonth).reduce((sum, amount) => sum + amount, 0);
  const totalBudget = data.budgets.reduce((sum, budget) => sum + (budget.amount || 0), 0);
  const percentageSpent = totalBudget > 0 ? (totalSpending / totalBudget * 100).toFixed(0) : 0;

  console.log('💰 Calculations:', {
    totalSpending,
    totalBudget,
    percentageSpent,
    budgetsCount: data.budgets.length,
    expensesCount: data.recentExpenses.length,
    spendingByCategoryKeys: Object.keys(data.spendingThisMonth),
    spendingByCategoryValues: Object.values(data.spendingThisMonth),
    fullSpendingData: data.spendingThisMonth
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
            <li><NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
            <li><NavLink to="/transactions" className={({ isActive }) => isActive ? "active" : ""}>Transactions</NavLink></li>
            <li><NavLink to="/budgets" className={({ isActive }) => isActive ? "active" : ""}>Budgets</NavLink></li>
            <li><NavLink to="/account" className={({ isActive }) => isActive ? "active" : ""}>Account</NavLink></li>
          </ul>
        </aside>
        <main className="main-content">
          <div className="topbar">
            <h2>Overview</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div>Loading...</div>
            <div style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
              Check browser console (F12) for detailed logs
            </div>
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
            <li><NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
            <li><NavLink to="/transactions" className={({ isActive }) => isActive ? "active" : ""}>Transactions</NavLink></li>
            <li><NavLink to="/budgets" className={({ isActive }) => isActive ? "active" : ""}>Budgets</NavLink></li>
            <li><NavLink to="/account" className={({ isActive }) => isActive ? "active" : ""}>Account</NavLink></li>
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
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
              Check browser console (F12) for detailed error logs
            </div>
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
              🔄
            </button>
            <button className="notification-btn">🔔</button>
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
                // The backend already calculated spending by category in spendingThisMonth
                // Just look it up directly by budget name
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
                // Extract category from note if it exists
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