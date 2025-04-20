import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Theme.css';

export default function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [employees, setEmployees] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        });

        const employeeUsers = res.data.filter(user => user.role === "Employee");
        setEmployees(employeeUsers);
      } catch (err) {
        console.log("Error fetching employees", err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.log("Error fetching tasks", err);
      }
    };

    fetchEmployees();
    fetchTasks();
  }, []);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/tasks/create",
        { title: taskTitle, description: taskDescription, assignedTo },
        { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
      );

      setTaskTitle("");
      setTaskDescription("");
      setAssignedTo("");

      // Re-fetch tasks after assigning
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.log("Error assigning task", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="dashboard container">
      <header className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <h2>Assign a Task</h2>
      <form onSubmit={handleTaskSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
        />
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name}
            </option>
          ))}
        </select>
        <button type="submit">Assign Task</button>
      </form>

      <h2>Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks have been assigned yet.</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>
              Assigned to:{" "}
              {typeof task.assignedTo === "object"
                ? task.assignedTo.name
                : employees.find((emp) => emp._id === task.assignedTo)?.name || "Unknown"}
            </p>
            <p>Status: <strong>{task.status}</strong></p>
          </div>
        ))
      )}
    </div>
  );
}
