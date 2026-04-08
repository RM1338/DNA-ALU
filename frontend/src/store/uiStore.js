import { create } from "zustand";

function normalizeMessage(input) {
  if (typeof input === "string" && input.trim()) return input;
  if (input instanceof Error && input.message) return input.message;
  if (input && typeof input === "object" && "message" in input && typeof input.message === "string") return input.message;
  return "An unexpected error occurred.";
}

export const useUiStore = create((set) => ({
  toasts: [],

  removeToast: (id) =>
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    })),

  pushToast: (message, type = "error") =>
    set((s) => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const normalizedType = type === "ok" ? "ok" : "error";
      const ttl = normalizedType === "ok" ? 5000 : 6000;
      const next = [...s.toasts, { id, message: normalizeMessage(message), type: normalizedType }];

      setTimeout(() => {
        set((st) => ({ toasts: st.toasts.filter((t) => t.id !== id) }));
      }, ttl);

      return { toasts: next };
    }),
}));
