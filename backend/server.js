const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const TaskSchema = new mongoose.Schema({
  text: String,
  category: String,
});

const Task = mongoose.model("Task", TaskSchema);

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task({
      text: req.body.text,
      category: req.body.category,
    });

    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error adding task" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { category: req.body.category },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
