import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  onWarning?: (message: string) => void;
  onStop?: (stoppedAt: number) => void;
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
 * - Stop Timer button that freezes the countdown and prevents auto-submit
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12
 */
export const Timer: React.FC<TimerProps> = ({ 
  duration, 
  onTimeUp, 
  onWarning,
  onStop,
  isPaused = false,
  sessionExpired = false
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [hasShownFiveMinWarning, setHasShownFiveMinWarning] = useState(false);
  const [hasShownOneMinWarning, setHasShownOneMinWarning] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [stoppedAtTime, setStoppedAtTime] = useState<number | null>(null);

  useEffect(() => {
    // Don't tick if paused, expired, stopped, or already at 0
    if (isPaused || timeRemaining <= 0 || sessionExpired || isStopped) return;

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
        
        // Auto-submit when timer reaches 0 (only if not stopped)
        if (newTime <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeRemaining, onTimeUp, onWarning, hasShownFiveMinWarning, hasShownOneMinWarning, sessionExpired, isStopped]);

  const handleStop = () => {
    setIsStopped(true);
    setStoppedAtTime(timeRemaining);
    onStop?.(timeRemaining);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formattedTime = formatTime(timeRemaining);

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

  // Stopped state overrides color
  if (isStopped) {
    timerColor = 'text-gray-500';
    bgColor = 'bg-gray-50';
  }

  // Determine warning message
  let warningMessage = '';
  if (sessionExpired) {
    warningMessage = 'Session Expired';
  } else if (!isStopped && timeRemaining === 0) {
    warningMessage = 'Time\'s up! Auto-submitting...';
  } else if (!isStopped && timeRemaining <= 60 && timeRemaining > 0) {
    warningMessage = `Only ${timeRemaining} seconds remaining!`;
  } else if (!isStopped && timeRemaining <= 300 && timeRemaining > 60) {
    warningMessage = '5 minutes remaining';
  }

  const isRunning = !isPaused && !sessionExpired && !isStopped && timeRemaining > 0;

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

      {/* Timer Stopped Badge */}
      {isStopped && stoppedAtTime !== null && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 rounded-full">
          <span className="text-gray-600 text-sm font-semibold">⏹ Timer Stopped</span>
          <span className="text-gray-500 text-xs font-mono">at {formatTime(stoppedAtTime)}</span>
        </div>
      )}

      {/* Stop Timer Button — only visible while actively running */}
      {isRunning && (
        <button
          onClick={handleStop}
          className="mt-1 px-4 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
        >
          Stop Timer
        </button>
      )}
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isStopped ? 'bg-gray-400' :
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
