// Unified notification system for web, desktop, and mobile

declare global {
  interface Window {
    electron?: {
      showNotification: (title: string, body: string) => Promise<void>;
      platform: string;
    };
  }
}

export async function showNotification(title: string, body: string) {
  // Desktop (Electron)
  if (window.electron) {
    await window.electron.showNotification(title, body);
    return;
  }

  // Mobile (Capacitor) - check if available
  if ('Capacitor' in window) {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 1000) }
          }
        ]
      });
      return;
    } catch (e) {
      console.warn('Capacitor notifications not available', e);
    }
  }

  // Web fallback
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, { body });
    }
  }
}

export async function requestNotificationPermission() {
  if (window.electron) {
    return true; // Desktop always has permission
  }

  if ('Capacitor' in window) {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (e) {
      console.warn('Capacitor notifications not available', e);
    }
  }

  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}
