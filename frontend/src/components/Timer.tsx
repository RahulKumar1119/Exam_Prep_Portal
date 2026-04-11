import React, { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isPaused?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isPaused = false }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeRemaining, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  // Determine color based on time remaining
  let timerColor = 'text-green-600'; // Normal
  if (timeRemaining <= 60) {
    timerColor = 'text-red-600'; // 1 minute or less
  } else if (timeRemaining <= 300) {
    timerColor = 'text-yellow-600'; // 5 minutes or less
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`text-4xl font-bold font-mono ${timerColor}`}>{formattedTime}</div>
      {timeRemaining <= 300 && timeRemaining > 60 && (
        <p className="text-sm text-yellow-600 font-semibold">5 minutes remaining</p>
      )}
      {timeRemaining <= 60 && timeRemaining > 0 && (
        <p className="text-sm text-red-600 font-semibold">1 minute remaining!</p>
      )}
      {timeRemaining === 0 && (
        <p className="text-sm text-red-600 font-semibold">Time's up!</p>
      )}
    </div>
  );
};
