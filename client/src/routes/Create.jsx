import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Create.css";

const Create = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBudgetChange = (e) => {
    setBudget(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/budgets", {
        title,
        budget,
      });

      console.log("Budget created successfully:", response.data);

      navigate("/");
    } catch (error) {
      console.error("Error creating budget:", error);
    }
  };

  return (
    <div>
      <h2>Create a New Budget</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </label>
        <br />
        <label>
          Budget:
          <input
            type="number"
            value={budget}
            onChange={handleBudgetChange}
            required
          />
        </label>
        <br />
        <button type="submit">Create Budget</button>
      </form>
    </div>
  );
};

export default Create;