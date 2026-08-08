import React, { useState, useEffect } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useAuth } from '../context/AuthContext';

const DISMISSED_KEY = 'jaiib_notif_prompt_dismissed';

/**
 * Shows a one-time notification permission prompt after login.
 * Dismisses permanently if user clicks "Not now" or grants/denies permission.
 */
const NotificationPrompt: React.FC = () => {
  const { is_authenticated } = useAuth();
  const { requestPermission, permissionState, isSupported } = usePushNotifications(is_authenticated);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!is_authenticated || !isSupported) return;
    if (permissionState !== 'default') return; // Already granted or denied

    // Don't show if previously dismissed
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    // Show after a short delay (don't interrupt initial page load)
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [is_authenticated, isSupported, permissionState]);

  const handleEnable = async () => {
    await requestPermission();
    setIsVisible(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🔔</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">Get exam reminders?</h4>
            <p className="text-xs text-gray-600 mt-1">
              We'll remind you to practice and notify you when the exam is approaching. No spam — just helpful nudges.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleEnable}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Enable Notifications
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;
