import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoutes = ({ allowedRoles }) => {
  const auth = JSON.parse(sessionStorage.getItem("user"));

  if (!auth) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    alert("You Have No Access to this Page....!")
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default ProtectRoutes;
