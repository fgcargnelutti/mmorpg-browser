import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import Tooltip from "../../../../components/Tooltip";
import { combatActionBarOrder, combatActionCatalog, } from "../../domain/combatActionCatalog";
import "./CombatActionBar.css";
export default function CombatActionBar({ combatState, activeCombatantName, actionAvailabilities, onAction, disabled = false, leftControls, }) {
    const availabilityByActionId = new Map(actionAvailabilities.map((entry) => [entry.actionId, entry]));
    return (_jsxs("section", { className: "combat-action-bar", children: [_jsxs("div", { className: "combat-action-bar__header", children: [_jsxs("strong", { children: [activeCombatantName, "'s turn"] }), _jsxs("span", { children: ["Round ", combatState.turn.round] })] }), _jsxs("div", { className: "combat-action-bar__body", children: [leftControls ? (_jsx("div", { className: "combat-action-bar__controls", children: leftControls })) : null, _jsx("div", { className: "combat-action-bar__grid", children: combatActionBarOrder.map((actionId) => {
                            const action = combatActionCatalog[actionId];
                            const availability = availabilityByActionId.get(actionId);
                            const isDisabled = disabled || (availability ? !availability.isEnabled : true);
                            const tooltipContent = (_jsxs(_Fragment, { children: [_jsx("strong", { children: action.label }), _jsxs("p", { children: ["Hotkey: ", action.hotkey ?? "-"] }), availability?.reason ? _jsx("p", { children: availability.reason }) : null] }));
                            return (_jsx(Tooltip, { content: tooltipContent, children: _jsxs("button", { type: "button", className: `combat-action-bar__button combat-action-bar__button--${action.type}`, onClick: () => onAction(action.id), disabled: isDisabled, "aria-label": action.label, children: [action.iconImageSrc ? (_jsx("img", { className: "combat-action-bar__icon-image", src: action.iconImageSrc, alt: "", "aria-hidden": "true" })) : (_jsx("span", { className: "combat-action-bar__icon", "data-icon-key": action.iconKey, "aria-hidden": "true", children: action.fallbackIcon ?? "•" })), _jsx("span", { className: "combat-action-bar__hotkey", children: action.hotkey ?? "-" })] }) }, action.id));
                        }) })] })] }));
}
