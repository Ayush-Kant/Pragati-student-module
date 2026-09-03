self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: 'Pragati', body: event.data?.text?.() || 'You have a new notification.' };
  }

  const title = payload.title || 'Pragati';
  const options = {
    body: payload.body || 'You have a new notification.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: { linkUrl: payload.linkUrl || '/student/notifications' },
    tag: payload.type || 'pragati-notification',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.linkUrl || '/student/notifications';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => 'focus' in client);
      if (existing) {
        existing.navigate(target);
        return existing.focus();
      }
      return self.clients.openWindow(target);
    }),
  );
});
