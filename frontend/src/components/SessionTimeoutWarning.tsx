import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const SessionTimeoutWarning: React.FC = () => {
  const { sessionWarning, extendSession, logout } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (!sessionWarning) { setSecondsLeft(60); return; }
    setSecondsLeft(60);
    const interval = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, [sessionWarning]);

  if (!sessionWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 border border-yellow-300">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">⏱️</span>
          <h2 className="text-gray-900 font-semibold text-base">Session Expiring Soon</h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          You've been inactive. Your session will expire in{' '}
          <span className="font-bold text-red-600">{secondsLeft}s</span>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={extendSession}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Stay Logged In
          </button>
          <button
            onClick={logout}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
