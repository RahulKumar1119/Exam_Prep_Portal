/**
 * usePushNotifications
 *
 * Manages browser push notification permissions and schedules local reminders.
 * Uses the Notification API (no server-side push subscription needed for local notifications).
 *
 * Features:
 * - Request permission on first login
 * - Schedule inactivity reminders (3 days without practice)
 * - Schedule exam countdown reminders (2 weeks, 1 week, 3 days before)
 * - Persist permission state in localStorage
 */
import { useEffect, useCallback, useRef } from 'react';

const PERMISSION_KEY = 'jaiib_notif_permission';
const LAST_PRACTICE_KEY = 'jaiib_last_practice_time';
const REMINDER_CHECK_KEY = 'jaiib_last_reminder_check';

// JAIIB exam dates
const NEXT_EXAM_DATE = new Date('2026-11-15T09:00:00+05:30');

type NotifPermission = 'granted' | 'denied' | 'default' | 'unsupported';

function getPermissionState(): NotifPermission {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission as NotifPermission;
}

function showLocalNotification(title: string, body: string, tag: string, url: string = '/practice') {
  if (getPermissionState() !== 'granted') return;

  // Register service worker if not yet
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag,
        data: { url },
      });
    });
  } else {
    // Fallback: basic Notification API
    new Notification(title, { body, icon: '/logo192.png', tag });
  }
}

export function recordPracticeActivity() {
  try {
    localStorage.setItem(LAST_PRACTICE_KEY, Date.now().toString());
  } catch {}
}

export function usePushNotifications(isAuthenticated: boolean) {
  const hasChecked = useRef(false);

  const requestPermission = useCallback(async (): Promise<NotifPermission> => {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';

    const result = await Notification.requestPermission();
    try {
      localStorage.setItem(PERMISSION_KEY, result);
    } catch {}
    return result as NotifPermission;
  }, []);

  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return;
    try {
      await navigator.serviceWorker.register('/sw-notifications.js');
    } catch {
      // SW registration failed — not critical
    }
  }, []);

  const checkAndSendReminders = useCallback(() => {
    if (getPermissionState() !== 'granted') return;

    const now = Date.now();

    // Only check once per day
    const lastCheck = parseInt(localStorage.getItem(REMINDER_CHECK_KEY) || '0', 10);
    if (now - lastCheck < 24 * 60 * 60 * 1000) return;
    localStorage.setItem(REMINDER_CHECK_KEY, now.toString());

    // 1. Inactivity reminder (3+ days without practice)
    const lastPractice = parseInt(localStorage.getItem(LAST_PRACTICE_KEY) || '0', 10);
    if (lastPractice > 0) {
      const daysSinceLastPractice = Math.floor((now - lastPractice) / (1000 * 60 * 60 * 24));
      if (daysSinceLastPractice >= 3) {
        showLocalNotification(
          'Miss us? 📚',
          `You haven't practiced in ${daysSinceLastPractice} days. A quick 10-question session keeps you sharp!`,
          'inactivity-reminder',
          '/practice'
        );
        return; // One notification at a time
      }
    }

    // 2. Exam countdown reminders
    const daysUntilExam = Math.ceil((NEXT_EXAM_DATE.getTime() - now) / (1000 * 60 * 60 * 24));

    if (daysUntilExam === 14) {
      showLocalNotification(
        'Only 2 weeks to JAIIB! ⏰',
        'Start taking full mock tests under timed conditions. You\'ve got this!',
        'exam-2weeks',
        '/practice'
      );
    } else if (daysUntilExam === 7) {
      showLocalNotification(
        'JAIIB exam in 1 week! 🔥',
        'Final revision time. Focus on weak areas and formula sheets.',
        'exam-1week',
        '/dashboard'
      );
    } else if (daysUntilExam === 3) {
      showLocalNotification(
        'JAIIB in 3 days! 💪',
        'Revise RBI rates, NPA timelines, and key Act sections. You\'re ready!',
        'exam-3days',
        '/dashboard'
      );
    }
  }, []);

  // On mount: register SW + check reminders if authenticated
  useEffect(() => {
    if (!isAuthenticated || hasChecked.current) return;
    hasChecked.current = true;

    registerServiceWorker();

    // Delay reminder check so it doesn't block initial render
    const timeout = setTimeout(() => {
      checkAndSendReminders();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, registerServiceWorker, checkAndSendReminders]);

  return {
    requestPermission,
    permissionState: getPermissionState(),
    isSupported: 'Notification' in window,
  };
}
