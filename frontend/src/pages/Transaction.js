import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Plus, ChevronDown } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import "../styles/Transaction.css";

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const { categories } = useCategories();
  const [dateFilterType, setDateFilterType] = useState("range");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [accountFrom, setAccountFrom] = useState("");
  const [accountTo, setAccountTo] = useState("");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
    const date = new Date(dateStr);
    
    if (dateFilterType === "custom" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    }

    const today = new Date();
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
  }, [dateFilterType, dateRange, startDate, endDate]);

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
  }, [transactions, sortBy, filterByDateRange]);

  const openModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setTransactionType("expense");
    setAmount("");
    setAccountFrom("");
    setAccountTo("");
    setNote("");
    setSelectedDate("");
    setSelectedCategory("");
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

    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    if (transactionType === "transfer") {
      if (!accountFrom || !accountTo) {
        alert("Please select both accounts for transfer");
        return;
      }
      if (accountFrom === accountTo) {
        alert("Cannot transfer to the same account");
        return;
      }
    } else {
      if (!accountFrom) {
        alert("Please select an account");
        return;
      }
      if (!selectedCategory) {
        alert("Please select a category");
        return;
      }
    }

    let finalNote = note;
    if (transactionType !== "transfer" && selectedCategory) {
      finalNote = `[${selectedCategory}] ${note}`.trim();
    }

    const payload = {
      type: transactionType,
      amount: parseFloat(amount),
      accountFromId: accountFrom ? parseInt(accountFrom) : null,
      accountToId: accountTo ? parseInt(accountTo) : null,
      note: finalNote || null
    };

    try {
      await axios.post("http://localhost:8080/api/transactions", payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      await fetchTransactions();
      await fetchAccounts();
      window.dispatchEvent(new Event('expenseUpdated'));
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

  const extractCategory = (noteText) => {
    if (!noteText) return "-";
    const match = noteText.match(/^\[([^\]]+)\]/);
    return match ? match[1] : "-";
  };

  return (
    <div className="transaction-app">
      <Navbar />
      <main className="transaction-main-content">
        <div className="transaction-main-header">
          <h2 className="transaction-title">Transactions</h2>
          <button className="new-txn-btn" onClick={openModal}>
            <Plus />
            <span>New Transaction</span>
          </button>
        </div>

        <div className="transaction-filters">
          <div className="filter-item">
            <label htmlFor="dateFilterType">Filter:</label>
            <select 
              id="dateFilterType" 
              value={dateFilterType} 
              onChange={(e) => setDateFilterType(e.target.value)} 
              className="filter-select"
            >
              <option value="range">Quick Range</option>
              <option value="custom">Custom Dates</option>
            </select>
            <ChevronDown className="dropdown-icon" />
          </div>

          {dateFilterType === "range" ? (
            <div className="filter-item">
              <label htmlFor="dateRange">Period:</label>
              <select 
                id="dateRange" 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)} 
                className="filter-select"
              >
                <option>Last 30 days</option>
                <option>Last 60 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
              <ChevronDown className="dropdown-icon" />
            </div>
          ) : (
            <div className="date-range-inputs">
              <input
                type="date"
                className="date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />
              <span style={{ color: "#a3b8a5" }}>to</span>
              <input
                type="date"
                className="date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />
            </div>
          )}

          <div className="filter-item">
            <label htmlFor="sortBy">Sort:</label>
            <select 
              id="sortBy" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="filter-select"
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Highest Amount</option>
              <option>Lowest Amount</option>
            </select>
            <ChevronDown className="dropdown-icon" />
          </div>
        </div>

        <div className="table-wrapper">
          <div className="table-title">Recent Transactions</div>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Account</th>
                <th>Note</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No transactions found for the selected period.
                  </td>
                </tr>
              )}
              {filteredTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{formatDate(txn.date)}</td>
                  <td className="td-type">{txn.type}</td>
                  <td>{extractCategory(txn.note)}</td>
                  <td>{txn.accountFrom?.name || "-"}</td>
                  <td>{txn.note?.replace(/^\[[^\]]+\]\s*/, "") || "-"}</td>
                  <td className={`td-amount ${txn.type === "income" ? "amount-income" : "amount-expense"}`}>
                    {txn.type === "income" ? "+" : "-"}₹{txn.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add New Transaction</h3>
            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="type-selector">
                <button
                  type="button"
                  className={`type-button ${transactionType === "expense" ? "type-button-active" : ""}`}
                  onClick={() => setTransactionType("expense")}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`type-button ${transactionType === "income" ? "type-button-active" : ""}`}
                  onClick={() => setTransactionType("income")}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={`type-button ${transactionType === "transfer" ? "type-button-active" : ""}`}
                  onClick={() => setTransactionType("transfer")}
                >
                  Transfer
                </button>
              </div>

              <label>
                Date *
                <input
                  required
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </label>

              <label>
                Amount *
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </label>

              {transactionType === "transfer" ? (
                <>
                  <label>
                    From Account *
                    <select
                      required
                      value={accountFrom}
                      onChange={(e) => setAccountFrom(e.target.value)}
                    >
                      <option value="">Select Account</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    To Account *
                    <select
                      required
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
                <>
                  <label>
                    Account *
                    <select
                      required
                      value={accountFrom}
                      onChange={(e) => setAccountFrom(e.target.value)}
                    >
                      <option value="">Select Account</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Category *
                    <select
                      required
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              <label>
                Note (Optional)
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Grocery shopping at market"
                />
              </label>

              <section className="form-buttons">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
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