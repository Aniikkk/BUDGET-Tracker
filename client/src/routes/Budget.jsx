import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Budget.css";

function Budget() {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [newExpenseTitle, setNewExpenseTitle] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [increaseSavingsAmount, setIncreaseSavingsAmount] = useState("");
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchBudgetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/budgets/${id}`);
        setBudget(response.data);
      } catch (error) {
        console.error("Error fetching budget details:", error);
      }
    };

    fetchBudgetDetails();
  }, [id]);

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/expenses/${id}`,
        );
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching budget details:", error);
      }
    };

    fetchExpenseDetails();
  }, [id]);

  const handleAddExpense = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/expenses/${id}`,
        {
          title: newExpenseTitle,
          amount: newExpenseAmount,
        },
      );
      setExpenses([...expenses, response.data]);
      setNewExpenseTitle("");
      setNewExpenseAmount("");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await axios.delete(`http://localhost:3000/expenses/${expenseId}`);
      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleIncreaseSavings = async () => {
    try {
      await axios.put(`http://localhost:3000/budgets/${id}`, {
        budget: budget.budget + parseInt(increaseSavingsAmount),
      });
      setBudget({
        ...budget,
        savings: budget.savings + parseInt(increaseSavingsAmount),
      });
      setIncreaseSavingsAmount("");
    } catch (error) {
      console.error("Error increasing savings:", error);
    }
  };

  return (
    <>
      {budget && (
        <>
          <h1>
            {budget.title} : {budget.budget}
          </h1>
          <form onSubmit={handleAddExpense}>
            <label>
              Title:
              <input
                type="text"
                value={newExpenseTitle}
                onChange={(e) => setNewExpenseTitle(e.target.value)}
                required
              />
            </label>
            <label>
              Amount:
              <input
                type="number"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
                required
              />
            </label>
            <button type="submit">Add Expense</button>
          </form>
          {expenses.length > 0 ? (
            <ul>
              {expenses.map((expense) => (
                <li key={expense._id}>
                  <p>{expense.title}</p>
                  <p>{expense.amount}</p>
                  <button onClick={() => handleDeleteExpense(expense._id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No expenses added yet.</p>
          )}
          <form onSubmit={handleIncreaseSavings}>
            <label>
              Increase Savings:
              <input
                type="number"
                value={increaseSavingsAmount}
                onChange={(e) => setIncreaseSavingsAmount(e.target.value)}
                required
              />
            </label>
            <button type="submit">Increase Savings</button>
          </form>
        </>
      )}
    </>
  );
}

export default Budget;
