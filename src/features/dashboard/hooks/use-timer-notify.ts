import { useCallback } from "react";

export function useTimerNotify(notificationsEnabled: boolean) {
  return useCallback(
    (title: string, body: string) => {
      if (!notificationsEnabled || typeof Notification === "undefined") return;
      if (Notification.permission === "granted") new Notification(title, { body });
    },
    [notificationsEnabled],
  );
}
