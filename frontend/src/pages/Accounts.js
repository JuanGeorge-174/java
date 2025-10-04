import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Bell,
  Plus,
  Building2,
  PiggyBank,
  CreditCard,
  Wallet,
} from "lucide-react";

// Icon mapping based on account type
const iconMap = {
  Checking: Building2,
  Savings: PiggyBank,
  "Credit Card": CreditCard,
  Investment: Wallet,
};

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("Savings");
  const [initialBalance, setInitialBalance] = useState("0.00");

  // Fetch accounts from backend on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn("No token found");
        return;
      }

      const res = await axios.get("http://localhost:8080/api/accounts", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session expired. Please login again.");
      }
    }
  };

  // Save account with authentication
  const handleSaveAccount = async () => {
    if (!accountName.trim() || !initialBalance) {
      alert("Please fill all required fields");
      return;
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please login first");
      return;
    }

    const newAccount = {
      name: accountName,
      currency: "INR",
      initialAmount: parseFloat(initialBalance),
      note: `${accountType} account`,
    };

    try {
      await axios.post("http://localhost:8080/api/accounts", newAccount, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Refresh accounts after saving
      await fetchAccounts();

      // Reset form and close modal
      setAccountName("");
      setAccountType("Savings");
      setInitialBalance("0.00");
      setShowAddAccount(false);
      
    } catch (err) {
      console.error("Error saving account:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session expired. Please login again.");
      } else {
        alert("Failed to save account. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setShowAddAccount(false);
    setAccountName("");
    setAccountType("Savings");
    setInitialBalance("0.00");
  };

  const totalAssets = accounts.reduce(
    (sum, acc) => sum + (acc.currentBalance || acc.initialAmount || 0),
    0
  );

  const styles = {
    app: {
      minHeight: "100vh",
      backgroundColor: "#1a241d",
      color: "#a3b8a5",
      fontFamily: "sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    contentWrapper: {
      marginTop: 64,
      width: "90vw",
      maxWidth: 1024,
      paddingBottom: 32,
      boxSizing: "border-box",
    },
    header: {
      backgroundColor: "#1a241d",
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "10px 10px 0 0",
      color: "#ddd",
      fontWeight: "bold",
    },
    card: {
      backgroundColor: "#222936",
      borderRadius: "14px",
      padding: "20px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
      marginBottom: "16px",
    },
    input: {
      width: "100%",
      backgroundColor: "#222936",
      border: "1px solid #25633d",
      borderRadius: "8px",
      padding: "10px 14px",
      color: "#ddd",
      fontSize: "15px",
      marginTop: "6px",
      boxSizing: "border-box",
      fontFamily: "sans-serif",
    },
    select: {
      width: "100%",
      backgroundColor: "#222936",
      border: "1px solid #25633d",
      borderRadius: "8px",
      padding: "10px 14px",
      color: "#ddd",
      fontSize: "15px",
      marginTop: "6px",
      boxSizing: "border-box",
      fontFamily: "sans-serif",
      cursor: "pointer",
    },
    buttonPrimary: {
      backgroundColor: "#75dc85",
      border: "none",
      borderRadius: "10px",
      padding: "12px 24px",
      fontWeight: "bold",
      color: "#152018",
      cursor: "pointer",
      transition: "0.2s",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    buttonSecondary: {
      backgroundColor: "#222936",
      border: "1px solid #25633d",
      borderRadius: "10px",
      padding: "12px 24px",
      fontWeight: "bold",
      color: "#ddd",
      cursor: "pointer",
      transition: "0.2s",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    accountRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#222936",
      borderRadius: "12px",
      padding: "18px 24px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
      cursor: "pointer",
      marginBottom: "12px",
      transition: "background-color 0.2s",
    },
    accountInfo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    accountIconContainer: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      backgroundColor: "#152018",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <div style={styles.app}>
      <Navbar />
      <div style={styles.contentWrapper}>
        {!showAddAccount && (
          <header style={styles.header}>
            <h1>Accounts Overview</h1>
            <Bell size={20} />
          </header>
        )}

        {!showAddAccount ? (
          <>
            {/* Total Assets Card */}
            <div style={styles.card}>
              <div style={{ color: "#89a594" }}>Total Assets</div>
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  color: "#75dc85",
                }}
              >
                ₹{totalAssets.toFixed(2)}
              </div>
            </div>

            {/* Account List */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2 style={{ color: "#ddd", fontWeight: "bold" }}>
                Your Accounts
              </h2>
              <button
                onClick={() => setShowAddAccount(true)}
                style={styles.buttonPrimary}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#65cc75"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#75dc85"}
              >
                <Plus size={16} /> Add Account
              </button>
            </div>

            <div>
              {accounts.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#89a594"
                }}>
                  No accounts yet. Click "Add Account" to create one.
                </div>
              ) : (
                accounts.map((acc) => {
                  const Icon = iconMap[
                    acc.note?.includes("Credit") ? "Credit Card" : 
                    acc.note?.includes("Savings") ? "Savings" : 
                    acc.note?.includes("Investment") ? "Investment" : 
                    "Checking"
                  ];
                  return (
                    <div 
                      key={acc.id} 
                      style={styles.accountRow}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2a3440"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#222936"}
                    >
                      <div style={styles.accountInfo}>
                        <div style={styles.accountIconContainer}>
                          <Icon size={24} color="#75dc85" />
                        </div>
                        <div>
                          <div style={{ fontWeight: "bold", color: "#ddd" }}>
                            {acc.name}
                          </div>
                          <div style={{ fontSize: 14, color: "#89a594" }}>
                            {acc.currency || "INR"}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#75dc85",
                        }}
                      >
                        ₹{(acc.currentBalance || acc.initialAmount || 0).toFixed(2)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          // Add Account Form
          <main style={{ padding: 24, maxWidth: 640 }}>
            <h2 style={{ color: "#75dc85", marginBottom: 20 }}>
              Add New Account
            </h2>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#ddd", fontWeight: "500" }}>
                Account Name *
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g., My Savings Account"
                style={styles.input}
                required
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#ddd", fontWeight: "500" }}>
                Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                style={styles.select}
              >
                <option>Savings</option>
                <option>Checking</option>
                <option>Credit Card</option>
                <option>Investment</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#ddd", fontWeight: "500" }}>
                Initial Balance *
              </label>
              <input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                style={styles.input}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleCancel}
                style={styles.buttonSecondary}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2a3440"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#222936"}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAccount} 
                style={styles.buttonPrimary}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#65cc75"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#75dc85"}
              >
                Save Account
              </button>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}