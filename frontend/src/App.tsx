import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PracticeProvider } from './context/PracticeContext';
import { DashboardProvider } from './context/DashboardContext';
import { NotificationProvider } from './context/NotificationContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ToastProvider, ToastViewport } from './components/ui/Toast';
import { TooltipProvider } from './components/ui/Tooltip';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';

// Eager: critical landing/auth
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Lazy: heavy / less critical routes (code-split)
const PasswordResetPage = lazy(() => import('./pages/PasswordResetPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const PracticeTestDetailPage = lazy(() => import('./pages/PracticeTestDetailPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const PreviousAttemptsPage = lazy(() => import('./pages/PreviousAttemptsPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FreeQuizPage = lazy(() => import('./pages/FreeQuizPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const AI300PracticeTestPage = lazy(() => import('./pages/AI300PracticeTestPage'));
const BrowseExamsPage = lazy(() => import('./pages/BrowseExamsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const StudyTopicsPage = lazy(() => import('./pages/StudyTopicsPage'));

// Topic Pages (lazy - large set)
const CrrExplainedPage = lazy(() => import('./pages/topics/CrrExplainedPage'));
const NpaClassificationPage = lazy(() => import('./pages/topics/NpaClassificationPage'));
const PriorityLendingPage = lazy(() => import('./pages/topics/PriorityLendingPage'));
const NpvIrrPage = lazy(() => import('./pages/topics/NpvIrrPage'));
const SarfaesiActPage = lazy(() => import('./pages/topics/SarfaesiActPage'));
const SlrExplainedPage = lazy(() => import('./pages/topics/SlrExplainedPage'));
const KycNormsPage = lazy(() => import('./pages/topics/KycNormsPage'));
const NiActPage = lazy(() => import('./pages/topics/NiActPage'));
const BaselNormsPage = lazy(() => import('./pages/topics/BaselNormsPage'));
const DepositInsurancePage = lazy(() => import('./pages/topics/DepositInsurancePage'));
const RepoRatePage = lazy(() => import('./pages/topics/RepoRatePage'));
const BreakEvenPage = lazy(() => import('./pages/topics/BreakEvenPage'));
const DepreciationPage = lazy(() => import('./pages/topics/DepreciationPage'));
const RatioAnalysisPage = lazy(() => import('./pages/topics/RatioAnalysisPage'));
const MutualFundsPage = lazy(() => import('./pages/topics/MutualFundsPage'));
const UpiPaymentsPage = lazy(() => import('./pages/topics/UpiPaymentsPage'));
const HomeLoanPage = lazy(() => import('./pages/topics/HomeLoanPage'));

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import { SessionTimeoutWarning } from './components/SessionTimeoutWarning';
import NotificationPrompt from './components/NotificationPrompt';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { is_loading } = useAuth();

  if (is_loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SessionTimeoutWarning />
      <NotificationPrompt />
      <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
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
      <Route path="/practice-tests" element={<BrowseExamsPage />} />
      <Route path="/practice-tests/:slug" element={<PracticeTestDetailPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/free-quiz/:slug" element={<FreeQuizPage />} />
      <Route path="/ai-300-practice-test" element={<AI300PracticeTestPage />} />
      <Route path="/exams" element={<BrowseExamsPage />} />
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
          <ErrorBoundary>
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ErrorBoundary>
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/practice"
        element={
          <ErrorBoundary>
          <ProtectedRoute>
            <Layout>
              <PracticePage />
            </Layout>
          </ProtectedRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/previous-attempts"
        element={
          <ErrorBoundary>
          <ProtectedRoute>
            <Layout>
              <PreviousAttemptsPage />
            </Layout>
          </ProtectedRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ErrorBoundary>
          <ProtectedRoute>
            <Layout>
              <LeaderboardPage />
            </Layout>
          </ProtectedRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/bookmarks"
        element={
          <ErrorBoundary>
          <ProtectedRoute>
            <Layout>
              <BookmarksPage />
            </Layout>
          </ProtectedRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/profile"
        element={
          <ErrorBoundary>
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/notifications"
        element={
          <ErrorBoundary>
          <ProtectedRoute>
            <Layout>
              <NotificationsPage />
            </Layout>
          </ProtectedRoute>
          </ErrorBoundary>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
      </Suspense>
      </ErrorBoundary>
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
