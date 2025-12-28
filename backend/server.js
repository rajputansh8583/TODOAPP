const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/tododb")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const TaskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", TaskSchema);

// Routes
app.get("/tasks", async (req, res) => {
  res.json(await Task.find());
});

app.post("/tasks", async (req, res) => {
  const task = new Task({ title: req.body.title });
  await task.save();
  res.json(task);
});

app.put("/tasks/:id", async (req, res) => {
  res.json(
    await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
