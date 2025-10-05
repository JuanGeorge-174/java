// Replace your entire BudgetsPage.js with this code
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Plus,
  Utensils,
  ShoppingBag,
  Clapperboard,
  Car,
  ShoppingCart,
} from "lucide-react";
import { useCategories } from "../hooks/useCategories";

const iconMap = {
  Dining: Utensils,
  Groceries: ShoppingBag,
  Entertainment: Clapperboard,
  Transportation: Car,
  Shopping: ShoppingCart,
};

export default function BudgetsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newBudgetLimit, setNewBudgetLimit] = useState("");
  const [editBudgetCategory, setEditBudgetCategory] = useState("");
  const [editBudgetLimit, setEditBudgetLimit] = useState("");
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const { categories } = useCategories();

  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
    
    // Listen for transaction updates
    const handleUpdate = () => {
      fetchTransactions();
    };
    window.addEventListener('expenseUpdated', handleUpdate);
    return () => window.removeEventListener('expenseUpdated', handleUpdate);
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get("http://localhost:8080/api/budgets", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBudgets(res.data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

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

  const calculateSpending = (categoryName) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
      .filter(txn => {
        if (txn.type !== 'expense') return false;
        const txnDate = new Date(txn.date);
        return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
      })
      .filter(txn => {
        if (!txn.note) return false;
        const match = txn.note.match(/^\[([^\]]+)\]/);
        return match && match[1] === categoryName;
      })
      .reduce((sum, txn) => sum + txn.amount, 0);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 95) return "#dc2626";
    if (percentage >= 75) return "#ff8c42";
    return "#75dc85";
  };

  const getPercentage = (spent, limit) => {
    if (limit === 0) return 0;
    return Math.min(Math.round((spent / limit) * 100), 100);
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first");
      return;
    }

    // Check if budget already exists for this category
    const existingBudget = budgets.find(b => b.name === newBudgetCategory);
    if (existingBudget) {
      alert(`A budget for "${newBudgetCategory}" already exists. Please edit the existing budget instead.`);
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/budgets", {
        name: newBudgetCategory,
        amount: parseFloat(newBudgetLimit),
        period: "monthly",
        alertThresholdPercent: 80
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      await fetchBudgets();
      window.dispatchEvent(new Event('budgetUpdated'));
      closeModal();
    } catch (err) {
      console.error("Error adding budget:", err);
      alert("Failed to add budget");
    }
  };

  const handleEditBudget = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.put(`http://localhost:8080/api/budgets/${editingBudgetId}`, {
        name: editBudgetCategory,
        amount: parseFloat(editBudgetLimit),
        period: "monthly",
        alertThresholdPercent: 80
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      await fetchBudgets();
      window.dispatchEvent(new Event('budgetUpdated'));
      closeEditModal();
    } catch (err) {
      console.error("Error updating budget:", err);
      alert("Failed to update budget");
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (!window.confirm("Are you sure?")) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8080/api/budgets/${budgetId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchBudgets();
      window.dispatchEvent(new Event('budgetUpdated'));
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setNewBudgetCategory("");
    setNewBudgetLimit("");
  };

  const openEditModal = (budget) => {
    setEditingBudgetId(budget.id);
    setEditBudgetCategory(budget.name);
    setEditBudgetLimit(budget.amount.toString());
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingBudgetId(null);
    setEditBudgetCategory("");
    setEditBudgetLimit("");
    setEditModalOpen(false);
  };

  const styles = {
    app: { minHeight: "100vh", backgroundColor: "#1a241d", fontFamily: "sans-serif", color: "#a3b8a5", display: "flex", flexDirection: "column", alignItems: "center" },
    contentWrapper: { marginTop: 80, width: "95vw", maxWidth: 1200, padding: "0 32px 48px", boxSizing: "border-box" },
    pageHeader: { marginBottom: 48 },
    pageTitle: { fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 12 },
    pageSubtext: { fontSize: 16, color: "#89a594" },
    limitsHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
    limitsTitle: { fontSize: 22, fontWeight: 600, color: "#ddd" },
    addButton: { backgroundColor: "#75dc85", border: "none", padding: "12px 24px", borderRadius: 8, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#152018" },
    budgetList: { display: "flex", flexDirection: "column", gap: 16 },
    budgetItem: { backgroundColor: "#222936", borderRadius: 12, padding: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.4)" },
    budgetItemHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    budgetItemInfo: { display: "flex", alignItems: "center", gap: 16 },
    budgetIconWrapper: { width: 48, height: 48, backgroundColor: "#152018", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
    budgetCategory: { fontSize: 18, fontWeight: 600, color: "#fff" },
    budgetAmount: { fontSize: 14, color: "#89a594" },
    percentageText: { fontSize: 20, fontWeight: "bold", color: "#ddd" },
    progressBar: { width: "100%", height: 12, backgroundColor: "#374151", borderRadius: 6, overflow: "hidden" },
    progressFill: { height: "100%", transition: "width 0.3s ease" },
    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(26, 36, 29, 0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 200 },
    modalContent: { backgroundColor: "#222936", borderRadius: 14, padding: 32, width: 400, boxSizing: "border-box", color: "#ddd" },
    modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
    modalLabel: { display: "block", marginBottom: 8, fontWeight: 600 },
    modalInput: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #25633d", backgroundColor: "#152018", color: "#ddd", fontSize: 16, marginBottom: 20, boxSizing: "border-box" },
    modalButtons: { display: "flex", justifyContent: "flex-end", gap: 12 },
    modalCancelButton: { padding: "10px 24px", borderRadius: 8, border: "1px solid #a3b8a5", backgroundColor: "transparent", color: "#a3b8a5", cursor: "pointer", fontWeight: "bold" },
    modalSaveButton: { padding: "10px 24px", borderRadius: 8, border: "none", backgroundColor: "#75dc85", color: "#152018", cursor: "pointer", fontWeight: "bold" },
    deleteButton: { padding: "8px 16px", borderRadius: 6, border: "none", backgroundColor: "#dc2626", color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: 14, marginTop: 12 },
    editableArea: { cursor: "pointer" }
  };

  return (
    <div style={styles.app}>
      <Navbar />
      <main style={styles.contentWrapper}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Budgets</h1>
          <p style={styles.pageSubtext}>Set and manage your spending limits for different categories.</p>
        </div>

        <div style={styles.limitsHeader}>
          <h2 style={styles.limitsTitle}>Spending Limits</h2>
          <button style={styles.addButton} onClick={openModal}>
            <Plus size={20} />
            Add New Budget
          </button>
        </div>

        <div style={styles.budgetList}>
          {budgets.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#89a594" }}>
              No budgets yet. Click "Add New Budget" to create one.
            </div>
          ) : (
            budgets.map((budget) => {
              const Icon = iconMap[budget.name] || ShoppingBag;
              const spent = calculateSpending(budget.name);
              const percentage = getPercentage(spent, budget.amount);
              const progressColor = getProgressColor(percentage);

              return (
                <div key={budget.id} style={styles.budgetItem}>
                  <div style={styles.editableArea} onClick={() => openEditModal(budget)}>
                    <div style={styles.budgetItemHeader}>
                      <div style={styles.budgetItemInfo}>
                        <div style={styles.budgetIconWrapper}>
                          <Icon size={22} color="#75dc85" />
                        </div>
                        <div>
                          <h3 style={styles.budgetCategory}>{budget.name}</h3>
                          <p style={styles.budgetAmount}>
                            ₹{spent.toFixed(2)} / ₹{budget.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div style={styles.percentageText}>{percentage}%</div>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressFill, width: `${percentage}%`, backgroundColor: progressColor }} />
                    </div>
                  </div>
                  <button style={styles.deleteButton} onClick={(e) => { e.stopPropagation(); handleDeleteBudget(budget.id); }}>
                    Delete Budget
                  </button>
                </div>
              );
            })
          )}
        </div>

        {modalOpen && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>Add New Budget</h2>
              <form onSubmit={handleAddBudget}>
                <label htmlFor="budgetCategory" style={styles.modalLabel}>Category *</label>
                <select id="budgetCategory" style={styles.modalInput} value={newBudgetCategory} onChange={(e) => setNewBudgetCategory(e.target.value)} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
                <label htmlFor="budgetLimit" style={styles.modalLabel}>Spending Limit *</label>
                <input id="budgetLimit" type="number" style={styles.modalInput} value={newBudgetLimit} onChange={(e) => setNewBudgetLimit(e.target.value)} placeholder="e.g. 500" min="0" step="0.01" required />
                <div style={styles.modalButtons}>
                  <button type="button" style={styles.modalCancelButton} onClick={closeModal}>Cancel</button>
                  <button type="submit" style={styles.modalSaveButton}>Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editModalOpen && (
          <div style={styles.modalOverlay} onClick={closeEditModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>Edit Budget</h2>
              <form onSubmit={handleEditBudget}>
                <label htmlFor="editBudgetCategory" style={styles.modalLabel}>Category *</label>
                <select id="editBudgetCategory" style={styles.modalInput} value={editBudgetCategory} onChange={(e) => setEditBudgetCategory(e.target.value)} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
                <label htmlFor="editBudgetLimit" style={styles.modalLabel}>Spending Limit *</label>
                <input id="editBudgetLimit" type="number" style={styles.modalInput} value={editBudgetLimit} onChange={(e) => setEditBudgetLimit(e.target.value)} min="0" step="0.01" required />
                <div style={styles.modalButtons}>
                  <button type="button" style={styles.modalCancelButton} onClick={closeEditModal}>Cancel</button>
                  <button type="submit" style={styles.modalSaveButton}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}