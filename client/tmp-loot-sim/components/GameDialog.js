import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./GameDialog.css";
export default function GameDialog({ title, subtitle, isMinimized = false, minimizedIcon = "✦", onMinimize, onExpand, onClose, children, }) {
    if (isMinimized) {
        return (_jsx("button", { className: "game-dialog-fab", type: "button", onClick: onExpand, "aria-label": `Expand ${title}`, title: `Expand ${title}`, children: minimizedIcon }));
    }
    return (_jsxs("section", { className: "game-dialog", children: [_jsxs("div", { className: "game-dialog__header", children: [_jsxs("div", { className: "game-dialog__heading", children: [_jsx("h3", { children: title }), subtitle ? _jsx("p", { children: subtitle }) : null] }), _jsxs("div", { className: "game-dialog__header-actions", children: [onMinimize ? (_jsx("button", { className: "game-dialog__minimize", type: "button", onClick: onMinimize, "aria-label": `Minimize ${title}`, title: "Minimize", children: "_" })) : null, onClose ? (_jsx("button", { className: "game-dialog__close", type: "button", onClick: onClose, "aria-label": `Close ${title}`, title: "Close", children: "\u2715" })) : null] })] }), _jsx("div", { className: "game-dialog__body", children: children })] }));
}
