/**
 * Timer Component Tests
 * 
 * Tests for:
 * - Timer display in MM:SS format
 * - Color changes at thresholds
 * - Warning messages
 * - Auto-submission at timeout
 * - Session expiration handling
 * - Stop Timer button behavior (Property 9a)
 */

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  /**
   * Property 9a: Stopped Timer Prevents Auto-Submit
   * 
   * For any practice session where the user has clicked "Stop Timer",
   * the timer should remain paused and the system should NOT auto-submit
   * when the displayed time reaches 0, requiring the user to submit manually.
   *
   * Feature: jaiib-caiib-exam-prep-portal, Property 9a: Stopped timer prevents auto-submit
   * Validates: Requirements 3.9, 3.10, 3.11
   */
  describe('Stop Timer Button (Property 9a)', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    // Helper: create a userEvent instance that advances fake timers
    const setup = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime.bind(jest) });

    it('should render the Stop Timer button while the timer is running', () => {
      render(<Timer duration={600} onTimeUp={() => {}} />);
      expect(screen.getByRole('button', { name: /stop timer/i })).toBeInTheDocument();
    });

    it('should NOT render the Stop Timer button when timer is paused', () => {
      render(<Timer duration={600} onTimeUp={() => {}} isPaused={true} />);
      expect(screen.queryByRole('button', { name: /stop timer/i })).not.toBeInTheDocument();
    });

    it('should NOT render the Stop Timer button when session is expired', () => {
      render(<Timer duration={600} onTimeUp={() => {}} sessionExpired={true} />);
      expect(screen.queryByRole('button', { name: /stop timer/i })).not.toBeInTheDocument();
    });

    it('should freeze the countdown when Stop Timer is clicked (req 3.9)', async () => {
      const user = setup();
      const { container } = render(<Timer duration={30} onTimeUp={() => {}} />);

      // Advance 5 seconds so timer reads 00:25
      act(() => { jest.advanceTimersByTime(5000); });

      const timerDisplay = container.querySelector('.font-mono.text-5xl');
      const timeBefore = timerDisplay?.textContent;

      // Click stop
      await user.click(screen.getByRole('button', { name: /stop timer/i }));

      // Advance another 5 seconds — countdown should NOT move
      act(() => { jest.advanceTimersByTime(5000); });

      expect(timerDisplay?.textContent).toBe(timeBefore);
    });

    it('should hide the Stop Timer button after it is clicked', async () => {
      const user = setup();
      render(<Timer duration={60} onTimeUp={() => {}} />);

      await user.click(screen.getByRole('button', { name: /stop timer/i }));

      expect(screen.queryByRole('button', { name: /stop timer/i })).not.toBeInTheDocument();
    });

    it('should display "Timer Stopped" badge after clicking stop (req 3.9)', async () => {
      const user = setup();
      render(<Timer duration={60} onTimeUp={() => {}} />);

      await user.click(screen.getByRole('button', { name: /stop timer/i }));

      expect(screen.getByText(/timer stopped/i)).toBeInTheDocument();
    });

    it('should display the time at which the timer was stopped (req 3.12)', async () => {
      const user = setup();
      const { container } = render(<Timer duration={30} onTimeUp={() => {}} />);

      // Advance 10 seconds so timer is at 00:20
      act(() => { jest.advanceTimersByTime(10000); });

      await user.click(screen.getByRole('button', { name: /stop timer/i }));

      // The stopped badge should show "at 00:20"
      expect(screen.getByText(/at 00:20/i)).toBeInTheDocument();
    });

    it('should call onStop callback with the remaining time when stopped (req 3.9)', async () => {
      const user = setup();
      const onStop = jest.fn();
      render(<Timer duration={30} onTimeUp={() => {}} onStop={onStop} />);

      act(() => { jest.advanceTimersByTime(5000); });

      await user.click(screen.getByRole('button', { name: /stop timer/i }));

      expect(onStop).toHaveBeenCalledTimes(1);
      // Should be called with a value between 24 and 26 (timing tolerance)
      const stoppedAt = onStop.mock.calls[0][0] as number;
      expect(stoppedAt).toBeGreaterThanOrEqual(24);
      expect(stoppedAt).toBeLessThanOrEqual(26);
    });

    it('should NOT call onTimeUp after stop even when time runs out (req 3.11)', async () => {
      const user = setup();
      const onTimeUp = jest.fn();
      render(<Timer duration={5} onTimeUp={onTimeUp} />);

      // Stop immediately
      await user.click(screen.getByRole('button', { name: /stop timer/i }));

      // Advance well past the original duration
      act(() => { jest.advanceTimersByTime(10000); });

      expect(onTimeUp).not.toHaveBeenCalled();
    });

    it('should use gray color scheme after timer is stopped', async () => {
      const user = setup();
      const { container } = render(<Timer duration={600} onTimeUp={() => {}} />);

      await user.click(screen.getByRole('button', { name: /stop timer/i }));

      const timerDisplay = container.querySelector('.font-mono.text-5xl');
      expect(timerDisplay?.className).toContain('text-gray-500');
    });

    it('should use gray progress bar after timer is stopped', async () => {
      const user = setup();
      const { container } = render(<Timer duration={600} onTimeUp={() => {}} />);

      await user.click(screen.getByRole('button', { name: /stop timer/i }));

      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar?.className).toContain('bg-gray-400');
    });

    /**
     * Property-based style: for any valid duration (10–600s), stopping the timer
     * at any point should always freeze the display and suppress auto-submit.
     * We sample several representative durations to approximate this property.
     */
    it.each([10, 30, 60, 120, 300, 600])(
      'property: stopping at duration=%is always freezes countdown and suppresses auto-submit',
      async (duration: number) => {
        const user = setup();
        const onTimeUp = jest.fn();
        const onStop = jest.fn();
        const { container } = render(
          <Timer duration={duration} onTimeUp={onTimeUp} onStop={onStop} />
        );

        // Advance a representative 30% of the duration
        const elapsed = Math.floor(duration * 0.3) * 1000;
        act(() => { jest.advanceTimersByTime(elapsed); });

        const timerDisplay = container.querySelector('.font-mono.text-5xl');
        const frozenTime = timerDisplay?.textContent;

        await user.click(screen.getByRole('button', { name: /stop timer/i }));

        // Advance the full remaining duration — nothing should change
        act(() => { jest.advanceTimersByTime(duration * 1000); });

        expect(timerDisplay?.textContent).toBe(frozenTime);
        expect(onTimeUp).not.toHaveBeenCalled();
        expect(onStop).toHaveBeenCalledTimes(1);
      }
    );
  });
});
