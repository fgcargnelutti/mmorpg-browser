import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import GameDialog from "./GameDialog";
import "./NpcDialog.css";
import { janePortraitArt } from "../assets/npcs/portraits";
import type { NpcShopOffer } from "../features/world/domain/npcProfilesData";
import type { InventoryPanelItem } from "./InventoryPanel";

export type DialogueTopicState =
  | "unlocked"
  | "new"
  | "completed"
  | "locked";

export type DialogueOption = {
  id: string;
  label: string;
  state?: DialogueTopicState;
  category?: string;
};

type TradeMode = "buy" | "sell" | null;

type NpcDialogProps = {
  isOpen: boolean;
  npcName: string;
  npcRole: string;
  dialogueLines: string[];
  dialogueOptions: DialogueOption[];
  loreNotes: string[];
  onClose: () => void;
  onOptionSelect: (optionId: string) => void;
  onBuyItem?: (offer: NpcShopOffer) => void;
  onSellItems?: (items: Array<{ itemKey: string; count: number }>) => boolean;
  buyOffers?: NpcShopOffer[];
  sellInventoryEntries?: InventoryPanelItem[];
  sellPlaceholderMessage?: string;
  narrativeHint?: string;
  showNarrativeStatus?: boolean;
  narrativeStatusText?: string;
  portraitSrc?: string;
};

function getOptionStateClass(state: DialogueTopicState | undefined) {
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

export default function NpcDialog({
  isOpen,
  npcName,
  npcRole,
  dialogueLines,
  dialogueOptions,
  loreNotes,
  onClose,
  onOptionSelect,
  onBuyItem,
  onSellItems,
  buyOffers = [],
  sellInventoryEntries = [],
  sellPlaceholderMessage = "Drag items from your inventory into this panel to prepare a trade.",
  narrativeHint = "This NPC still has an important role in the story.",
  portraitSrc,
}: NpcDialogProps) {
  const dialogueScrollRef = useRef<HTMLDivElement | null>(null);
  const [tradeMode, setTradeMode] = useState<TradeMode>(null);
  const [selectedBuyItemKey, setSelectedBuyItemKey] = useState<string | null>(null);
  const [sellBasketEntries, setSellBasketEntries] = useState<InventoryPanelItem[]>([]);
  const [selectedSellItemKey, setSelectedSellItemKey] = useState<string | null>(null);
  const resolvedPortrait = portraitSrc ?? janePortraitArt;

  useEffect(() => {
    if (!dialogueScrollRef.current) return;
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
    setSellBasketEntries((currentEntries) =>
      currentEntries.filter((entry) =>
        sellInventoryEntries.some(
          (inventoryEntry) =>
            inventoryEntry.itemKey === entry.itemKey &&
            inventoryEntry.count === entry.count
        )
      )
    );
  }, [sellInventoryEntries]);

  const visibleTopics = dialogueOptions.filter(
    (option) => option.state !== "locked"
  );
  const activeTradeMode = isOpen ? tradeMode : null;
  const selectedBuyOffer =
    buyOffers.find((offer) => offer.itemKey === selectedBuyItemKey) ?? null;
  const selectedSellEntry =
    sellBasketEntries.find((entry) => entry.itemKey === selectedSellItemKey) ?? null;
  const sellableInventoryMap = useMemo(
    () => new Map(sellInventoryEntries.map((entry) => [entry.itemKey, entry])),
    [sellInventoryEntries]
  );

  const openTradeMode = (mode: Exclude<TradeMode, null>) => {
    setTradeMode((currentMode) => (currentMode === mode ? null : mode));
  };

  const allowSellDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleSellDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const rawPayload = event.dataTransfer.getData(
      "application/howl-of-collapse-trade-item"
    );

    if (!rawPayload) {
      return;
    }

    const payload = JSON.parse(rawPayload) as { itemKey: string; count: number };
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

    setSellBasketEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.itemKey !== selectedSellEntry.itemKey)
    );
    setSelectedSellItemKey((currentKey) =>
      currentKey === selectedSellEntry.itemKey ? null : currentKey
    );
  };

  const handleRemoveSellEntry = (itemKey: string) => {
    setSellBasketEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.itemKey !== itemKey)
    );
    setSelectedSellItemKey((currentKey) =>
      currentKey === itemKey ? null : currentKey
    );
  };

  const handleSellAll = () => {
    if (sellBasketEntries.length === 0) {
      return;
    }

    const didSell = onSellItems?.(
      sellBasketEntries.map((entry) => ({
        itemKey: entry.itemKey,
        count: entry.count,
      }))
    );

    if (!didSell) {
      return;
    }

    setSellBasketEntries([]);
    setSelectedSellItemKey(null);
  };

  if (!isOpen) return null;

  return (
    <div className="npc-dialog-anchor">
      <GameDialog title={npcName} subtitle={npcRole} onClose={onClose}>
        <div className="npc-dialog-layout">
          <div className="npc-dialog-main">
            <div className="npc-dialog-top-row">
              <div className="npc-dialog-portrait">
                <div className="npc-dialog-portrait-box">
                  <img
                    src={resolvedPortrait}
                    alt={npcName}
                    className="npc-dialog-portrait-image"
                  />
                </div>
              </div>

              <div className="npc-dialog-notes-panel ornate-section ornate-corners">
                <div className="npc-dialog-panel-header ornate-header">
                  <strong>Notes</strong>
                </div>

                <div className="npc-dialog-notes-content">
                  {loreNotes.length === 0 ? (
                    <p className="npc-dialog-lore-empty">No notes yet.</p>
                  ) : (
                    loreNotes.map((note, index) => (
                      <p key={`${note}-${index}`}>{note}</p>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="npc-dialog-bottom-row">
              <div className="npc-dialog-topics-panel ornate-section ornate-corners">
                <div className="npc-dialog-topics-list">
                  {visibleTopics.map((option) => {
                    const optionStateClass = getOptionStateClass(option.state);

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`npc-dialog-topic-button ${optionStateClass}`}
                        onClick={() => onOptionSelect(option.id)}
                      >
                        <span className="npc-dialog-topic-label">
                          {option.label}
                        </span>

                        {option.state === "new" ? (
                          <span className="npc-dialog-topic-pill">NEW</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="npc-dialog-conversation-panel ornate-section ornate-corners">
                <div className="npc-dialog-panel-header ornate-header">
                  <strong>Conversation</strong>
                </div>

                <div ref={dialogueScrollRef} className="npc-dialog-main-text">
                  {dialogueLines.length === 0 ? (
                    <p className="npc-dialog-main-text-empty">
                      This character has nothing to say right now.
                    </p>
                  ) : (
                    dialogueLines.map((line, index) => (
                      <p key={`${line}-${index}`}>{line}</p>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="npc-dialog-footer">
              <div className="npc-dialog-footer-hint npc-dialog-footer-hint--narrative">
                <span className="npc-dialog-footer-hint-icon">✦</span>
                <span>{narrativeHint}</span>
              </div>

              <div className="npc-dialog-footer-actions">
                <button
                  type="button"
                  className="npc-dialog-footer-button ornate-button"
                  onClick={onClose}
                >
                  Close
                </button>

                <button
                  type="button"
                  className={`npc-dialog-footer-button ornate-button ${
                    activeTradeMode === "buy" ? "is-active" : ""
                  }`}
                  onClick={() => openTradeMode("buy")}
                >
                  Buy
                </button>

                <button
                  type="button"
                  className={`npc-dialog-footer-button ornate-button ${
                    activeTradeMode === "sell" ? "is-active" : ""
                  }`}
                  onClick={() => openTradeMode("sell")}
                >
                  Sell
                </button>
              </div>
            </div>
          </div>

          <aside
            className={`npc-trade-panel ornate-section ornate-corners ${
              activeTradeMode ? "npc-trade-panel--visible" : ""
            }`}
          >
            {activeTradeMode ? (
              <>
                <div className="npc-trade-panel__header">
                  <h4>{activeTradeMode === "buy" ? "Buy Items" : "Sell Items"}</h4>
                  <p>
                    {activeTradeMode === "buy"
                      ? "Select an item from the merchant list, then confirm the purchase below."
                      : "Drop inventory items here, select one entry, and confirm the sale below."}
                  </p>
                </div>

                {activeTradeMode === "buy" ? (
                  <>
                    <div className="npc-trade-panel__content npc-trade-panel__content--list">
                      {buyOffers.length > 0 ? (
                        <div className="trade-list">
                          {buyOffers.map((offer) => (
                            <button
                              key={offer.itemKey}
                              type="button"
                              className={`trade-list-item ${
                                selectedBuyItemKey === offer.itemKey
                                  ? "is-selected"
                                  : ""
                              }`}
                              onClick={() => setSelectedBuyItemKey(offer.itemKey)}
                            >
                              <div className="trade-list-item__main">
                                <strong>{offer.label}</strong>
                                <span>{offer.description}</span>
                              </div>
                              <span className="trade-list-item__value">
                                {offer.priceGold} Gold
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="trade-empty-state">
                          <strong>No stock available</strong>
                          <p>
                            This merchant does not have a real buy inventory in the
                            current prototype.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="npc-trade-panel__footer">
                      <div className="npc-trade-panel__selection">
                        {selectedBuyOffer ? (
                          <>
                            <strong>{selectedBuyOffer.label}</strong>
                            <span>{selectedBuyOffer.priceGold} Gold</span>
                          </>
                        ) : (
                          <span>Select an item to buy.</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="npc-trade-panel__confirm-button ornate-button"
                        onClick={() => {
                          if (selectedBuyOffer) {
                            onBuyItem?.(selectedBuyOffer);
                          }
                        }}
                        disabled={!selectedBuyOffer}
                      >
                        Buy
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="npc-trade-panel__content npc-trade-panel__content--sell">
                      <div
                        className="trade-drop-zone"
                        onDragOver={allowSellDrop}
                        onDrop={handleSellDrop}
                      >
                        <strong>Sell Basket</strong>
                        <p>{sellPlaceholderMessage}</p>
                      </div>

                      {sellBasketEntries.length > 0 ? (
                        <div className="trade-list">
                          {sellBasketEntries.map((entry) => (
                            <div
                              key={entry.itemKey}
                              className={`trade-list-item ${
                                selectedSellItemKey === entry.itemKey
                                  ? "is-selected"
                                  : ""
                              }`}
                            >
                              <div className="trade-list-item__main">
                                <button
                                  type="button"
                                  className="trade-list-item__select"
                                  onClick={() => setSelectedSellItemKey(entry.itemKey)}
                                >
                                  <strong>{entry.name}</strong>
                                  <span>{entry.description}</span>
                                </button>
                              </div>
                              <div className="trade-list-item__meta">
                                <span className="trade-list-item__value">
                                  x{entry.count}
                                </span>
                                <button
                                  type="button"
                                  className="trade-list-item__remove"
                                  onClick={() => handleRemoveSellEntry(entry.itemKey)}
                                  aria-label={`Remove ${entry.name} from sell basket`}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="trade-empty-state">
                          <strong>No items in the sell basket</strong>
                          <p>
                            Drag an eligible inventory stack into this panel to
                            prepare the trade.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="npc-trade-panel__footer">
                      <div className="npc-trade-panel__selection">
                        {selectedSellEntry ? (
                          <>
                            <strong>{selectedSellEntry.name}</strong>
                            <span>x{selectedSellEntry.count}</span>
                          </>
                        ) : (
                          <span>Select a dropped item to sell.</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="npc-trade-panel__secondary-button ornate-button"
                        onClick={handleSellAll}
                        disabled={sellBasketEntries.length === 0}
                      >
                        Sell All
                      </button>
                      <button
                        type="button"
                        className="npc-trade-panel__confirm-button ornate-button"
                        onClick={handleSellSelected}
                        disabled={!selectedSellEntry}
                      >
                        Sell
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="npc-trade-panel__placeholder">
                <strong>Trade</strong>
                <p>
                  Open Buy or Sell to manage commerce without shrinking the
                  dialogue space.
                </p>
              </div>
            )}
          </aside>
        </div>
      </GameDialog>
    </div>
  );
}
