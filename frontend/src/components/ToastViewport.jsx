import { useUiStore } from "../store/uiStore";

export default function ToastViewport() {
  const toasts = useUiStore((s) => s.toasts);
  const removeToast = useUiStore((s) => s.removeToast);

  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="toast-body">{t.message}</div>
          <button
            className="toast-close"
            aria-label="Close notification"
            onClick={() => removeToast(t.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
