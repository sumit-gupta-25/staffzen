import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect based on role if user already logged in
    const role = localStorage.getItem("role");
    if (role === "Manager") {
      navigate("/manager-dashboard");
    } else if (role === "Employee") {
      navigate("/employee-dashboard");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/manager-dashboard"
        element={
          <PrivateRoute role="Manager">
            <ManagerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/employee-dashboard"
        element={
          <PrivateRoute role="Employee">
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
