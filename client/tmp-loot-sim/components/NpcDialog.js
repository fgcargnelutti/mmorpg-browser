import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import GameDialog from "./GameDialog";
import "./NpcDialog.css";
import { janePortraitArt } from "../assets/npcs/portraits";
function getOptionStateClass(state) {
    switch (state) {
        case "new":
            return "is-new";
        case "completed":
            return "is-completed";
        case "locked":
            return "is-locked";
        default:
            return "is-unlocked";
    }
}
export default function NpcDialog({ isOpen, npcName, npcRole, dialogueLines, dialogueOptions, loreNotes, onClose, onOptionSelect, onBuyItem, onSellItems, buyOffers = [], sellInventoryEntries = [], sellPlaceholderMessage = "Drag items from your inventory into this panel to prepare a trade.", narrativeHint = "This NPC still has an important role in the story.", portraitSrc, }) {
    const dialogueScrollRef = useRef(null);
    const [tradeMode, setTradeMode] = useState(null);
    const [selectedBuyItemKey, setSelectedBuyItemKey] = useState(null);
    const [sellBasketEntries, setSellBasketEntries] = useState([]);
    const [selectedSellItemKey, setSelectedSellItemKey] = useState(null);
    const resolvedPortrait = portraitSrc ?? janePortraitArt;
    useEffect(() => {
        if (!dialogueScrollRef.current)
            return;
        dialogueScrollRef.current.scrollTop = dialogueScrollRef.current.scrollHeight;
    }, [dialogueLines]);
    useEffect(() => {
        if (!isOpen) {
            setTradeMode(null);
            setSelectedBuyItemKey(null);
            setSellBasketEntries([]);
            setSelectedSellItemKey(null);
        }
    }, [isOpen]);
    useEffect(() => {
        setSelectedBuyItemKey((currentKey) => {
            if (!buyOffers.length) {
                return null;
            }
            if (currentKey && buyOffers.some((offer) => offer.itemKey === currentKey)) {
                return currentKey;
            }
            return buyOffers[0].itemKey;
        });
    }, [buyOffers]);
    useEffect(() => {
        setSellBasketEntries((currentEntries) => currentEntries.filter((entry) => sellInventoryEntries.some((inventoryEntry) => inventoryEntry.itemKey === entry.itemKey &&
            inventoryEntry.count === entry.count)));
    }, [sellInventoryEntries]);
    const visibleTopics = dialogueOptions.filter((option) => option.state !== "locked");
    const activeTradeMode = isOpen ? tradeMode : null;
    const selectedBuyOffer = buyOffers.find((offer) => offer.itemKey === selectedBuyItemKey) ?? null;
    const selectedSellEntry = sellBasketEntries.find((entry) => entry.itemKey === selectedSellItemKey) ?? null;
    const sellableInventoryMap = useMemo(() => new Map(sellInventoryEntries.map((entry) => [entry.itemKey, entry])), [sellInventoryEntries]);
    const openTradeMode = (mode) => {
        setTradeMode((currentMode) => (currentMode === mode ? null : mode));
    };
    const allowSellDrop = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };
    const handleSellDrop = (event) => {
        event.preventDefault();
        const rawPayload = event.dataTransfer.getData("application/howl-of-collapse-trade-item");
        if (!rawPayload) {
            return;
        }
        const payload = JSON.parse(rawPayload);
        const inventoryEntry = sellableInventoryMap.get(payload.itemKey);
        if (!inventoryEntry) {
            return;
        }
        setTradeMode("sell");
        setSellBasketEntries((currentEntries) => {
            if (currentEntries.some((entry) => entry.itemKey === inventoryEntry.itemKey)) {
                return currentEntries;
            }
            return [...currentEntries, inventoryEntry];
        });
        setSelectedSellItemKey(inventoryEntry.itemKey);
    };
    const handleSellSelected = () => {
        if (!selectedSellEntry) {
            return;
        }
        const didSell = onSellItems?.([
            {
                itemKey: selectedSellEntry.itemKey,
                count: selectedSellEntry.count,
            },
        ]);
        if (!didSell) {
            return;
        }
        setSellBasketEntries((currentEntries) => currentEntries.filter((entry) => entry.itemKey !== selectedSellEntry.itemKey));
        setSelectedSellItemKey((currentKey) => currentKey === selectedSellEntry.itemKey ? null : currentKey);
    };
    const handleRemoveSellEntry = (itemKey) => {
        setSellBasketEntries((currentEntries) => currentEntries.filter((entry) => entry.itemKey !== itemKey));
        setSelectedSellItemKey((currentKey) => currentKey === itemKey ? null : currentKey);
    };
    const handleSellAll = () => {
        if (sellBasketEntries.length === 0) {
            return;
        }
        const didSell = onSellItems?.(sellBasketEntries.map((entry) => ({
            itemKey: entry.itemKey,
            count: entry.count,
        })));
        if (!didSell) {
            return;
        }
        setSellBasketEntries([]);
        setSelectedSellItemKey(null);
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "npc-dialog-anchor", children: _jsx(GameDialog, { title: npcName, subtitle: npcRole, onClose: onClose, children: _jsxs("div", { className: "npc-dialog-layout", children: [_jsxs("div", { className: "npc-dialog-main", children: [_jsxs("div", { className: "npc-dialog-top-row", children: [_jsx("div", { className: "npc-dialog-portrait", children: _jsx("div", { className: "npc-dialog-portrait-box", children: _jsx("img", { src: resolvedPortrait, alt: npcName, className: "npc-dialog-portrait-image" }) }) }), _jsxs("div", { className: "npc-dialog-notes-panel", children: [_jsx("div", { className: "npc-dialog-panel-header", children: _jsx("strong", { children: "Notes" }) }), _jsx("div", { className: "npc-dialog-notes-content", children: loreNotes.length === 0 ? (_jsx("p", { className: "npc-dialog-lore-empty", children: "No notes yet." })) : (loreNotes.map((note, index) => (_jsx("p", { children: note }, `${note}-${index}`)))) })] })] }), _jsxs("div", { className: "npc-dialog-bottom-row", children: [_jsx("div", { className: "npc-dialog-topics-panel", children: _jsx("div", { className: "npc-dialog-topics-list", children: visibleTopics.map((option) => {
                                                const optionStateClass = getOptionStateClass(option.state);
                                                return (_jsxs("button", { type: "button", className: `npc-dialog-topic-button ${optionStateClass}`, onClick: () => onOptionSelect(option.id), children: [_jsx("span", { className: "npc-dialog-topic-label", children: option.label }), option.state === "new" ? (_jsx("span", { className: "npc-dialog-topic-pill", children: "NEW" })) : null] }, option.id));
                                            }) }) }), _jsxs("div", { className: "npc-dialog-conversation-panel", children: [_jsx("div", { className: "npc-dialog-panel-header", children: _jsx("strong", { children: "Conversation" }) }), _jsx("div", { ref: dialogueScrollRef, className: "npc-dialog-main-text", children: dialogueLines.length === 0 ? (_jsx("p", { className: "npc-dialog-main-text-empty", children: "This character has nothing to say right now." })) : (dialogueLines.map((line, index) => (_jsx("p", { children: line }, `${line}-${index}`)))) })] })] }), _jsxs("div", { className: "npc-dialog-footer", children: [_jsxs("div", { className: "npc-dialog-footer-hint npc-dialog-footer-hint--narrative", children: [_jsx("span", { className: "npc-dialog-footer-hint-icon", children: "\u2726" }), _jsx("span", { children: narrativeHint })] }), _jsxs("div", { className: "npc-dialog-footer-actions", children: [_jsx("button", { type: "button", className: "npc-dialog-footer-button", onClick: onClose, children: "Close" }), _jsx("button", { type: "button", className: `npc-dialog-footer-button ${activeTradeMode === "buy" ? "is-active" : ""}`, onClick: () => openTradeMode("buy"), children: "Buy" }), _jsx("button", { type: "button", className: `npc-dialog-footer-button ${activeTradeMode === "sell" ? "is-active" : ""}`, onClick: () => openTradeMode("sell"), children: "Sell" })] })] })] }), _jsx("aside", { className: `npc-trade-panel ${activeTradeMode ? "npc-trade-panel--visible" : ""}`, children: activeTradeMode ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "npc-trade-panel__header", children: [_jsx("h4", { children: activeTradeMode === "buy" ? "Buy Items" : "Sell Items" }), _jsx("p", { children: activeTradeMode === "buy"
                                                ? "Select an item from the merchant list, then confirm the purchase below."
                                                : "Drop inventory items here, select one entry, and confirm the sale below." })] }), activeTradeMode === "buy" ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "npc-trade-panel__content npc-trade-panel__content--list", children: buyOffers.length > 0 ? (_jsx("div", { className: "trade-list", children: buyOffers.map((offer) => (_jsxs("button", { type: "button", className: `trade-list-item ${selectedBuyItemKey === offer.itemKey
                                                        ? "is-selected"
                                                        : ""}`, onClick: () => setSelectedBuyItemKey(offer.itemKey), children: [_jsxs("div", { className: "trade-list-item__main", children: [_jsx("strong", { children: offer.label }), _jsx("span", { children: offer.description })] }), _jsxs("span", { className: "trade-list-item__value", children: [offer.priceGold, " Gold"] })] }, offer.itemKey))) })) : (_jsxs("div", { className: "trade-empty-state", children: [_jsx("strong", { children: "No stock available" }), _jsx("p", { children: "This merchant does not have a real buy inventory in the current prototype." })] })) }), _jsxs("div", { className: "npc-trade-panel__footer", children: [_jsx("div", { className: "npc-trade-panel__selection", children: selectedBuyOffer ? (_jsxs(_Fragment, { children: [_jsx("strong", { children: selectedBuyOffer.label }), _jsxs("span", { children: [selectedBuyOffer.priceGold, " Gold"] })] })) : (_jsx("span", { children: "Select an item to buy." })) }), _jsx("button", { type: "button", className: "npc-trade-panel__confirm-button", onClick: () => {
                                                        if (selectedBuyOffer) {
                                                            onBuyItem?.(selectedBuyOffer);
                                                        }
                                                    }, disabled: !selectedBuyOffer, children: "Buy" })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "npc-trade-panel__content npc-trade-panel__content--sell", children: [_jsxs("div", { className: "trade-drop-zone", onDragOver: allowSellDrop, onDrop: handleSellDrop, children: [_jsx("strong", { children: "Sell Basket" }), _jsx("p", { children: sellPlaceholderMessage })] }), sellBasketEntries.length > 0 ? (_jsx("div", { className: "trade-list", children: sellBasketEntries.map((entry) => (_jsxs("div", { className: `trade-list-item ${selectedSellItemKey === entry.itemKey
                                                            ? "is-selected"
                                                            : ""}`, children: [_jsx("div", { className: "trade-list-item__main", children: _jsxs("button", { type: "button", className: "trade-list-item__select", onClick: () => setSelectedSellItemKey(entry.itemKey), children: [_jsx("strong", { children: entry.name }), _jsx("span", { children: entry.description })] }) }), _jsxs("div", { className: "trade-list-item__meta", children: [_jsxs("span", { className: "trade-list-item__value", children: ["x", entry.count] }), _jsx("button", { type: "button", className: "trade-list-item__remove", onClick: () => handleRemoveSellEntry(entry.itemKey), "aria-label": `Remove ${entry.name} from sell basket`, children: "Remove" })] })] }, entry.itemKey))) })) : (_jsxs("div", { className: "trade-empty-state", children: [_jsx("strong", { children: "No items in the sell basket" }), _jsx("p", { children: "Drag an eligible inventory stack into this panel to prepare the trade." })] }))] }), _jsxs("div", { className: "npc-trade-panel__footer", children: [_jsx("div", { className: "npc-trade-panel__selection", children: selectedSellEntry ? (_jsxs(_Fragment, { children: [_jsx("strong", { children: selectedSellEntry.name }), _jsxs("span", { children: ["x", selectedSellEntry.count] })] })) : (_jsx("span", { children: "Select a dropped item to sell." })) }), _jsx("button", { type: "button", className: "npc-trade-panel__secondary-button", onClick: handleSellAll, disabled: sellBasketEntries.length === 0, children: "Sell All" }), _jsx("button", { type: "button", className: "npc-trade-panel__confirm-button", onClick: handleSellSelected, disabled: !selectedSellEntry, children: "Sell" })] })] }))] })) : (_jsxs("div", { className: "npc-trade-panel__placeholder", children: [_jsx("strong", { children: "Trade" }), _jsx("p", { children: "Open Buy or Sell to manage commerce without shrinking the dialogue space." })] })) })] }) }) }));
}
