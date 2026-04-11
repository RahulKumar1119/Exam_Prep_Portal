/**
 * Timer Component Tests
 * 
 * Tests for:
 * - Timer display in MM:SS format
 * - Color changes at thresholds
 * - Warning messages
 * - Auto-submission at timeout
 * - Session expiration handling
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Timer } from '../components/Timer';

describe('Timer Component', () => {
  describe('Timer Display Format', () => {
    it('should display timer in MM:SS format', () => {
      const { container } = render(
        <Timer duration={600} onTimeUp={() => {}} />
      );
      
      const timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.textContent).toBe('10:00');
    });

    it('should display 05:00 for 300 seconds', () => {
      const { container } = render(
        <Timer duration={300} onTimeUp={() => {}} />
      );
      
      const timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.textContent).toBe('05:00');
    });

    it('should display 01:00 for 60 seconds', () => {
      const { container } = render(
        <Timer duration={60} onTimeUp={() => {}} />
      );
      
      const timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.textContent).toBe('01:00');
    });

    it('should display 00:05 for 5 seconds', () => {
      const { container } = render(
        <Timer duration={5} onTimeUp={() => {}} />
      );
      
      const timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.textContent).toBe('00:05');
    });

    it('should display 00:00 for 0 seconds', () => {
      const { container } = render(
        <Timer duration={0} onTimeUp={() => {}} />
      );
      
      const timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.textContent).toBe('00:00');
    });
  });

  describe('Timer Color Changes', () => {
    it('should display green color for >5 minutes', () => {
      const { container } = render(
        <Timer duration={600} onTimeUp={() => {}} />
      );
      
      const timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.className).toContain('text-green-600');
    });

    it('should display yellow color for 1-5 minutes', () => {
      const { container } = render(
        <Timer duration={300} onTimeUp={() => {}} />
      );
      
      const timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.className).toContain('text-yellow-600');
    });

    it('should display red color for <1 minute', () => {
      const { container } = render(
        <Timer duration={60} onTimeUp={() => {}} />
      );
      
      const timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.className).toContain('text-red-600');
    });

    it('should display red color for 30 seconds', () => {
      const { container } = render(
        <Timer duration={30} onTimeUp={() => {}} />
      );
      
      const timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.className).toContain('text-red-600');
    });
  });

  describe('Warning Messages', () => {
    it('should show 5 minutes remaining message', () => {
      const { container } = render(
        <Timer duration={300} onTimeUp={() => {}} />
      );
      
      expect(screen.getByText('5 minutes remaining')).toBeInTheDocument();
    });

    it('should show 1 minute remaining message for 60 seconds', () => {
      const { container } = render(
        <Timer duration={60} onTimeUp={() => {}} />
      );
      
      expect(screen.getByText(/Only.*seconds remaining/)).toBeInTheDocument();
    });

    it('should show session expired message when sessionExpired prop is true', () => {
      render(
        <Timer duration={300} onTimeUp={() => {}} sessionExpired={true} />
      );
      
      expect(screen.getByText('Session Expired')).toBeInTheDocument();
    });

    it('should not show warning message for >5 minutes', () => {
      const { container } = render(
        <Timer duration={600} onTimeUp={() => {}} />
      );
      
      const warningMessages = container.querySelectorAll('.font-semibold');
      expect(warningMessages.length).toBe(0);
    });
  });

  describe('Timer Countdown', () => {
    jest.useFakeTimers();

    it('should countdown from 10 to 9 seconds', async () => {
      const { container, rerender } = render(
        <Timer duration={10} onTimeUp={() => {}} />
      );
      
      let timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.textContent).toBe('00:10');
      
      jest.advanceTimersByTime(1000);
      
      rerender(
        <Timer duration={10} onTimeUp={() => {}} />
      );
      
      timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.textContent).toBe('00:09');
    });
  });

  describe('Auto-Submission', () => {
    jest.useFakeTimers();

    it('should call onTimeUp when timer reaches 0', async () => {
      const onTimeUp = jest.fn();
      
      const { rerender } = render(
        <Timer duration={2} onTimeUp={onTimeUp} />
      );
      
      jest.advanceTimersByTime(2000);
      
      rerender(
        <Timer duration={2} onTimeUp={onTimeUp} />
      );
      
      await waitFor(() => {
        expect(onTimeUp).toHaveBeenCalled();
      });
    });

    it('should show auto-submit message when time is up', () => {
      const { container } = render(
        <Timer duration={0} onTimeUp={() => {}} />
      );
      
      expect(screen.getByText(/Auto-submitting/)).toBeInTheDocument();
    });
  });

  describe('Pause/Resume', () => {
    jest.useFakeTimers();

    it('should not countdown when isPaused is true', () => {
      const { container, rerender } = render(
        <Timer duration={10} onTimeUp={() => {}} isPaused={true} />
      );
      
      let timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.textContent).toBe('00:10');
      
      jest.advanceTimersByTime(1000);
      
      rerender(
        <Timer duration={10} onTimeUp={() => {}} isPaused={true} />
      );
      
      timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.textContent).toBe('00:10');
    });

    it('should resume countdown when isPaused becomes false', () => {
      const { container, rerender } = render(
        <Timer duration={10} onTimeUp={() => {}} isPaused={true} />
      );
      
      rerender(
        <Timer duration={10} onTimeUp={() => {}} isPaused={false} />
      );
      
      jest.advanceTimersByTime(1000);
      
      rerender(
        <Timer duration={10} onTimeUp={() => {}} isPaused={false} />
      );
      
      const timerDisplay = container.querySelector('.font-mono');
      expect(timerDisplay?.textContent).toBe('00:09');
    });
  });

  describe('Progress Bar', () => {
    it('should display progress bar', () => {
      const { container } = render(
        <Timer duration={600} onTimeUp={() => {}} />
      );
      
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should show full progress bar at start', () => {
      const { container } = render(
        <Timer duration={600} onTimeUp={() => {}} />
      );
      
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar?.getAttribute('style')).toContain('100%');
    });

    it('should show half progress bar at halfway', () => {
      const { container } = render(
        <Timer duration={300} onTimeUp={() => {}} />
      );
      
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar?.getAttribute('style')).toContain('50%');
    });
  });

  describe('Warning Callback', () => {
    jest.useFakeTimers();

    it('should call onWarning callback at 5 minutes', async () => {
      const onWarning = jest.fn();
      
      const { rerender } = render(
        <Timer duration={301} onTimeUp={() => {}} onWarning={onWarning} />
      );
      
      jest.advanceTimersByTime(1000);
      
      rerender(
        <Timer duration={301} onTimeUp={() => {}} onWarning={onWarning} />
      );
      
      await waitFor(() => {
        expect(onWarning).toHaveBeenCalledWith('5 minutes remaining');
      });
    });

    it('should call onWarning callback at 1 minute', async () => {
      const onWarning = jest.fn();
      
      const { rerender } = render(
        <Timer duration={61} onTimeUp={() => {}} onWarning={onWarning} />
      );
      
      jest.advanceTimersByTime(1000);
      
      rerender(
        <Timer duration={61} onTimeUp={() => {}} onWarning={onWarning} />
      );
      
      await waitFor(() => {
        expect(onWarning).toHaveBeenCalledWith('1 minute remaining!');
      });
    });
  });
});
