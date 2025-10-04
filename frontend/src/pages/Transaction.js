import React, { useState, useMemo } from "react";
import Navbar from "../components/Navbar"; // Your existing Navbar component
import { Search, Plus, Bell, ChevronDown } from "lucide-react";
  import { useCallback } from "react";

export default function Transaction() {
  // State for transactions
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2024-07-26", description: "Grocery shopping at Local Market", category: "Groceries", amount: -120.5 },
    { id: 2, date: "2024-07-25", description: "Dinner at The Italian Place", category: "Dining", amount: -75.0 },
    { id: 3, date: "2024-07-24", description: "Gas for car", category: "Transportation", amount: -45.0 },
    { id: 4, date: "2024-07-23", description: "Online shopping at Fashion Hub", category: "Shopping", amount: -250.0 },
    { id: 5, date: "2024-07-22", description: "Coffee at Coffee Corner", category: "Coffee", amount: -5.5 },
    { id: 6, date: "2024-07-21", description: "Movie tickets", category: "Entertainment", amount: -30.0 },
  ]);

  // Form/filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // Modal toggle and form inputs
  const [modalOpen, setModalOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("Groceries");
  const [newAmount, setNewAmount] = useState("");

  // Filtering helper

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

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(
        (txn) =>
          (category === "All" || txn.category === category) &&
          filterByDateRange(txn.date) &&
          (txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === "Newest") return new Date(b.date) - new Date(a.date);
        if (sortBy === "Oldest") return new Date(a.date) - new Date(b.date);
        if (sortBy === "Highest Amount") return b.amount - a.amount;
        if (sortBy === "Lowest Amount") return a.amount - b.amount;
        return 0;
      });
  }, [category, searchQuery, sortBy, transactions, filterByDateRange]);

  // Modal handlers
  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setNewDate("");
    setNewDescription("");
    setNewCategory("Groceries");
    setNewAmount("");
  };

  // Handle new transaction submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDate || !newDescription || newAmount === "") {
      alert("Please fill all fields");
      return;
    }
    const newTxn = {
      id: Date.now(),
      date: newDate,
      description: newDescription,
      category: newCategory,
      amount: Number(newAmount),
    };
    setTransactions((prev) => [newTxn, ...prev]);
    closeModal();
  };

  // Inline styles matching your expense.css scheme
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
    newTxnBtnHover: {
      backgroundColor: "#64c575",
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
    tr: {
      borderBottom: "1px solid #3a424c",
    },
    trHover: {
      backgroundColor: "#25633d",
    },
    td: {
      padding: "14px 0",
      fontSize: "1.1rem",
      color: "#a3b8a5",
    },
    tdAmount: {
      fontWeight: 600,
      color: "#75dc85", // green color for amount
      textAlign: "right",
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
      width: 400,
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
  };


  return (
    <div style={styles.app}>
      <Navbar />
      <main style={styles.mainContent}>
        <div style={styles.mainHeader}>
          <h2 style={styles.title}>Transactions</h2>
          <button style={styles.newTxnBtn} onClick={openModal} aria-label="Add new transaction">
            <Plus />
            <span style={{ marginLeft: 8 }}>New Transaction</span>
          </button>
        </div>

        <div style={styles.searchWrapper}>
          <Search style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search transactions by description, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search transactions"
          />
        </div>

        <div style={styles.filters}>
          <div style={{ ...styles.filterItem, position: "relative" }}>
            <label htmlFor="dateRange" style={{ color: "#a3b8a5" }}>
              Date Range:
            </label>
            <select
  id="dateRange"
  value={dateRange}
  onChange={(e) => setDateRange(e.target.value)}
  style={styles.select}
>
  <option>Last 30 days</option>
  <option>Last 60 days</option>
  <option>Last 90 days</option>
  <option>This year</option>
</select>
            <ChevronDown style={styles.dropdownIcon} />
            
          </div>

          <div style={{ ...styles.filterItem, position: "relative" }}>
            <label htmlFor="category" style={{ color: "#a3b8a5" }}>
              Category:
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              <option>All</option>
              <option>Groceries</option>
              <option>Dining</option>
              <option>Transportation</option>
              <option>Shopping</option>
              <option>Coffee</option>
              <option>Entertainment</option>
            </select>
            <ChevronDown style={styles.dropdownIcon} />
          </div>

          <div style={{ ...styles.filterItem, position: "relative" }}>
            <label htmlFor="sortBy" style={{ color: "#a3b8a5" }}>
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.select}
            >
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
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Category</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ ...styles.td, textAlign: "center" }}>
                    No transactions found.
                  </td>
                </tr>
              )}
              {filteredTransactions.map((txn, idx) => (
                <tr key={txn.id} style={{ borderBottom: idx === filteredTransactions.length - 1 ? "none" : "1px solid #3a424c" }}>
                  <td style={styles.td}>{txn.date}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: "#c8d6c9" }}>{txn.description}</td>
                  <td style={{ ...styles.td, color: "#a3b8a5" }}>{txn.category}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: "#75dc85", textAlign: "right" }}>
                    ${Math.abs(txn.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {modalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal} role="dialog" aria-modal="true">
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Add New Transaction</h3>
            <form onSubmit={handleSubmit}>
              <label style={styles.formLabel}>
                Date:
                <input
                  required
                  type="date"
                  style={styles.formInput}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </label>
              <label style={styles.formLabel}>
                Description:
                <input
                  required
                  type="text"
                  style={styles.formInput}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </label>
              <label style={styles.formLabel}>
                Category:
                <select
                  style={styles.formInput}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option>Groceries</option>
                  <option>Dining</option>
                  <option>Transportation</option>
                  <option>Shopping</option>
                  <option>Coffee</option>
                  <option>Entertainment</option>
                </select>
              </label>
              <label style={styles.formLabel}>
                Amount:
                <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="Use negative for expense"
                  style={styles.formInput}
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </label>
              <section style={styles.formButtons}>
                <button type="submit" style={styles.submitBtn}>
                  Add
                </button>
                <button type="button" style={styles.cancelBtn} onClick={closeModal}>
                  Cancel
                </button>
              </section>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
