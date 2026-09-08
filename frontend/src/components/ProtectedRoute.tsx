import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Restrict to staff roles (admin/trainer), matching the admin nav items. */
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { is_authenticated, is_loading, user } = useAuth();
  const location = useLocation();

  if (is_loading) {
    return <LoadingSpinner />;
  }

  if (!is_authenticated) {
    // Pass the attempted URL so login can redirect back after auth
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && user?.role !== 'admin' && user?.role !== 'trainer') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
