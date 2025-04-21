import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Theme.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://staffzen-backend-production.up.railway.app/api/login", formData);
      
      const { token, user } = res.data;
      const role = user.role;
      const userId = user.id; // Assuming the response has user ID in `user.id`

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId); // Save userId for future use

      // Navigate based on role
      if (role === "Manager") {
        navigate("/manager-dashboard");
      } else if (role === "Employee") {
        navigate("/employee-dashboard");
      } else {
        alert("Unknown role. Contact admin.");
      }

    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};


export default Login;


