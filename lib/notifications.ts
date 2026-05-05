let swRegistration: ServiceWorkerRegistration | null = null;

export async function initializeNotifications() {
  if (typeof window === 'undefined') return null;
  
  try {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return null;
    }

    if ('serviceWorker' in navigator) {
      swRegistration = await navigator.serviceWorker.register('/sw.js');
      return swRegistration;
    }
  } catch (error) {
    console.error('Failed to initialize notifications:', error);
    return null;
  }
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'denied';
  
  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

export function showNotification(title: string, body: string) {
  if (!swRegistration || Notification.permission !== 'granted') return;

  const options = {
    body,
    icon: '/icon-192x192.png',
    badge: '/badge-96x96.png',
    tag: 'water-reminder',
    renotify: true,
    actions: [
      { action: 'drink', title: '🚰 Drink' },
      { action: 'snooze', title: '⏰ Later' }
    ]
  };

  swRegistration.showNotification(title, options);
}

export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/service-worker.js')
        console.log('Service Worker registered successfully')
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }
