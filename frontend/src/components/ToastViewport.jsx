import { useUiStore } from "../store/uiStore";

export default function ToastViewport() {
  const toasts = useUiStore((s) => s.toasts);
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
