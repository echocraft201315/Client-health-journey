"use client";

import { useEffect } from 'react';

export function useNotifications() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  function showNotification(title, body) {
    if (Notification.permission === 'granted' && !document.hasFocus()) {
      const notification = new Notification(title, {
        body,
        icon: '/chat-icon.png',
      });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  return { showNotification };
}
