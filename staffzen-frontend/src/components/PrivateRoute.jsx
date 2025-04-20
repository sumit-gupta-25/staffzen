import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const storedRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token || storedRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;


