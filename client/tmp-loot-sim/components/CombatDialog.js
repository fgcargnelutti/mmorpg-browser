import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import GameDialog from "./GameDialog";
import "./CombatDialog.css";
import CombatActionBar from "../features/combat/presentation/components/CombatActionBar";
export default function CombatDialog({ isOpen, enemyName, enemyTitle: _enemyTitle, enemyHp, enemyMaxHp, combatLog, combatState, actionAvailabilities, isResolved, onAction, onRetreat, onClose, loopStatusLabel: _loopStatusLabel, onStopLoop, }) {
    const logViewportRef = useRef(null);
    useEffect(() => {
        const logViewport = logViewportRef.current;
        if (!logViewport) {
            return;
        }
        logViewport.scrollTop = logViewport.scrollHeight;
    }, [combatLog]);
    if (!isOpen)
        return null;
    const hpPercent = enemyMaxHp > 0 ? Math.max(0, (enemyHp / enemyMaxHp) * 100) : 0;
    const activeCombatantName = combatState
        ? combatState.combatants[combatState.turn.activeCombatantId]?.name ?? "Unknown"
        : "Unknown";
    const hasCombatStarted = combatLog.length > 1;
    const showStopHuntOnly = !hasCombatStarted && Boolean(onStopLoop);
    const showRetreat = !isResolved && hasCombatStarted;
    const leftControls = (_jsxs(_Fragment, { children: [showStopHuntOnly && onStopLoop ? (_jsx("button", { type: "button", className: "combat-dialog-button combat-dialog-button--secondary", onClick: onStopLoop, children: "Stop Hunt" })) : null, showRetreat ? (_jsx("button", { type: "button", className: "combat-dialog-button combat-dialog-button--secondary", onClick: onRetreat, children: "Retreat" })) : null] }));
    return (_jsx("div", { className: "combat-dialog-anchor", children: _jsx(GameDialog, { title: "", onClose: onClose, children: _jsxs("div", { className: "combat-dialog-layout", children: [_jsxs("div", { className: "combat-dialog-main", children: [_jsxs("div", { className: "combat-dialog-log-panel", children: [_jsx("div", { className: "combat-dialog-panel-title", children: "Combat Log" }), _jsx("div", { ref: logViewportRef, className: "combat-dialog-log", children: combatLog.map((line, index) => (_jsx("p", { children: line }, `${line}-${index}`))) })] }), _jsx("div", { className: "combat-dialog-creature-panel", "aria-label": "Creature panel", children: _jsxs("div", { className: "combat-dialog-creature-stage", children: [_jsxs("div", { className: "combat-dialog-creature-overlay", children: [_jsx("strong", { children: enemyName }), _jsxs("div", { className: "combat-dialog-creature-hp", children: [_jsx("span", { children: "Hitpoints" }), _jsxs("span", { children: [enemyHp, " / ", enemyMaxHp] })] }), _jsx("div", { className: "combat-dialog-hp-bar", children: _jsx("div", { className: "combat-dialog-hp-bar-fill", style: { width: `${hpPercent}%` } }) })] }), _jsx("div", { className: "combat-dialog-portrait-frame", children: _jsx("div", { className: "combat-dialog-portrait-glow" }) })] }) })] }), _jsx("div", { className: "combat-dialog-bottom", children: combatState ? (_jsx(CombatActionBar, { combatState: combatState, activeCombatantName: activeCombatantName, actionAvailabilities: actionAvailabilities, onAction: onAction, leftControls: leftControls, disabled: combatState.turn.activeCombatantId !== combatState.playerCombatantId })) : null })] }) }) }));
}
