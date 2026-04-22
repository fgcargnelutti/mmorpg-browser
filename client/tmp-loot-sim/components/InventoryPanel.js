import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import Tooltip from "./Tooltip";
const defaultInventoryHeight = 430;
const minInventoryHeight = 320;
const maxInventoryHeight = 720;
export default function InventoryPanel({ items, currentWeight, maxWeight, }) {
    const visibleSlotCount = Math.max(items.length, 20);
    const emptySlotCount = Math.max(0, visibleSlotCount - items.length);
    const [panelHeight, setPanelHeight] = useState(defaultInventoryHeight);
    const resizeStateRef = useRef(null);
    useEffect(() => {
        const handlePointerMove = (event) => {
            const resizeState = resizeStateRef.current;
            if (!resizeState || resizeState.pointerId !== event.pointerId) {
                return;
            }
            const nextHeight = Math.max(minInventoryHeight, Math.min(maxInventoryHeight, resizeState.startHeight + (event.clientY - resizeState.startY)));
            setPanelHeight(nextHeight);
        };
        const handlePointerUp = (event) => {
            if (resizeStateRef.current?.pointerId !== event.pointerId) {
                return;
            }
            resizeStateRef.current = null;
            document.body.style.userSelect = "";
        };
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            document.body.style.userSelect = "";
        };
    }, []);
    const handleResizeStart = (event) => {
        resizeStateRef.current = {
            pointerId: event.pointerId,
            startY: event.clientY,
            startHeight: panelHeight,
        };
        document.body.style.userSelect = "none";
        event.currentTarget.setPointerCapture(event.pointerId);
    };
    return (_jsxs("section", { className: "ui-panel sidebar-panel sidebar-panel--scroll inventory-panel", style: { height: `${panelHeight}px` }, children: [_jsxs("div", { className: "panel-title-row inventory-title-row", children: [_jsx("h2", { children: "Inventory" }), _jsxs("span", { className: "inventory-weight", children: ["Weight (", currentWeight, "/", maxWeight, "Kg)"] })] }), _jsx("div", { className: "inventory-panel__body", children: _jsxs("div", { className: "inventory-grid inventory-grid-slots", children: [items.length === 0 ? (_jsx("div", { className: "inventory-empty-copy", children: "Inventory is empty." })) : (items.map((item) => (_jsx(Tooltip, { content: _jsxs(_Fragment, { children: [_jsx("strong", { children: item.name }), _jsx("p", { children: item.description }), _jsxs("ul", { children: [_jsxs("li", { children: ["Weight: ", item.weight, "Kg each"] }), _jsxs("li", { children: ["Total: ", (item.weight * item.count).toFixed(1), "Kg"] }), item.stats?.map((stat) => _jsx("li", { children: stat }, stat))] })] }), children: _jsxs("div", { className: `inventory-slot inventory-square-slot inventory-square-slot--${item.iconTone}`, "aria-label": `${item.name}, quantity ${item.count}`, draggable: true, onDragStart: (event) => {
                                    event.dataTransfer.effectAllowed = "move";
                                    event.dataTransfer.setData("application/howl-of-collapse-trade-item", JSON.stringify({
                                        itemKey: item.itemKey,
                                        count: item.count,
                                    }));
                                }, children: [item.iconImageSrc ? (_jsx("img", { className: "inventory-item-image", src: item.iconImageSrc, alt: "", "aria-hidden": "true" })) : (_jsx("span", { className: "inventory-item-icon", "aria-hidden": "true", title: item.iconLabel, children: item.iconGlyph })), _jsx("span", { className: "inventory-item-name", children: item.name }), _jsxs("span", { className: "inventory-item-count", children: ["x", item.count] })] }) }, item.key)))), Array.from({ length: emptySlotCount }).map((_, index) => (_jsx("div", { className: "inventory-slot inventory-square-slot inventory-square-slot--empty", "aria-hidden": "true", children: _jsx("span", { className: "inventory-slot-placeholder" }) }, `empty-slot-${index}`)))] }) }), _jsx("button", { type: "button", className: "inventory-resize-handle", "aria-label": "Resize inventory panel", onPointerDown: handleResizeStart })] }));
}
