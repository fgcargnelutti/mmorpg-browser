import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import GameDialog from "../../../../components/GameDialog";
import "./HideoutDialog.css";
function getActionLabel(level) {
    return level === 0 ? "Build" : "Upgrade";
}
export default function HideoutDialog({ isOpen, hideoutName, structures, inventoryEntries, storageEntries, onClose, onUpgrade, onDepositItem, onWithdrawItem, }) {
    const handleDragStart = (payload) => (event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/howl-of-collapse-transfer", JSON.stringify(payload));
    };
    const allowDrop = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };
    const handleDropToStorage = (event) => {
        event.preventDefault();
        const rawPayload = event.dataTransfer.getData("application/howl-of-collapse-transfer");
        if (!rawPayload) {
            return;
        }
        const payload = JSON.parse(rawPayload);
        if (payload.source !== "inventory") {
            return;
        }
        onDepositItem(payload.itemKey);
    };
    const handleDropToInventory = (event) => {
        event.preventDefault();
        const rawPayload = event.dataTransfer.getData("application/howl-of-collapse-transfer");
        if (!rawPayload) {
            return;
        }
        const payload = JSON.parse(rawPayload);
        if (payload.source !== "storage") {
            return;
        }
        onWithdrawItem(payload.itemKey);
    };
    if (!isOpen) {
        return null;
    }
    return (_jsx("div", { className: "hideout-dialog-anchor", children: _jsx(GameDialog, { title: `Hideout - ${hideoutName}`, subtitle: "Expand your camp, unlock future utility, and prepare the outskirts for longer survival.", onClose: onClose, children: _jsxs("div", { className: "hideout-dialog-content", children: [_jsxs("section", { className: "hideout-storage-panel", children: [_jsx("div", { className: "hideout-storage-panel__header", children: _jsxs("div", { children: [_jsx("h4", { children: "Storage Chest" }), _jsx("p", { children: "Drag resources between your pack and the hideout chest. Gold is stored here separately from item stacks." })] }) }), _jsxs("div", { className: "hideout-storage-transfer", children: [_jsxs("section", { className: "hideout-storage-column", children: [_jsxs("div", { className: "hideout-storage-column__title-row", children: [_jsx("strong", { children: "Inventory" }), _jsxs("span", { children: [inventoryEntries.length, " item types"] })] }), _jsx("div", { className: "hideout-storage-dropzone", onDragOver: allowDrop, onDrop: handleDropToInventory, children: _jsx("div", { className: "hideout-storage-grid", children: inventoryEntries.length > 0 ? (inventoryEntries.map((entry) => (_jsxs("button", { type: "button", className: "hideout-storage-slot", draggable: true, onDragStart: handleDragStart({
                                                            itemKey: entry.itemKey,
                                                            source: "inventory",
                                                        }), title: `${entry.name} x${entry.count}`, children: [_jsx("span", { className: "hideout-storage-slot__icon", children: entry.iconGlyph }), _jsxs("span", { className: "hideout-storage-slot__count", children: ["x", entry.count] })] }, `inventory-${entry.itemKey}`)))) : (_jsx("div", { className: "hideout-storage-empty", children: "Your inventory is empty." })) }) })] }), _jsxs("section", { className: "hideout-storage-column", children: [_jsxs("div", { className: "hideout-storage-column__title-row", children: [_jsx("strong", { children: "Hideout Chest" }), _jsxs("span", { children: [storageEntries.length, " stored types"] })] }), _jsx("div", { className: "hideout-storage-dropzone", onDragOver: allowDrop, onDrop: handleDropToStorage, children: _jsx("div", { className: "hideout-storage-grid", children: storageEntries.length > 0 ? (storageEntries.map((entry) => (_jsxs("button", { type: "button", className: "hideout-storage-slot hideout-storage-slot--stored", draggable: true, onDragStart: handleDragStart({
                                                            itemKey: entry.itemKey,
                                                            source: "storage",
                                                        }), title: `${entry.name} x${entry.count}`, children: [_jsx("span", { className: "hideout-storage-slot__icon", children: entry.iconGlyph }), _jsxs("span", { className: "hideout-storage-slot__count", children: ["x", entry.count] })] }, `storage-${entry.itemKey}`)))) : (_jsx("div", { className: "hideout-storage-empty", children: "Drop items or gold here to store them." })) }) })] })] })] }), _jsx("div", { className: "hideout-dialog-layout", children: structures.map(({ definition, progress, eligibility }) => (_jsxs("section", { className: "hideout-card", children: [_jsxs("div", { className: "hideout-card__header", children: [_jsxs("div", { children: [_jsx("h4", { children: definition.name }), _jsx("p", { children: definition.description })] }), _jsxs("span", { className: "hideout-card__level", children: ["Lv. ", progress.level] })] }), _jsx("div", { className: "hideout-card__body", children: eligibility.nextTier ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "hideout-card__tier", children: [_jsx("strong", { children: eligibility.nextTier.label }), _jsx("span", { children: eligibility.nextTier.description })] }), _jsxs("div", { className: "hideout-card__costs", children: [_jsx("strong", { children: "Build costs" }), _jsx("div", { className: "hideout-card__cost-list", children: eligibility.nextTier.buildCosts.map((cost) => (_jsxs("span", { className: "hideout-cost-chip", children: [cost.amount, "x ", cost.itemKey] }, `${definition.key}-${cost.itemKey}`))) })] }), eligibility.nextTier.unlockedFunctions?.length ? (_jsxs("div", { className: "hideout-card__functions", children: [_jsx("strong", { children: "Future utility" }), _jsx("div", { className: "hideout-card__function-list", children: eligibility.nextTier.unlockedFunctions.map((entry) => (_jsx("span", { children: entry }, `${definition.key}-${entry}`))) })] })) : null, eligibility.reasons.length > 0 ? (_jsxs("div", { className: "hideout-card__requirements", children: [_jsx("strong", { children: "Requirements" }), _jsx("div", { className: "hideout-card__requirement-list", children: eligibility.reasons.map((reason) => (_jsx("span", { children: reason }, `${definition.key}-${reason}`))) })] })) : null, _jsxs("button", { type: "button", className: "hideout-card__action", onClick: () => onUpgrade(definition.key), disabled: !eligibility.canUpgrade, children: [getActionLabel(progress.level), " to Lv. ", eligibility.nextTier.level] })] })) : (_jsxs("div", { className: "hideout-card__maxed", children: [_jsx("strong", { children: "Maximum level reached" }), _jsx("span", { children: "This structure is fully developed for the current prototype." })] })) })] }, definition.key))) })] }) }) }));
}
