import React, { useEffect, useState } from 'react';
import { loadConsent, saveConsent, COOKIE_SETTINGS_EVENT } from '../utils/consent';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    // Show only on client after mount (never in prerendered HTML) and only
    // when the user hasn't decided yet.
    if (!loadConsent()) {
      setVisible(true);
    }
    const reopen = () => {
      const current = loadConsent();
      setAnalytics(current?.analytics ?? true);
      setAds(current?.ads ?? false);
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  if (!visible) return null;

  const decide = (a: boolean, d: boolean) => {
    saveConsent({ analytics: a, ads: d });
    setVisible(false);
    setCustomizing(false);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6" role="dialog" aria-label="Cookie consent">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-5 sm:p-6">
        <h2 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">We value your privacy 🍪</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          We use cookies to measure traffic (analytics) and show ads that keep MockMaster free.
          Choose what you're comfortable with — the site works either way.
        </p>

        {customizing && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Strictly necessary</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Login session & security. Always on.</p>
              </div>
              <span className="text-xs font-semibold text-green-600">ON</span>
            </div>
            <label className="flex items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Analytics</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Anonymous usage stats (Google Analytics).</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="w-5 h-5 accent-indigo-600"
              />
            </label>
            <label className="flex items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Advertising</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Google Ads & AdSense that fund free access.</p>
              </div>
              <input
                type="checkbox"
                checked={ads}
                onChange={(e) => setAds(e.target.checked)}
                className="w-5 h-5 accent-indigo-600"
              />
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
          {customizing ? (
            <button
              onClick={() => decide(analytics, ads)}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Save My Choices
            </button>
          ) : (
            <>
              <button
                onClick={() => setCustomizing(true)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition order-3 sm:order-1"
              >
                Customize
              </button>
              <button
                onClick={() => decide(false, false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition order-2"
              >
                Reject All
              </button>
              <button
                onClick={() => decide(true, true)}
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition order-1 sm:order-3"
              >
                Accept All
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
