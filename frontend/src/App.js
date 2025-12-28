import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const [filter, setFilter] = useState("all"); // all | active | completed
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/tasks");
    setTasks(res.data);
  };

  // Add task
  const addTask = async () => {
    if (!title.trim()) return;
    await axios.post("http://localhost:5000/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  // Toggle completed
  const toggleTask = async (task) => {
    await axios.put(`http://localhost:5000/tasks/${task._id}`, {
      completed: !task.completed,
    });
    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  // Start editing
  const startEdit = (task) => {
    setEditId(task._id);
    setEditText(task.title);
  };

  // Save edited task
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    await axios.put(`http://localhost:5000/tasks/${id}`, {
      title: editText,
    });
    setEditId(null);
    setEditText("");
    fetchTasks();
  };

  // Filter logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="container">
      <h2>📝 To-Do Web App</h2>

      {/* Add Task */}
      <div className="input-group">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
        />
        <button className="add-btn" onClick={addTask}>
          Add
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>

      {/* Task List */}
      <ul>
        {filteredTasks.map((task) => (
          <li key={task._id}>
            {editId === task._id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(task._id)}>💾</button>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleTask(task)}
                  className={task.completed ? "done" : ""}
                >
                  {task.title}
                </span>
                <div>
                  <button onClick={() => startEdit(task)}>✏️</button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    ❌
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
