import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GameDialog from "./GameDialog";
import "./ContextActions.css";
export default function ContextActions({ state, locationName, locationDescription, actions, onMinimize, onExpand, onAction, }) {
    if (state === "hidden") {
        return null;
    }
    return (_jsx(GameDialog, { title: locationName, subtitle: locationDescription, isMinimized: state === "minimized", minimizedIcon: "\u2726", onMinimize: onMinimize, onExpand: onExpand, children: _jsx("div", { className: "context-dialog__actions", children: actions.map((action) => (_jsxs("button", { className: "context-dialog__action", type: "button", onClick: () => onAction(action), children: [_jsx("strong", { children: action.label }), _jsx("span", { children: action.description })] }, action.id))) }) }));
}
