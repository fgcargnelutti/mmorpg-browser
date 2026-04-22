import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./EmptyStateNotice.css";
export default function EmptyStateNotice({ title, description, className = "", }) {
    const rootClassName = ["empty-state-notice", className].filter(Boolean).join(" ");
    return (_jsxs("div", { className: rootClassName, children: [_jsx("strong", { className: "empty-state-notice__title", children: title }), description ? (_jsx("p", { className: "empty-state-notice__description", children: description })) : null] }));
}
