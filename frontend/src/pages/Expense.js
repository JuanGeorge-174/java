import React, { useState } from "react";
import Navbar from "../components/Navbar";
const categories = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Healthcare",
  "Travel",
  "Other"
];

function Expense() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  return (
     <div className="min-h-screen bg-[#152018] text-white">
      <Navbar />
    <div style={{ backgroundColor: "#171F18", color: "#d0d6c1", padding: "20px", borderRadius: "10px", maxWidth: "720px" }}>
     
      <h2 style={{ color: "#fff", fontWeight: "bold" }}>Add New Expense</h2>
      <p>Log your spending to keep track of your finances.</p>

      <form>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="amount" style={{ fontWeight: "500" }}>Amount</label>
            <input
              id="amount"
              type="number"
              placeholder="$ 0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#222c20",
                border: "1px solid #31452a",
                borderRadius: "4px",
                padding: "8px 10px",
                color: "#fff",
                fontSize: "16px"
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="category" style={{ fontWeight: "500" }}>Category</label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#222c20",
                border: "1px solid #31452a",
                borderRadius: "4px",
                padding: "8px 10px",
                color: category ? "#fff" : "#8a8a8a",
                fontSize: "16px"
              }}
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <label htmlFor="date" style={{ fontWeight: "500" }}>Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "#222c20",
              border: "1px solid #31452a",
              borderRadius: "4px",
              padding: "8px 10px",
              color: "#fff",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <label htmlFor="description" style={{ fontWeight: "500" }}>Description</label>
          <textarea
            id="description"
            placeholder="Enter a brief description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              backgroundColor: "#222c20",
              border: "1px solid #31452a",
              borderRadius: "4px",
              padding: "8px 10px",
              color: "#fff",
              fontSize: "16px",
              resize: "vertical"
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "24px",
            backgroundColor: "#75dc85",
            border: "none",
            borderRadius: "4px",
            color: "#152018",
            fontWeight: "bold",
            fontSize: "18px",
            padding: "12px 0",
            width: "150px",
            cursor: "pointer"
          }}
        >
          Add Expense
        </button>
      </form>
    </div>
    </div>
  );
}

export default Expense;
