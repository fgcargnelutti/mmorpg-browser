import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./MapGlobalActionsPanel.css";
export default function MapGlobalActionsPanel({ actions, huntingStatus, activeActionLabel, completedEncounters = 0, onAction, onStop, }) {
    if (actions.length === 0 && huntingStatus !== "hunting") {
        return null;
    }
    return (_jsxs("aside", { className: "map-global-actions-panel", children: [_jsxs("div", { className: "map-global-actions-panel__header", children: [_jsx("strong", { children: "Map Actions" }), huntingStatus === "hunting" ? (_jsx("span", { className: "map-global-actions-panel__badge", children: "Active" })) : null] }), huntingStatus === "hunting" ? (_jsxs("div", { className: "map-global-actions-panel__active", children: [_jsxs("div", { children: [_jsx("strong", { children: activeActionLabel ?? "Hunting" }), _jsxs("p", { children: [completedEncounters, " encounter(s) cleared in this run."] })] }), _jsx("button", { type: "button", className: "map-global-actions-panel__button map-global-actions-panel__button--stop", onClick: onStop, children: "Stop" })] })) : (_jsx("div", { className: "map-global-actions-panel__list", children: actions.map((action) => (_jsxs("button", { type: "button", className: "map-global-actions-panel__button", onClick: () => onAction(action), children: [_jsx("strong", { children: action.label }), _jsx("span", { children: action.description })] }, action.id))) }))] }));
}
