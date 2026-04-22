import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GameDialog from "../../../../components/GameDialog";
import { useMiningMinigame } from "../../application/hooks/useMiningMinigame";
import "./MiningDialog.css";
function formatSeconds(milliseconds) {
    return (milliseconds / 1000).toFixed(1);
}
export default function MiningDialog({ isOpen, config, onClose, onSuccess, onFailure, }) {
    const { phase, weakPoint, progress, timeRemainingMs, hits, misses, combo, impactState, handleWeakPointClick, handleRockMissClick, } = useMiningMinigame({
        config,
        isOpen,
        onSuccess,
        onFailure,
    });
    if (!isOpen) {
        return null;
    }
    return (_jsx("div", { className: "mining-dialog-anchor", children: _jsx(GameDialog, { title: `Mining - ${config.name}`, subtitle: config.description, onClose: onClose, children: _jsxs("div", { className: "mining-dialog-layout", children: [_jsxs("section", { className: "mining-panel mining-panel--core", children: [_jsxs("div", { className: "mining-panel__header", children: [_jsx("strong", { children: "Break the seam" }), _jsx("span", { children: "Strike the weak points before the opening closes." })] }), _jsxs("div", { className: `mining-rock mining-rock--${impactState}`, onClick: handleRockMissClick, role: "presentation", children: [_jsx("div", { className: "mining-rock__surface" }), _jsx("div", { className: "mining-rock__vein mining-rock__vein--one" }), _jsx("div", { className: "mining-rock__vein mining-rock__vein--two" }), _jsx("div", { className: "mining-rock__dust" }), phase === "active" && weakPoint ? (_jsxs("button", { type: "button", className: "mining-weak-point", style: {
                                            left: `${weakPoint.leftPercent}%`,
                                            top: `${weakPoint.topPercent}%`,
                                            width: `${weakPoint.sizePx}px`,
                                            height: `${weakPoint.sizePx}px`,
                                        }, onClick: (event) => {
                                            event.stopPropagation();
                                            handleWeakPointClick();
                                        }, "aria-label": "Strike weak point", children: [_jsx("span", { className: "mining-weak-point__outer" }), _jsx("span", { className: "mining-weak-point__inner" }), _jsx("span", { className: "mining-weak-point__spark" })] })) : null, _jsx("div", { className: "mining-rock__status", children: phase === "active"
                                            ? "Keep landing clean strikes."
                                            : phase === "success"
                                                ? "Seam broken."
                                                : "The seam holds." })] })] }), _jsxs("section", { className: "mining-panel mining-panel--hud", children: [_jsxs("div", { className: "mining-panel__header", children: [_jsx("strong", { children: "Extraction status" }), _jsx("span", { children: "Precision matters more than brute force." })] }), _jsxs("div", { className: "mining-hud", children: [_jsxs("div", { className: "mining-hud__row", children: [_jsx("span", { children: "Time" }), _jsxs("strong", { children: [formatSeconds(timeRemainingMs), "s"] })] }), _jsxs("div", { className: "mining-hud__row", children: [_jsx("span", { children: "Progress" }), _jsxs("strong", { children: [Math.round(progress), "%"] })] }), _jsxs("div", { className: "mining-hud__row", children: [_jsx("span", { children: "Hits" }), _jsx("strong", { children: hits })] }), _jsxs("div", { className: "mining-hud__row", children: [_jsx("span", { children: "Misses" }), _jsx("strong", { children: misses })] }), _jsxs("div", { className: "mining-hud__row", children: [_jsx("span", { children: "Combo" }), _jsxs("strong", { children: ["x", combo] })] })] }), _jsxs("div", { className: "mining-progress", children: [_jsxs("div", { className: "mining-progress__label-row", children: [_jsx("span", { children: "Ore extraction" }), _jsxs("strong", { children: [Math.round(progress), "%"] })] }), _jsx("div", { className: "mining-progress__track", children: _jsx("div", { className: "mining-progress__fill", style: { width: `${progress}%` } }) })] }), _jsxs("div", { className: "mining-instructions", children: [_jsx("span", { children: "Click each weak point before it fades." }), _jsx("span", { children: "Missing the mark reduces progress slightly." }), _jsx("span", { children: "Fill the bar before time runs out." })] }), (phase === "success" || phase === "failure") ? (_jsxs("div", { className: "mining-result", children: [_jsx("strong", { children: phase === "success"
                                            ? `You extracted ${config.rewardAmount}x ${config.rewardItemKey}.`
                                            : "The seam closes before you can break it open." }), _jsx("div", { className: "mining-result__actions", children: _jsx("button", { type: "button", onClick: onClose, children: "Close" }) })] })) : null] })] }) }) }));
}
