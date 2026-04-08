import { create } from "zustand";

export const useUiStore = create((set) => ({
  toasts: [],
  pushToast: (message, type = "error") =>
    set((s) => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const next = [...s.toasts, { id, message, type }];
      setTimeout(() => {
        set((st) => ({ toasts: st.toasts.filter((t) => t.id !== id) }));
      }, 4000);
      return { toasts: next };
    }),
}));
