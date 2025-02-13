import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RoleBasedProtectedRoute = ({ allowedRole, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // If for some reason there is no user (should be handled by RequiredAuth) then redirect to login.
  if (!user) return <Navigate to="/" replace />;

  // Check if the user's role matches the allowed role.
  if (user.role !== allowedRole) {
    // If not, redirect to the proper page for that role.
    return <Navigate to={`/${user.role}/${user._id}`} replace />;
  }

  // If everything is fine, render the child components.
  return children;
};

export default RoleBasedProtectedRoute;
