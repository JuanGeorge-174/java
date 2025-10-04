import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
 // You can replace this with your real auth logic, e.g. check token in localStorage
 const isAuthenticated = !!localStorage.getItem("token");

 if (!isAuthenticated) {
 return <Navigate to="/login" replace />;
 }

 return children;
};

export default ProtectedRoute;
