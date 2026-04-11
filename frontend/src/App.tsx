import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PracticeProvider } from './context/PracticeContext';
import { DashboardProvider } from './context/DashboardContext';
import { NotificationProvider } from './context/NotificationContext';
import { QueryClientProvider, QueryClient } from 'react-query';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PasswordResetPage from './pages/PasswordResetPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { is_loading } = useAuth();

  if (is_loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/password-reset" element={<PasswordResetPage />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <Layout>
              <PracticePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PracticeProvider>
          <DashboardProvider>
            <NotificationProvider>
              <Router>
                <AppContent />
              </Router>
            </NotificationProvider>
          </DashboardProvider>
        </PracticeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
