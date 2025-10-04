import React from "react";

function ExpenseList({ expenses, onDelete }) {
  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense.id}>
          {expense.name}: ${expense.amount}{" "}
          <button onClick={() => onDelete(expense.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;
