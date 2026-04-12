import { useEffect, useRef, useState } from "react";
import GameDialog from "./GameDialog";
import "./NpcDialog.css";
import npcJanePortrait from "../assets/NpcJane.png";

type DialogueOption = {
  id: string;
  label: string;
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
};

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
}: NpcDialogProps) {
  const dialogueScrollRef = useRef<HTMLDivElement | null>(null);
  const [tradeMode, setTradeMode] = useState<TradeMode>(null);

  useEffect(() => {
    if (!dialogueScrollRef.current) return;
    dialogueScrollRef.current.scrollTop = dialogueScrollRef.current.scrollHeight;
  }, [dialogueLines]);

  useEffect(() => {
    if (!isOpen) {
      setTradeMode(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="npc-dialog-anchor">
      <GameDialog title={npcName} subtitle={npcRole} onClose={onClose}>
        <div
          className={`npc-dialog-layout ${
            tradeMode ? "npc-dialog-layout--with-trade" : ""
          }`}
        >
          <div className="npc-dialog-main">
            <div className="npc-dialog-portrait">
              <div className="npc-dialog-portrait-box">
                <img
                  src={npcJanePortrait}
                  alt={npcName}
                  className="npc-dialog-portrait-image"
                />
              </div>
            </div>

            <div ref={dialogueScrollRef} className="npc-dialog-main-text">
              {dialogueLines.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>

            <div className="npc-dialog-interaction-row">
              <div className="npc-dialog-options">
                {dialogueOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="npc-dialog-option-button"
                    onClick={() => onOptionSelect(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="npc-dialog-lore">
                {loreNotes.length === 0 ? (
                  <p className="npc-dialog-lore-empty">No extra notes.</p>
                ) : (
                  loreNotes.map((note, index) => (
                    <p key={`${note}-${index}`}>{note}</p>
                  ))
                )}
              </div>
            </div>

            <div className="npc-dialog-footer">
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
                  tradeMode === "buy" ? "is-active" : ""
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
                  tradeMode === "sell" ? "is-active" : ""
                }`}
                onClick={() =>
                  setTradeMode((prev) => (prev === "sell" ? null : "sell"))
                }
              >
                Sell
              </button>
            </div>
          </div>

          {tradeMode ? (
            <aside className="npc-trade-panel">
              <div className="npc-trade-panel__header">
                <h4>{tradeMode === "buy" ? "Buy Items" : "Sell Items"}</h4>
                <p>
                  {tradeMode === "buy"
                    ? "Merchant stock for testing."
                    : "Trade area prepared for future drag and drop."}
                </p>
              </div>

              {tradeMode === "buy" ? (
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