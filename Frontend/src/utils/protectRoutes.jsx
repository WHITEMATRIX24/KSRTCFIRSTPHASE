import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoutes = () => {
  const auth = JSON.parse(sessionStorage.getItem("user"));

  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectRoutes;
