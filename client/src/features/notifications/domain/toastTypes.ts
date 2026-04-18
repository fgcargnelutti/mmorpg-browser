export type ToastTone = "success" | "error" | "info" | "warning";

export type ToastDefinition = {
  id: string;
  message: string;
  tone: ToastTone;
  durationMs: number;
  createdAt: number;
  title?: string;
  icon?: string;
  dedupeKey?: string;
};

export type ToastInput = {
  message: string;
  tone?: ToastTone;
  durationMs?: number;
  title?: string;
  icon?: string;
  dedupeKey?: string;
};
