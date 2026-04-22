import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./ToastViewport.css";
function getToneIcon(toast) {
    if (toast.icon) {
        return toast.icon;
    }
    switch (toast.tone) {
        case "success":
            return "✓";
        case "error":
            return "!";
        case "warning":
            return "•";
        default:
            return "i";
    }
}
export default function ToastViewport({ toasts, onDismiss, }) {
    return (_jsx("div", { className: "toast-viewport", "aria-live": "polite", "aria-atomic": "false", children: toasts.map((toast) => (_jsxs("article", { className: `toast-card toast-card--${toast.tone}`, role: "status", children: [_jsx("div", { className: "toast-card__icon", "aria-hidden": "true", children: getToneIcon(toast) }), _jsxs("div", { className: "toast-card__content", children: [toast.title ? (_jsx("strong", { className: "toast-card__title", children: toast.title })) : null, _jsx("p", { className: "toast-card__message", children: toast.message })] }), _jsx("button", { type: "button", className: "toast-card__dismiss", "aria-label": "Dismiss notification", onClick: () => onDismiss(toast.id), children: "\u00D7" })] }, toast.id))) }));
}
