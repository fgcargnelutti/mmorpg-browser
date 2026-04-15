import { useEffect, useRef, useState } from "react";
import GameDialog from "./GameDialog";
import "./NpcDialog.css";
import npcJanePortrait from "../assets/NpcJane.png";

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
  onBuy?: () => void;
  onSell?: () => void;
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
  onBuy,
  onSell,
  narrativeHint = "This NPC still has an important role in the story.",
  portraitSrc,
}: NpcDialogProps) {
  const dialogueScrollRef = useRef<HTMLDivElement | null>(null);
  const [tradeMode, setTradeMode] = useState<TradeMode>(null);
  const resolvedPortrait = portraitSrc ?? npcJanePortrait;

  useEffect(() => {
    if (!dialogueScrollRef.current) return;
    dialogueScrollRef.current.scrollTop = dialogueScrollRef.current.scrollHeight;
  }, [dialogueLines]);

  const visibleTopics = dialogueOptions.filter(
    (option) => option.state !== "locked"
  );
  const activeTradeMode = isOpen ? tradeMode : null;

  if (!isOpen) return null;

  return (
    <div className="npc-dialog-anchor">
      <GameDialog title={npcName} subtitle={npcRole} onClose={onClose}>
        <div
          className={`npc-dialog-layout ${
            activeTradeMode ? "npc-dialog-layout--with-trade" : ""
          }`}
        >
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

              <div className="npc-dialog-notes-panel">
                <div className="npc-dialog-panel-header">
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
              <div className="npc-dialog-topics-panel">
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

              <div className="npc-dialog-conversation-panel">
                <div className="npc-dialog-panel-header">
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
              <div className="npc-dialog-footer-hint">
                <span className="npc-dialog-footer-hint-icon">✦</span>
                <span>{narrativeHint}</span>
              </div>

              <div className="npc-dialog-footer-actions">
                <button
                  type="button"
                  className="npc-dialog-footer-button"
                  onClick={onClose}
                >
                  Close
                </button>

                <button
                  type="button"
                  className={`npc-dialog-footer-button ${
                    activeTradeMode === "buy" ? "is-active" : ""
                  }`}
                  onClick={() =>
                    setTradeMode((prev) => (prev === "buy" ? null : "buy"))
                  }
                >
                  Buy
                </button>

                <button
                  type="button"
                  className={`npc-dialog-footer-button ${
                    activeTradeMode === "sell" ? "is-active" : ""
                  }`}
                  onClick={() =>
                    setTradeMode((prev) => (prev === "sell" ? null : "sell"))
                  }
                >
                  Sell
                </button>
              </div>
            </div>
          </div>

          {activeTradeMode ? (
            <aside className="npc-trade-panel">
              <div className="npc-trade-panel__header">
                <h4>{activeTradeMode === "buy" ? "Buy Items" : "Sell Items"}</h4>
                <p>
                  {activeTradeMode === "buy"
                    ? "Merchant stock for testing."
                    : "Trade area prepared for future drag and drop."}
                </p>
              </div>

              {activeTradeMode === "buy" ? (
                <div className="npc-trade-panel__content">
                  <div className="trade-item-card">
                    <strong>Short Sword</strong>
                    <span>Basic weapon • Attack +4</span>
                    <button type="button" onClick={onBuy}>
                      Buy
                    </button>
                  </div>

                  <div className="trade-item-card">
                    <strong>Scrap Shield</strong>
                    <span>Basic shield • Defense +3</span>
                    <button type="button" onClick={onBuy}>
                      Buy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="npc-trade-panel__content">
                  <div className="trade-drop-zone">
                    <strong>Sell Area</strong>
                    <p>
                      In the future, you will drag items from the inventory and
                      drop them here.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="trade-sell-all-button"
                    onClick={onSell}
                  >
                    Sell All Resources
                  </button>
                </div>
              )}
            </aside>
          ) : null}
        </div>
      </GameDialog>
    </div>
  );
}
