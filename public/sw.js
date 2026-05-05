// Simple service worker for PWA installation and basic notifications

// Cache name for offline support
const CACHE_NAME = 'water-tracker-v1';

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const options = {
    ...data,
    icon: '/icon-192x192.png',
    badge: '/badge-96x96.png',
    vibrate: [100, 50, 100],
    tag: 'water-reminder',
    renotify: true,
    actions: [
      { action: 'drink', title: '🚰 Drink' },
      { action: 'snooze', title: '⏰ Later' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Water Reminder', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'drink') {
    // Notify all clients that water was consumed
    clients.matchAll().then(clients => {
      clients.forEach(client => client.postMessage({
        type: 'WATER_CONSUMED'
      }));
    });
  }
  
  if (event.action === 'snooze') {
    // Schedule another notification in 15 minutes
    setTimeout(() => {
      self.registration.showNotification('Water Reminder', {
        body: 'Time to hydrate! 💧',
        icon: '/icon-192x192.png'
      });
    }, 15 * 60 * 1000);
  }
});

// Handle installation and caching
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
