import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Bell,
  Plus,
  Utensils,
  ShoppingBag,
  Clapperboard,
  Car,
  ShoppingCart,
} from "lucide-react";

export default function BudgetsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newBudgetLimit, setNewBudgetLimit] = useState("");
  const [editBudgetCategory, setEditBudgetCategory] = useState("");
  const [editBudgetLimit, setEditBudgetLimit] = useState("");
  const [editingBudgetId, setEditingBudgetId] = useState(null);

  const [budgets, setBudgets] = useState([
    { id: 1, category: "Dining", spent: 340.9, limit: 500.0, icon: Utensils },
    { id: 2, category: "Groceries", spent: 482.95, limit: 500.0, icon: ShoppingBag },
    { id: 3, category: "Entertainment", spent: 102.27, limit: 300.0, icon: Clapperboard },
    { id: 4, category: "Transportation", spent: 159.09, limit: 200.0, icon: Car },
    { id: 5, category: "Shopping", spent: 229.5, limit: 450.0, icon: ShoppingCart },
  ]);

  const getProgressColor = (percentage) => {
    if (percentage >= 95) return "#cbd8cc"; // yellow-grayish
    if (percentage >= 75) return "#ff8c42"; // orange
    return "#75dc85"; // green
  };

  const getPercentage = (spent, limit) => Math.round((spent / limit) * 100);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setNewBudgetCategory("");
    setNewBudgetLimit("");
  };

  const openEditModal = (budget) => {
    setEditingBudgetId(budget.id);
    setEditBudgetCategory(budget.category);
    setEditBudgetLimit(budget.limit.toString());
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingBudgetId(null);
    setEditBudgetCategory("");
    setEditBudgetLimit("");
    setEditModalOpen(false);
  };

  const handleAddBudget = (e) => {
    e.preventDefault();

    const newBudget = {
      id: budgets.length + 1,
      category: newBudgetCategory,
      spent: 0,
      limit: parseFloat(newBudgetLimit),
      icon: ShoppingBag, // default icon for simplicity
    };
    setBudgets((prev) => [...prev, newBudget]);
    closeModal();
  };

  const handleEditBudget = (e) => {
    e.preventDefault();

    setBudgets((prevBudgets) =>
      prevBudgets.map((b) =>
        b.id === editingBudgetId
          ? {
              ...b,
              category: editBudgetCategory,
              limit: parseFloat(editBudgetLimit),
            }
          : b
      )
    );
    closeEditModal();
  };

  const styles = {
    app: {
      minHeight: "100vh",
      backgroundColor: "#1a241d",
      fontFamily: "sans-serif",
      color: "#a3b8a5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    navbar: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 64,
      backgroundColor: "#152018",
      borderBottom: "1px solid #374151",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 40px",
      zIndex: 1000,
    },
    navbarGroup: {
      display: "flex",
      alignItems: "center",
      gap: 32,
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      color: "#ddd",
      fontWeight: "bold",
      fontSize: 20,
    },
    navLinks: {
      display: "flex",
      gap: 24,
    },
    navLink: {
      color: "#89a594",
      textDecoration: "none",
    },
    navLinkActive: {
      color: "#75dc85",
      fontWeight: 600,
      textDecoration: "none",
    },
    userControls: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      color: "#a3b8a5",
      cursor: "pointer",
      background: "none",
      border: "none",
    },
    userAvatarWrapper: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: "#222936",
      overflow: "hidden",
    },
    userAvatar: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    contentWrapper: {
      marginTop: 80,
      width: "95vw",
      maxWidth: 1200,
      padding: "0 32px 48px",
      boxSizing: "border-box",
    },
    pageHeader: { marginBottom: 48 },
    pageTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 12,
    },
    pageSubtext: { fontSize: 16, color: "#89a594" },
    limitsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 32,
    },
    limitsTitle: { fontSize: 22, fontWeight: 600, color: "#ddd" },
    addButton: {
      backgroundColor: "#75dc85",
      border: "none",
      padding: "12px 24px",
      borderRadius: 8,
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "#152018",
    },
    budgetList: { display: "flex", flexDirection: "column", gap: 16 },
    budgetItem: {
      backgroundColor: "#222936",
      borderRadius: 12,
      padding: 20,
      boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
      cursor: "pointer",
    },
    budgetItemHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    budgetItemInfo: { display: "flex", alignItems: "center", gap: 16 },
    budgetIconWrapper: {
      width: 48,
      height: 48,
      backgroundColor: "#152018",
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    budgetCategory: { fontSize: 18, fontWeight: 600, color: "#fff" },
    budgetAmount: { fontSize: 14, color: "#89a594" },
    percentageText: { fontSize: 20, fontWeight: "bold", color: "#ddd" },
    progressBar: {
      width: "100%",
      height: 12,
      backgroundColor: "#374151",
      borderRadius: 6,
      overflow: "hidden",
    },
    progressFill: { height: "100%", transition: "width 0.3s ease" },
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
      zIndex: 200,
    },
    modalContent: {
      backgroundColor: "#222936",
      borderRadius: 14,
      padding: 32,
      width: 400,
      boxSizing: "border-box",
      color: "#ddd",
    },
    modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
    modalLabel: { display: "block", marginBottom: 8, fontWeight: 600 },
    modalInput: {
      width: "100%",
      padding: "8px 12px",
      borderRadius: 8,
      border: "1px solid #25633d",
      backgroundColor: "#152018",
      color: "#ddd",
      fontSize: 16,
      marginBottom: 20,
      boxSizing: "border-box",
    },
    modalButtons: { display: "flex", justifyContent: "flex-end", gap: 12 },
    modalCancelButton: {
      padding: "10px 24px",
      borderRadius: 8,
      border: "1px solid #a3b8a5",
      backgroundColor: "transparent",
      color: "#a3b8a5",
      cursor: "pointer",
      fontWeight: "bold",
      userSelect: "none",
    },
    modalSaveButton: {
      padding: "10px 24px",
      borderRadius: 8,
      border: "none",
      backgroundColor: "#75dc85",
      color: "#152018",
      cursor: "pointer",
      fontWeight: "bold",
      userSelect: "none",
    },
  };

  return (
    <div style={styles.app}>
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main style={styles.contentWrapper}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Budgets</h1>
          <p style={styles.pageSubtext}>Set and manage your spending limits for different categories.</p>
        </div>

        {/* Spending Limits Header */}
        <div style={styles.limitsHeader}>
          <h2 style={styles.limitsTitle}>Spending Limits</h2>
          <button style={styles.addButton} onClick={openModal}>
            <Plus size={20} />
            Add New Budget
          </button>
        </div>

        {/* Budget Items List */}
        <div style={styles.budgetList}>
          {budgets.map((budget) => {
            const Icon = budget.icon;
            const percentage = getPercentage(budget.spent, budget.limit);
            const progressColor = getProgressColor(percentage);

            return (
              <div key={budget.id} style={styles.budgetItem} onClick={() => openEditModal(budget)}>
                <div style={styles.budgetItemHeader}>
                  <div style={styles.budgetItemInfo}>
                    <div style={styles.budgetIconWrapper}>
                      <Icon size={22} color="#75dc85" />
                    </div>
                    <div>
                      <h3 style={styles.budgetCategory}>{budget.category}</h3>
                      <p style={styles.budgetAmount}>
                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div style={styles.percentageText}>{percentage}%</div>
                </div>

                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${Math.min(percentage, 100)}%`, backgroundColor: progressColor }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for adding budget */}
        {modalOpen && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>Add New Budget</h2>
              <form onSubmit={handleAddBudget}>
                <label htmlFor="budgetCategory" style={styles.modalLabel}>
                  Category
                </label>
                <input
                  id="budgetCategory"
                  type="text"
                  style={styles.modalInput}
                  value={newBudgetCategory}
                  onChange={(e) => setNewBudgetCategory(e.target.value)}
                  placeholder="e.g. Dining"
                  required
                />

                <label htmlFor="budgetLimit" style={styles.modalLabel}>
                  Spending Limit
                </label>
                <input
                  id="budgetLimit"
                  type="number"
                  style={styles.modalInput}
                  value={newBudgetLimit}
                  onChange={(e) => setNewBudgetLimit(e.target.value)}
                  placeholder="e.g. 500"
                  min="0"
                  step="0.01"
                  required
                />

                <div style={styles.modalButtons}>
                  <button type="button" style={{ ...styles.modalButton, ...styles.modalCancelButton }} onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" style={{ ...styles.modalButton, ...styles.modalSaveButton }}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for editing budget */}
        {editModalOpen && (
          <div style={styles.modalOverlay} onClick={closeEditModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>Edit Budget</h2>
              <form onSubmit={handleEditBudget}>
                <label htmlFor="editBudgetCategory" style={styles.modalLabel}>
                  Category
                </label>
                <input
                  id="editBudgetCategory"
                  type="text"
                  style={styles.modalInput}
                  value={editBudgetCategory}
                  onChange={(e) => setEditBudgetCategory(e.target.value)}
                  required
                />

                <label htmlFor="editBudgetLimit" style={styles.modalLabel}>
                  Spending Limit
                </label>
                <input
                  id="editBudgetLimit"
                  type="number"
                  style={styles.modalInput}
                  value={editBudgetLimit}
                  onChange={(e) => setEditBudgetLimit(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />

                <div style={styles.modalButtons}>
                  <button type="button" style={{ ...styles.modalButton, ...styles.modalCancelButton }} onClick={closeEditModal}>
                    Cancel
                  </button>
                  <button type="submit" style={{ ...styles.modalButton, ...styles.modalSaveButton }}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
