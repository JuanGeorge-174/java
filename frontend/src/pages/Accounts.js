import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Bell,
  Plus,
  Building2,
  PiggyBank,
  CreditCard,
  Wallet,
} from "lucide-react";

export default function FinTrack() {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("Savings");
  const [initialBalance, setInitialBalance] = useState("0.00");
  const [linkInstitution, setLinkInstitution] = useState(false);

  const accounts = [
    { id: 1, name: "Primary Checking", type: "Checking", balance: 5200.0, icon: Building2 },
    { id: 2, name: "Emergency Fund", type: "Savings", balance: 7300.0, icon: PiggyBank },
    { id: 3, name: "Travel Rewards Card", type: "Credit Card", balance: 0.0, icon: CreditCard },
  ];

  const totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleSaveAccount = () => {
    setShowAddAccount(false);
    setAccountName("");
    setAccountType("Savings");
    setInitialBalance("0.00");
    setLinkInstitution(false);
  };

  const handleCancel = () => {
    setShowAddAccount(false);
    setAccountName("");
    setAccountType("Savings");
    setInitialBalance("0.00");
    setLinkInstitution(false);
  };

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
      marginTop: 64, // Push content below assumed navbar height
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
            <div style={styles.card}>
              <div style={{ color: "#89a594" }}>Total Assets</div>
              <div style={{ fontSize: "40px", fontWeight: "bold", color: "#75dc85" }}>
                ${totalAssets.toFixed(2)}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ color: "#ddd", fontWeight: "bold" }}>Your Accounts</h2>
              <button onClick={() => setShowAddAccount(true)} style={styles.buttonPrimary}>
                <Plus size={16} /> Add Account
              </button>
            </div>

            <div>
              {accounts.map((acc) => {
                const Icon = acc.icon;
                return (
                  <div key={acc.id} style={styles.accountRow}>
                    <div style={styles.accountInfo}>
                      <div style={styles.accountIconContainer}>
                        <Icon size={24} color="#75dc85" />
                      </div>
                      <div>
                        <div style={{ fontWeight: "bold", color: "#ddd" }}>{acc.name}</div>
                        <div style={{ fontSize: 14, color: "#89a594" }}>{acc.type}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: "bold", color: "#75dc85" }}>
                      ${acc.balance.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <main style={{ padding: 24, maxWidth: 640 }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#ddd", fontWeight: "500" }}>Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="My Savings Account"
                style={styles.input}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#ddd", fontWeight: "500" }}>Account Type</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                style={styles.input}
              >
                <option>Savings</option>
                <option>Checking</option>
                <option>Credit Card</option>
                <option>Investment</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#ddd", fontWeight: "500" }}>Initial Balance</label>
              <input
                type="text"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}
              >
               </label>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleCancel} style={{ ...styles.buttonPrimary, backgroundColor: "#222936", color: "#ddd" }}>
                Cancel
              </button>
              <button onClick={handleSaveAccount} style={styles.buttonPrimary}>
                Save Account
              </button>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
