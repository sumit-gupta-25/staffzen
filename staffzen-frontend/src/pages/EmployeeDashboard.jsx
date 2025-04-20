import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Theme.css';

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/employee/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.log("Error fetching tasks", err);
      }
    };

    fetchTasks();
  }, [userId, navigate]);

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/update/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? res.data : task))
      );
    } catch (err) {
      console.log("Error updating task status", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>
  
      <section className="dashboard-section">
        <h2>Your Assigned Tasks</h2>
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks assigned yet.</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-card" key={task._id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: <strong>{task.status}</strong></p>
                <div className="task-buttons">
                  <button
                    className="status-btn"
                    onClick={() => handleStatusUpdate(task._id, "Completed")}
                    disabled={task.status === "Completed"}
                  >
                    Mark as Completed
                  </button>
                  <button
                    className="status-btn"
                    onClick={() => handleStatusUpdate(task._id, "Pending")}
                    disabled={task.status === "Pending"}
                  >
                    Mark as Pending
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
  
}
