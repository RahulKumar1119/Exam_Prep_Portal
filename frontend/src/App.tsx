import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PracticeProvider } from './context/PracticeContext';
import { DashboardProvider } from './context/DashboardContext';
import { NotificationProvider } from './context/NotificationContext';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ToastProvider, ToastViewport } from './components/ui/Toast';
import { TooltipProvider } from './components/ui/Tooltip';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PasswordResetPage from './pages/PasswordResetPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import BlogPage from './pages/BlogPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import PracticeTestsPage from './pages/PracticeTestsPage';
import PracticeTestDetailPage from './pages/PracticeTestDetailPage';
import PracticePage from './pages/PracticePage';
import PreviousAttemptsPage from './pages/PreviousAttemptsPage';
import ContactPage from './pages/ContactPage';
import FreeQuizPage from './pages/FreeQuizPage';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import { SessionTimeoutWarning } from './components/SessionTimeoutWarning';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { is_loading } = useAuth();

  if (is_loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SessionTimeoutWarning />
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/password-reset" element={<PasswordResetPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/practice-tests" element={<PracticeTestsPage />} />
      <Route path="/practice-tests/:slug" element={<PracticeTestDetailPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/free-quiz/:slug" element={<FreeQuizPage />} />

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
      <Route
        path="/previous-attempts"
        element={
          <ProtectedRoute>
            <Layout>
              <PreviousAttemptsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <TooltipProvider>
          <AuthProvider>
            <PracticeProvider>
              <DashboardProvider>
                <NotificationProvider>
                  <Router>
                    <AppContent />
                  </Router>
                  <ToastViewport />
                </NotificationProvider>
              </DashboardProvider>
            </PracticeProvider>
          </AuthProvider>
        </TooltipProvider>
      </ToastProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
