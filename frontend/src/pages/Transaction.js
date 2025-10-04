import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Search, Plus, Bell, ChevronDown } from "lucide-react";

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [accountFrom, setAccountFrom] = useState("");
  const [accountTo, setAccountTo] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get("http://localhost:8080/api/transactions", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get("http://localhost:8080/api/accounts", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  const filterByDateRange = useCallback((dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    switch (dateRange) {
      case "Last 30 days":
        return (today - date) / (1000 * 3600 * 24) <= 30;
      case "Last 60 days":
        return (today - date) / (1000 * 3600 * 24) <= 60;
      case "Last 90 days":
        return (today - date) / (1000 * 3600 * 24) <= 90;
      case "This year":
        return date.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  }, [dateRange]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((txn) => filterByDateRange(txn.date))
      .sort((a, b) => {
        if (sortBy === "Newest") return new Date(b.date) - new Date(a.date);
        if (sortBy === "Oldest") return new Date(a.date) - new Date(b.date);
        if (sortBy === "Highest Amount") return b.amount - a.amount;
        if (sortBy === "Lowest Amount") return a.amount - b.amount;
        return 0;
      });
  }, [transactions, dateRange, sortBy, filterByDateRange]);

  const openModal = () => setModalOpen(true);
  
  const closeModal = () => {
    setModalOpen(false);
    setTransactionType("expense");
    setAmount("");
    setAccountFrom("");
    setAccountTo("");
    setNote("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (transactionType === "transfer") {
      if (!accountFrom || !accountTo) {
        alert("Please select both accounts for transfer");
        return;
      }
    } else {
      if (!accountFrom) {
        alert("Please select an account");
        return;
      }
    }

    const payload = {
      type: transactionType,
      amount: parseFloat(amount),
      accountFromId: accountFrom ? parseInt(accountFrom) : null,
      accountToId: accountTo ? parseInt(accountTo) : null,
      note: note || null
    };

    try {
      await axios.post("http://localhost:8080/api/transactions", payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      await fetchTransactions();
      await fetchAccounts(); // Refresh accounts to show updated balances
      closeModal();
    } catch (err) {
      console.error("Error creating transaction:", err);
      alert("Failed to create transaction. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const styles = {
    app: {
      fontFamily: `"Segoe UI", Tahoma, Geneva, Verdana, sans-serif`,
      backgroundColor: "#1a241d",
      color: "#ddd",
      minHeight: "100vh",
      margin: 0,
      padding: 0,
    },
    mainContent: {
      flexGrow: 1,
      overflowY: "auto",
      marginTop: 100,
      padding: "32px 40px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    },
    mainHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 34,
      flexWrap: "wrap",
    },
    title: {
      fontWeight: 500,
      fontSize: "1.75rem",
      color: "white",
      userSelect: "none",
    },
    newTxnBtn: {
      backgroundColor: "#75dc85",
      color: "#152018",
      padding: "10px 16px",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: 8,
      userSelect: "none",
      transition: "background-color 0.2s ease",
    },
    searchWrapper: {
      position: "relative",
      marginBottom: 26,
    },
    searchInput: {
      width: "100%",
      backgroundColor: "#152018",
      border: "1px solid #25633d",
      borderRadius: 14,
      padding: "12px 20px 12px 45px",
      fontSize: "1.1rem",
      color: "#ddd",
      outline: "none",
      fontFamily: `"Segoe UI", Tahoma, Geneva, Verdana, sans-serif`,
      userSelect: "none",
    },
    searchIcon: {
      position: "absolute",
      left: 15,
      top: "50%",
      transform: "translateY(-50%)",
      color: "#a3b8a5",
      userSelect: "none",
    },
    filters: {
      display: "flex",
      gap: 20,
      marginBottom: 26,
      flexWrap: "wrap",
    },
    filterItem: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "#a3b8a5",
      fontSize: "1rem",
      fontWeight: "500",
      userSelect: "none",
      position: "relative",
    },
    select: {
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      paddingRight: 50,
      backgroundColor: "#152018",
      border: "1px solid #25633d",
      borderRadius: 8,
      padding: "8px 12px",
      textAlign: "center",
      color: "#ddd",
      cursor: "pointer",
      fontSize: "1rem",
      outline: "none",
      userSelect: "none",
    },
    dropdownIcon: {
      position: "absolute",
      right: 12,
      top: "50%",
      transform: "translateY(-50%)",
      color: "#a3b8a5",
      pointerEvents: "none",
      userSelect: "none",
    },
    tableWrapper: {
      backgroundColor: "#222936",
      borderRadius: 14,
      padding: "26px 28px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      color: "#a3b8a5",
      userSelect: "none",
    },
    tableTitle: {
      marginBottom: 28,
      fontSize: "1.2rem",
      fontWeight: 500,
      color: "#a3b8a5",
      userSelect: "none",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    td: {
      padding: "14px 0",
      fontSize: "1.1rem",
      color: "#a3b8a5",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(26, 36, 29, 0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "#222936",
      color: "#ddd",
      padding: 32,
      borderRadius: 14,
      width: 450,
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 4px 20px rgba(0,0,0,0.65)",
      userSelect: "none",
    },
    modalTitle: {
      marginBottom: 20,
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    formLabel: {
      display: "block",
      marginBottom: 12,
      fontSize: "1rem",
    },
    formInput: {
      width: "100%",
      padding: "8px 12px",
      borderRadius: 8,
      border: "1px solid #25633d",
      backgroundColor: "#152018",
      color: "#ddd",
      fontSize: "1rem",
      outline: "none",
      marginTop: 4,
      marginBottom: 20,
      boxSizing: "border-box",
    },
    formButtons: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 16,
    },
    submitBtn: {
      backgroundColor: "#75dc85",
      color: "#152018",
      border: "none",
      padding: "10px 24px",
      borderRadius: 8,
      fontWeight: 600,
      cursor: "pointer",
      userSelect: "none",
      transition: "background-color 0.25s ease",
    },
    cancelBtn: {
      backgroundColor: "transparent",
      border: "1px solid #a3b8a5",
      color: "#a3b8a5",
      padding: "10px 24px",
      borderRadius: 8,
      fontWeight: 600,
      cursor: "pointer",
      userSelect: "none",
      transition: "background-color 0.25s ease",
    },
    typeSelector: {
      display: "flex",
      gap: 12,
      marginBottom: 20,
    },
    typeButton: {
      flex: 1,
      padding: "10px",
      border: "1px solid #25633d",
      backgroundColor: "#152018",
      color: "#a3b8a5",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600,
      transition: "all 0.2s ease",
    },
    typeButtonActive: {
      backgroundColor: "#75dc85",
      color: "#152018",
      border: "1px solid #75dc85",
    },
  };

  return (
    <div style={styles.app}>
      <Navbar />
      <main style={styles.mainContent}>
        <div style={styles.mainHeader}>
          <h2 style={styles.title}>Transactions</h2>
          <button style={styles.newTxnBtn} onClick={openModal}>
            <Plus />
            <span>New Transaction</span>
          </button>
        </div>

        <div style={styles.filters}>
          <div style={{ ...styles.filterItem, position: "relative" }}>
            <label htmlFor="dateRange">Date Range:</label>
            <select id="dateRange" value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={styles.select}>
              <option>Last 30 days</option>
              <option>Last 60 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
            <ChevronDown style={styles.dropdownIcon} />
          </div>

          <div style={{ ...styles.filterItem, position: "relative" }}>
            <label htmlFor="sortBy">Sort by:</label>
            <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Highest Amount</option>
              <option>Lowest Amount</option>
            </select>
            <ChevronDown style={styles.dropdownIcon} />
          </div>
        </div>

        <div style={styles.tableWrapper}>
          <div style={styles.tableTitle}>Recent Transactions</div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.td}>Date</th>
                <th style={styles.td}>Type</th>
                <th style={styles.td}>Account</th>
                <th style={styles.td}>Note</th>
                <th style={{ ...styles.td, textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ ...styles.td, textAlign: "center" }}>
                    No transactions found.
                  </td>
                </tr>
              )}
              {filteredTransactions.map((txn, idx) => (
                <tr key={txn.id} style={{ borderBottom: idx === filteredTransactions.length - 1 ? "none" : "1px solid #3a424c" }}>
                  <td style={styles.td}>{formatDate(txn.date)}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: "#c8d6c9", textTransform: "capitalize" }}>{txn.type}</td>
                  <td style={styles.td}>{txn.accountFrom?.name || "-"}</td>
                  <td style={styles.td}>{txn.note || "-"}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: txn.type === "income" ? "#75dc85" : "#ff6b6b", textAlign: "right" }}>
                    {txn.type === "income" ? "+" : "-"}₹{txn.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {modalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Add New Transaction</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.typeSelector}>
                <button
                  type="button"
                  style={{...styles.typeButton, ...(transactionType === "expense" ? styles.typeButtonActive : {})}}
                  onClick={() => setTransactionType("expense")}
                >
                  Expense
                </button>
                <button
                  type="button"
                  style={{...styles.typeButton, ...(transactionType === "income" ? styles.typeButtonActive : {})}}
                  onClick={() => setTransactionType("income")}
                >
                  Income
                </button>
                <button
                  type="button"
                  style={{...styles.typeButton, ...(transactionType === "transfer" ? styles.typeButtonActive : {})}}
                  onClick={() => setTransactionType("transfer")}
                >
                  Transfer
                </button>
              </div>

              <label style={styles.formLabel}>
                Amount *
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  style={styles.formInput}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </label>

              {transactionType === "transfer" ? (
                <>
                  <label style={styles.formLabel}>
                    From Account *
                    <select
                      required
                      style={styles.formInput}
                      value={accountFrom}
                      onChange={(e) => setAccountFrom(e.target.value)}
                    >
                      <option value="">Select Account</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </label>

                  <label style={styles.formLabel}>
                    To Account *
                    <select
                      required
                      style={styles.formInput}
                      value={accountTo}
                      onChange={(e) => setAccountTo(e.target.value)}
                    >
                      <option value="">Select Account</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                <label style={styles.formLabel}>
                  Account *
                  <select
                    required
                    style={styles.formInput}
                    value={accountFrom}
                    onChange={(e) => setAccountFrom(e.target.value)}
                  >
                    <option value="">Select Account</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </label>
              )}

              <label style={styles.formLabel}>
                Note (Optional)
                <input
                  type="text"
                  style={styles.formInput}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Grocery shopping"
                />
              </label>

              <section style={styles.formButtons}>
                <button type="button" style={styles.cancelBtn} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  Add Transaction
                </button>
              </section>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}