import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { is_authenticated, is_loading } = useAuth();
  const location = useLocation();

  if (is_loading) {
    return <LoadingSpinner />;
  }

  if (!is_authenticated) {
    // Pass the attempted URL so login can redirect back after auth
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
