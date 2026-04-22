import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./RegionPlayersIndicator.css";
import { useRegionPlayers } from "../hooks/useRegionPlayers";
export default function RegionPlayersIndicator({ currentMapId, currentMapName, currentPlayerName, onSendMessage, onInviteToHunt, }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inspectedPlayerId, setInspectedPlayerId] = useState(null);
    const containerRef = useRef(null);
    const panelId = useId();
    const { players, onlineCount } = useRegionPlayers({
        currentMapId,
        currentPlayerName,
    });
    const regionPlayerActions = useMemo(() => [
        {
            id: "send-message",
            label: "Send message",
            onSelect: onSendMessage,
        },
        {
            id: "invite-to-hunt",
            label: "Invite to hunt",
            onSelect: onInviteToHunt,
        },
    ], [onInviteToHunt, onSendMessage]);
    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!containerRef.current)
                return;
            if (containerRef.current.contains(event.target))
                return;
            setIsOpen(false);
            setInspectedPlayerId(null);
        };
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                setInspectedPlayerId(null);
            }
        };
        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    return (_jsxs("div", { ref: containerRef, className: "region-players", children: [_jsxs("button", { type: "button", className: `region-players__trigger ${isOpen ? "is-open" : ""}`, onClick: () => {
                    setIsOpen((previous) => !previous);
                    setInspectedPlayerId(null);
                }, "aria-expanded": isOpen, "aria-haspopup": "dialog", "aria-controls": panelId, children: [_jsx("span", { className: "region-players__status-dot", "aria-hidden": "true" }), _jsxs("span", { className: "region-players__label", children: ["Players in this region", _jsxs("strong", { className: "region-players__count", children: ["(", onlineCount, ")"] })] })] }), isOpen ? (_jsxs("section", { id: panelId, className: "region-players__panel", "aria-label": "Players online here", children: [_jsxs("div", { className: "region-players__panel-header", children: [_jsx("strong", { children: "Players online here" }), _jsx("span", { children: currentMapName })] }), players.length === 0 ? (_jsx("div", { className: "region-players__empty", children: "No other players online in this region." })) : (_jsx("div", { className: "region-players__list", children: players.map((player) => (_jsxs("article", { className: "region-players__item", children: [_jsxs("div", { className: "region-players__item-main", children: [_jsx("strong", { children: player.name }), player.detail ? (_jsx("span", { className: "region-players__item-detail", children: player.detail })) : null] }), _jsxs("div", { className: "region-players__actions", children: [_jsx("button", { type: "button", className: `region-players__action-button ${inspectedPlayerId === player.id
                                                ? "region-players__action-button--active"
                                                : ""}`, onClick: () => setInspectedPlayerId((currentId) => currentId === player.id ? null : player.id), children: "Inspect" }), regionPlayerActions.map((action) => (_jsx("button", { type: "button", className: "region-players__action-button", onClick: () => action.onSelect?.(player.id, player.name), children: action.label }, action.id)))] }), inspectedPlayerId === player.id ? (_jsxs("div", { className: "region-players__inspect-panel", "aria-label": `Inspect ${player.name}`, children: [_jsxs("div", { className: "region-players__inspect-row", children: [_jsx("span", { children: "Player" }), _jsx("strong", { children: player.name })] }), _jsxs("div", { className: "region-players__inspect-row", children: [_jsx("span", { children: "Region" }), _jsx("strong", { children: currentMapName })] }), _jsxs("div", { className: "region-players__inspect-row", children: [_jsx("span", { children: "Status" }), _jsx("strong", { children: "Online" })] }), _jsx("p", { className: "region-players__inspect-note", children: player.detail ??
                                                "No additional inspection details are available yet." })] })) : null] }, player.id))) }))] })) : null] }));
}
