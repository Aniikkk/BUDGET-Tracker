const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

app.use(express.json());
app.use(cors());

client.connect((err) => {
  if (err) {
    console.error("Error connecting to database", err);
  } else {
    console.log("Connected to MongoDB");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get("/budgets", async (req, res) => {
  try {
    const db = client.db("test");
    const collection = db.collection("budgets");
    const items = await collection.find({}).toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/budgets", async (req, res) => {
  try {
    const { title, budget } = req.body;
    const db = client.db("test");
    const collection = db.collection("budgets");
    const result = await collection.insertOne({ title, budget });

    if (result.acknowledged) {
      res.status(201).json({
        message: "Budget created successfully",
        budgetId: result.insertedId,
      });
    } else {
      console.error("Failed to insert budget into the database");
      res.status(500).json({ error: "Failed to create budget" });
    }
  } catch (err) {
    console.error("Error creating budget:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/budgets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db("test");
    const collection = db.collection("budgets");
    const budget = await collection.findOne({ _id: new ObjectId(id) });
    if (budget) {
      res.json(budget);
    } else {
      res.status(404).json({ error: "Budget not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/budgets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newBudget = parseInt(req.body.budget);
    const db = client.db("test");
    const collection = db.collection("budgets");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { budget: newBudget } },
    );

    if (result.acknowledged) {
      res.json({ message: "Budget modified successfully" });
    } else {
      res.status(404).json({ error: "Budget not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/expenses/:budgetId", async (req, res) => {
  try {
    const { budgetId } = req.params;
    const db = client.db("test");
    const collection = db.collection("expenses");
    const items = await collection
      .find({ budgetId: new ObjectId(budgetId) })
      .toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/expenses/:budgetId", async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { title, amount } = req.body;
    const db = client.db("test");
    const collection = db.collection("expenses");
    const result = await collection.insertOne({
      budgetId: new ObjectId(budgetId),
      title,
      amount,
    });

    if (result.acknowledged) {
      res.status(201).json({
        message: "Expense created successfully",
        expenseId: result.insertedId,
      });
    } else {
      console.error("Failed to insert expense into the database");
      res.status(500).json({ error: "Failed to create expense" });
    }
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/budgets/:budgetId", async (req, res) => {
  try {
    const { budgetId } = req.params;
    const db = client.db("test");

    const expensesCollection = db.collection("expenses");
    await expensesCollection.deleteMany({ budgetId: new ObjectId(budgetId) });

    const budgetsCollection = db.collection("budgets");
    const result = await budgetsCollection.deleteOne({
      _id: new ObjectId(budgetId),
    });

    if (result.deletedCount === 1) {
      res.json({
        message: "Budget and associated expenses deleted successfully",
      });
    } else {
      res.status(404).json({ error: "Budget not found" });
    }
  } catch (err) {
    console.error("Error deleting budget and expenses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/expenses/:expenseId", async (req, res) => {
  try {
    const { expenseId } = req.params;
    const db = client.db("test");
    const collection = db.collection("expenses");
    const result = await collection.deleteOne({ _id: new ObjectId(expenseId) });

    if (result.acknowledged) {
      res.json({ message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
