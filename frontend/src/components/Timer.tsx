import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  onWarning?: (message: string) => void;
  isPaused?: boolean;
  sessionExpired?: boolean;
}

/**
 * Timer Component
 * 
 * Displays a countdown timer with:
 * - MM:SS format
 * - Color changes: green (>5 min), yellow (5-1 min), red (<1 min)
 * - Warning messages at thresholds
 * - Auto-submission callback when timer reaches 0
 * - Session expiration handling
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.7, 3.8
 */
export const Timer: React.FC<TimerProps> = ({ 
  duration, 
  onTimeUp, 
  onWarning,
  isPaused = false,
  sessionExpired = false
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [hasShownFiveMinWarning, setHasShownFiveMinWarning] = useState(false);
  const [hasShownOneMinWarning, setHasShownOneMinWarning] = useState(false);

  useEffect(() => {
    if (isPaused || timeRemaining <= 0 || sessionExpired) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        
        // Check for 5-minute warning (300 seconds)
        if (newTime === 300 && !hasShownFiveMinWarning && onWarning) {
          onWarning('5 minutes remaining');
          setHasShownFiveMinWarning(true);
        }
        
        // Check for 1-minute warning (60 seconds)
        if (newTime === 60 && !hasShownOneMinWarning && onWarning) {
          onWarning('1 minute remaining!');
          setHasShownOneMinWarning(true);
        }
        
        // Auto-submit when timer reaches 0
        if (newTime <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeRemaining, onTimeUp, onWarning, hasShownFiveMinWarning, hasShownOneMinWarning, sessionExpired]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  // Determine color based on time remaining
  let timerColor = 'text-green-600'; // Normal (>5 minutes)
  let bgColor = 'bg-green-50';
  
  if (timeRemaining <= 60) {
    timerColor = 'text-red-600'; // Red (<1 minute)
    bgColor = 'bg-red-50';
  } else if (timeRemaining <= 300) {
    timerColor = 'text-yellow-600'; // Yellow (1-5 minutes)
    bgColor = 'bg-yellow-50';
  }

  // Determine warning message
  let warningMessage = '';
  if (sessionExpired) {
    warningMessage = 'Session Expired';
  } else if (timeRemaining === 0) {
    warningMessage = 'Time\'s up! Auto-submitting...';
  } else if (timeRemaining <= 60 && timeRemaining > 0) {
    warningMessage = `Only ${timeRemaining} seconds remaining!`;
  } else if (timeRemaining <= 300 && timeRemaining > 60) {
    warningMessage = '5 minutes remaining';
  }

  return (
    <div className={`flex flex-col items-center gap-3 p-4 rounded-lg ${bgColor} border-2 ${timerColor.replace('text', 'border')}`}>
      {/* Timer Display */}
      <div className={`text-5xl font-bold font-mono ${timerColor} tracking-wider`}>
        {formattedTime}
      </div>
      
      {/* Warning Message */}
      {warningMessage && (
        <p className={`text-sm font-semibold ${timerColor}`}>
          {warningMessage}
        </p>
      )}
      
      {/* Session Expired Message */}
      {sessionExpired && (
        <div className="text-center">
          <p className="text-sm text-red-600 font-semibold">Session Expired</p>
          <p className="text-xs text-red-500 mt-1">Your practice session has ended</p>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            timeRemaining <= 60 ? 'bg-red-600' :
            timeRemaining <= 300 ? 'bg-yellow-600' :
            'bg-green-600'
          }`}
          style={{ width: `${(timeRemaining / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};
