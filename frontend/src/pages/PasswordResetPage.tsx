import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FormErrors {
  email?: string;
  new_password?: string;
  confirm_password?: string;
}

const PasswordResetPage: React.FC = () => {
  const { requestPasswordReset, resetPassword, error, is_loading, clearError } = useAuth();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');

  const [step] = useState<'request' | 'reset'>(resetToken ? 'reset' : 'request');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 8) return 'weak';
    if (password.length < 12) return 'medium';
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
      return 'strong';
    }
    return 'medium';
  };

  const validateEmailForm = (): boolean => {
    const errors: FormErrors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateResetForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.new_password) {
      errors.new_password = 'Password is required';
    } else if (formData.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters';
    }

    if (!formData.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (formData.new_password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setLocalError('');
    setSuccess('');
    clearError();
    if (formErrors.email) {
      setFormErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setLocalError('');
    setSuccess('');
    clearError();

    if (name === 'new_password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');

    if (!validateEmailForm()) {
      return;
    }

    try {
      await requestPasswordReset(email);
      setSuccess('Password reset link has been sent to your email. Please check your inbox and spam folder.');
      setEmail('');
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Password reset request failed. Please try again.';
      setLocalError(errorMsg);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');

    if (!validateResetForm() || !resetToken) {
      return;
    }

    try {
      await resetPassword(resetToken, formData.new_password);
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Password reset failed. Please try again.';
      setLocalError(errorMsg);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">
              {step === 'request'
                ? 'Enter your email to receive a password reset link'
                : 'Create a new password for your account'}
            </p>
          </div>

          {/* Error Message */}
          {(error || localError) && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm">{error || localError}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Request Reset Form */}
          {step === 'request' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="your@email.com"
                  disabled={is_loading}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={is_loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {is_loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          {/* Reset Password Form */}
          {step === 'reset' && resetToken && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    formErrors.new_password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="••••••••"
                  disabled={is_loading}
                />
                {formErrors.new_password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.new_password}</p>
                )}
                {formData.new_password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password strength:</span>
                      <span className="text-xs font-medium text-gray-700">{passwordStrength}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`} style={{
                        width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%'
                      }}></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    formErrors.confirm_password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="••••••••"
                  disabled={is_loading}
                />
                {formErrors.confirm_password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirm_password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={is_loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {is_loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          {/* Links */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition">
                Login here
              </Link>
            </p>
            {step === 'request' && (
              <p className="text-gray-600 mt-2">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition">
                  Register here
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
