import { setNotificationsEnabled } from "@/src/store/slices/app-slice";
import { toast } from "sonner";

type NotificationToggleProps = {
  notificationsEnabled: boolean;
  dispatch: (action: ReturnType<typeof setNotificationsEnabled>) => void;
  ensureAudioContext: () => Promise<AudioContext | null>;
};

export function useNotificationToggle(props: NotificationToggleProps) {
  return function handleNotificationToggle() {
    if (typeof Notification === "undefined")
      return toast.error(
        "Browser notifications are not supported in this environment.",
      );
    if (props.notificationsEnabled) {
      props.dispatch(setNotificationsEnabled(false));
      return toast.info("Notifications disabled.");
    }

    void Notification.requestPermission().then((permission) => {
      if (permission !== "granted")
        return toast.error("Notification permission was not granted.");
      props.dispatch(setNotificationsEnabled(true));
      toast.success("Notifications enabled.");
      void props.ensureAudioContext();
    });
  };
}
