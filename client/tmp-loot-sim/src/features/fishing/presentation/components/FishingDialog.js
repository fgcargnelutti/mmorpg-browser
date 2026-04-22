import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import GameDialog from "../../../../components/GameDialog";
import { useFishingMinigame } from "../../application/hooks/useFishingMinigame";
import "./FishingDialog.css";
function formatSeconds(milliseconds) {
    return (milliseconds / 1000).toFixed(1);
}
export default function FishingDialog({ isOpen, config, onClose, onSuccess, onFailure, }) {
    const { phase, hotspot, markerPosition, tension, timeRemainingMs, currentDirection, idealZoneCenter, idealZoneSize, handleHotspotClick, } = useFishingMinigame({
        config,
        isOpen,
        onCatch: onSuccess,
        onEscape: onFailure,
    });
    if (!isOpen) {
        return null;
    }
    const idealZoneTop = idealZoneCenter - idealZoneSize / 2;
    return (_jsx("div", { className: "fishing-dialog-anchor", children: _jsx(GameDialog, { title: `Fishing - ${config.name}`, subtitle: config.description, onClose: onClose, children: _jsxs("div", { className: "fishing-dialog-layout", children: [_jsxs("section", { className: "fishing-panel fishing-panel--lake", children: [_jsxs("div", { className: "fishing-panel__header", children: [_jsx("strong", { children: "Stage 1 - Hook the fish" }), _jsx("span", { children: "Click the ripple before it disappears." })] }), _jsxs("div", { className: "fishing-lake", children: [_jsx("div", { className: "fishing-lake__water" }), _jsx("div", { className: "fishing-lake__reed fishing-lake__reed--left" }), _jsx("div", { className: "fishing-lake__reed fishing-lake__reed--right" }), phase === "hook" && hotspot ? (_jsxs("button", { type: "button", className: "fishing-hotspot", style: {
                                            left: `${hotspot.leftPercent}%`,
                                            top: `${hotspot.topPercent}%`,
                                        }, onClick: handleHotspotClick, "aria-label": "Hook the fish", children: [_jsx("span", { className: "fishing-hotspot__ring" }), _jsx("span", { className: "fishing-hotspot__core" })] })) : null, phase === "struggle" ? (_jsx("div", { className: "fishing-lake__status fishing-lake__status--hooked", children: "Fish hooked. Hold the line." })) : null, phase === "success" ? (_jsx("div", { className: "fishing-lake__status fishing-lake__status--success", children: "Catch secured." })) : null, phase === "failure" ? (_jsx("div", { className: "fishing-lake__status fishing-lake__status--failure", children: "The line went slack." })) : null] })] }), _jsxs("section", { className: "fishing-panel fishing-panel--struggle", children: [_jsxs("div", { className: "fishing-panel__header", children: [_jsx("strong", { children: "Stage 2 - Fight the fish" }), _jsx("span", { children: "Use W and S to keep the marker centered." })] }), _jsxs("div", { className: "fishing-struggle", children: [_jsxs("div", { className: "fishing-struggle__hud", children: [_jsxs("div", { className: "fishing-struggle__hud-row", children: [_jsx("span", { children: "Direction" }), _jsx("strong", { children: currentDirection === "up" ? "Pulling Up" : "Pulling Down" })] }), _jsxs("div", { className: "fishing-struggle__hud-row", children: [_jsx("span", { children: "Time" }), _jsxs("strong", { children: [formatSeconds(timeRemainingMs), "s"] })] }), _jsxs("div", { className: "fishing-struggle__hud-row", children: [_jsx("span", { children: "Line Control" }), _jsxs("strong", { children: [Math.round(tension), "%"] })] })] }), _jsxs("div", { className: "fishing-struggle__body", children: [_jsxs("div", { className: "fishing-struggle__bar", children: [_jsx("div", { className: "fishing-struggle__ideal-zone", style: {
                                                            top: `${idealZoneTop}%`,
                                                            height: `${idealZoneSize}%`,
                                                        } }), _jsx("div", { className: "fishing-struggle__marker", style: { top: `${markerPosition}%` } })] }), _jsxs("div", { className: "fishing-struggle__instructions", children: [_jsx("span", { children: "W - pull upward" }), _jsx("span", { children: "S - pull downward" })] })] }), (phase === "success" || phase === "failure") && (_jsxs("div", { className: "fishing-struggle__result", children: [_jsx("strong", { children: phase === "success"
                                                    ? `You caught ${config.rewardAmount}x ${config.rewardItemKey}.`
                                                    : "The fish escaped this time." }), _jsx("div", { className: "fishing-struggle__result-actions", children: _jsx("button", { type: "button", onClick: onClose, children: "Close" }) })] }))] })] })] }) }) }));
}
