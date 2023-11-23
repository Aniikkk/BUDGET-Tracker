import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

const Home = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get("http://localhost:3000/budgets");
        setBudgets(response.data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const handleDeleteBudget = async (budgetId) => {
    try {
      await axios.delete(`http://localhost:3000/budgets/${budgetId}`);
      setBudgets((prevBudgets) =>
        prevBudgets.filter((budget) => budget._id !== budgetId)
      );
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };
  return (
    <div className="budget-container">
      <h2>BUDGETS</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="budget-list">
          {budgets.map((budget) => (
            <li key={budget._id}>
              <Link to={`/budget/${budget._id}`}>{budget.title}</Link>
              <button onClick={() => handleDeleteBudget(budget._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
