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
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import DisclaimerPage from './pages/DisclaimerPage';
import StudyTopicsPage from './pages/StudyTopicsPage';

// Topic Pages
import CrrExplainedPage from './pages/topics/CrrExplainedPage';
import NpaClassificationPage from './pages/topics/NpaClassificationPage';
import PriorityLendingPage from './pages/topics/PriorityLendingPage';
import NpvIrrPage from './pages/topics/NpvIrrPage';
import SarfaesiActPage from './pages/topics/SarfaesiActPage';
import SlrExplainedPage from './pages/topics/SlrExplainedPage';
import KycNormsPage from './pages/topics/KycNormsPage';
import NiActPage from './pages/topics/NiActPage';
import BaselNormsPage from './pages/topics/BaselNormsPage';
import DepositInsurancePage from './pages/topics/DepositInsurancePage';
import RepoRatePage from './pages/topics/RepoRatePage';
import BreakEvenPage from './pages/topics/BreakEvenPage';
import DepreciationPage from './pages/topics/DepreciationPage';
import RatioAnalysisPage from './pages/topics/RatioAnalysisPage';
import MutualFundsPage from './pages/topics/MutualFundsPage';
import UpiPaymentsPage from './pages/topics/UpiPaymentsPage';
import HomeLoanPage from './pages/topics/HomeLoanPage';

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
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/disclaimer" element={<DisclaimerPage />} />
      <Route path="/study-topics" element={<StudyTopicsPage />} />

      {/* Topic Hub Pages */}
      <Route path="/jaiib/ppb/crr-explained" element={<CrrExplainedPage />} />
      <Route path="/jaiib/ppb/npa-classification" element={<NpaClassificationPage />} />
      <Route path="/jaiib/ppb/priority-sector-lending" element={<PriorityLendingPage />} />
      <Route path="/jaiib/afm/npv-irr-explained" element={<NpvIrrPage />} />
      <Route path="/jaiib/ppb/sarfaesi-act" element={<SarfaesiActPage />} />
      <Route path="/jaiib/ppb/slr-explained" element={<SlrExplainedPage />} />
      <Route path="/jaiib/ppb/kyc-norms" element={<KycNormsPage />} />
      <Route path="/jaiib/ppb/negotiable-instruments-act" element={<NiActPage />} />
      <Route path="/jaiib/ppb/basel-norms" element={<BaselNormsPage />} />
      <Route path="/jaiib/ppb/deposit-insurance-dicgc" element={<DepositInsurancePage />} />
      <Route path="/jaiib/ppb/repo-rate-explained" element={<RepoRatePage />} />
      <Route path="/jaiib/afm/break-even-analysis" element={<BreakEvenPage />} />
      <Route path="/jaiib/afm/depreciation-methods" element={<DepreciationPage />} />
      <Route path="/jaiib/afm/ratio-analysis" element={<RatioAnalysisPage />} />
      <Route path="/jaiib/rbwm/mutual-funds-guide" element={<MutualFundsPage />} />
      <Route path="/jaiib/ppb/upi-payments-system" element={<UpiPaymentsPage />} />
      <Route path="/jaiib/rbwm/home-loan-guide" element={<HomeLoanPage />} />

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
