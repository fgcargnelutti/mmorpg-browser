import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ToastViewport from "../presentation/components/ToastViewport";
import type { ToastDefinition, ToastInput, ToastTone } from "../domain/toastTypes";

type NotificationContextValue = {
  notify: (input: ToastInput) => string;
  dismissToast: (toastId: string) => void;
  notifySuccess: (message: string, options?: Omit<ToastInput, "message" | "tone">) => string;
  notifyError: (message: string, options?: Omit<ToastInput, "message" | "tone">) => string;
  notifyInfo: (message: string, options?: Omit<ToastInput, "message" | "tone">) => string;
  notifyWarning: (message: string, options?: Omit<ToastInput, "message" | "tone">) => string;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

const DEFAULT_TOAST_DURATION_MS = 3200;
const MAX_ACTIVE_TOASTS = 4;
const DUPLICATE_SUPPRESSION_WINDOW_MS = 1200;

function buildToast(
  id: string,
  input: ToastInput,
  now: number = Date.now()
): ToastDefinition {
  const normalizedMessage = input.message.trim() || "Notification";

  return {
    id,
    message: normalizedMessage,
    tone: input.tone ?? "info",
    durationMs: Math.max(800, input.durationMs ?? DEFAULT_TOAST_DURATION_MS),
    createdAt: now,
    title: input.title,
    icon: input.icon,
    dedupeKey:
      input.dedupeKey ??
      [input.tone ?? "info", input.title ?? "", normalizedMessage].join("|"),
  };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastDefinition[]>([]);
  const toastCounterRef = useRef(0);
  const timeoutMapRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const recentToastMapRef = useRef<Record<string, { id: string; createdAt: number }>>(
    {}
  );

  const dismissToast = useCallback((toastId: string) => {
    const timeoutId = timeoutMapRef.current[toastId];

    if (timeoutId) {
      clearTimeout(timeoutId);
      delete timeoutMapRef.current[toastId];
    }

    setToasts((previousToasts) =>
      previousToasts.filter((toast) => toast.id !== toastId)
    );
  }, []);

  useEffect(() => {
    return () => {
      Object.values(timeoutMapRef.current).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });

      timeoutMapRef.current = {};
      recentToastMapRef.current = {};
    };
  }, []);

  const notify = useCallback(
    (input: ToastInput) => {
      const now = Date.now();
      const toastId = `toast-${toastCounterRef.current + 1}`;
      toastCounterRef.current += 1;

      const nextToast = buildToast(toastId, input, now);
      const recentToast = nextToast.dedupeKey
        ? recentToastMapRef.current[nextToast.dedupeKey]
        : null;

      if (
        recentToast &&
        now - recentToast.createdAt <= DUPLICATE_SUPPRESSION_WINDOW_MS
      ) {
        return recentToast.id;
      }

      if (nextToast.dedupeKey) {
        recentToastMapRef.current[nextToast.dedupeKey] = {
          id: nextToast.id,
          createdAt: now,
        };
      }

      setToasts((previousToasts) => {
        const nextToasts = [...previousToasts, nextToast];

        if (nextToasts.length <= MAX_ACTIVE_TOASTS) {
          return nextToasts;
        }

        const overflowCount = nextToasts.length - MAX_ACTIVE_TOASTS;
        const toRemove = nextToasts.slice(0, overflowCount);

        toRemove.forEach((toast) => {
          const timeoutId = timeoutMapRef.current[toast.id];

          if (timeoutId) {
            clearTimeout(timeoutId);
            delete timeoutMapRef.current[toast.id];
          }
        });

        return nextToasts.slice(-MAX_ACTIVE_TOASTS);
      });

      timeoutMapRef.current[toastId] = setTimeout(() => {
        dismissToast(toastId);
      }, nextToast.durationMs);

      return toastId;
    },
    [dismissToast]
  );

  const createToneNotifier = useCallback(
    (tone: ToastTone) =>
      (message: string, options?: Omit<ToastInput, "message" | "tone">) =>
        notify({
          ...options,
          message,
          tone,
        }),
    [notify]
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      notify,
      dismissToast,
      notifySuccess: createToneNotifier("success"),
      notifyError: createToneNotifier("error"),
      notifyInfo: createToneNotifier("info"),
      notifyWarning: createToneNotifier("warning"),
    }),
    [createToneNotifier, dismissToast, notify]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider.");
  }

  return context;
}
