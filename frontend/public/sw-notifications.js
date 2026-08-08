/**
 * Service Worker for MockMaster Push Notifications
 * Handles background notification display and click actions.
 */

self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'MockMaster';
  const options = {
    body: data.body || 'Time to practice!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: data.tag || 'mockmaster-notification',
    data: { url: data.url || '/practice' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const url = event.notification.data?.url || '/practice';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // Focus existing tab if open
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.includes('mockmaster.fun') && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Open new tab
      if (clients.openWindow) {
        return clients.openWindow('https://mockmaster.fun' + url);
      }
    })
  );
});
