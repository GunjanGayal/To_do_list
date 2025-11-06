// ✅ server.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const DATA_FILE = "./data.json";

// ✅ Middleware setup
app.use(cors());
app.use(bodyParser.json());

// ✅ Ensure data.json exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
}

// ✅ Helper to read & write data
function readData() {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data || "[]");
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ✅ GET: Fetch all tasks
app.get("/tasks", (req, res) => {
  const tasks = readData();
  res.json(tasks);
});

// ✅ POST: Add new task
app.post("/tasks", (req, res) => {
  const tasks = readData();
  const newTask = req.body;
  tasks.push(newTask);
  writeData(tasks);
  res.status(201).json({ message: "Task added", task: newTask });
});

// ✅ DELETE: Delete task by index
app.delete("/tasks/:index", (req, res) => {
  const tasks = readData();
  const index = parseInt(req.params.index);

  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    writeData(tasks);
    res.json({ message: "Task deleted" });
  } else {
    res.status(404).json({ error: "Invalid index" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});