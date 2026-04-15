import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./RegionPlayersIndicator.css";
import { useRegionPlayers } from "../hooks/useRegionPlayers";
import type { MapId } from "../features/world";

type RegionPlayersIndicatorProps = {
  currentMapId: MapId;
  currentMapName: string;
  currentPlayerName?: string;
  onSendMessage?: (playerId: string, playerName: string) => void;
  onInviteToHunt?: (playerId: string, playerName: string) => void;
};

export default function RegionPlayersIndicator({
  currentMapId,
  currentMapName,
  currentPlayerName,
  onSendMessage,
  onInviteToHunt,
}: RegionPlayersIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();
  const { players, onlineCount } = useRegionPlayers({
    currentMapId,
    currentPlayerName,
  });
  const regionPlayerActions = useMemo(
    () => [
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
    ],
    [onInviteToHunt, onSendMessage]
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="region-players">
      <button
        type="button"
        className={`region-players__trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={panelId}
      >
        <span className="region-players__status-dot" aria-hidden="true" />
        <span className="region-players__label">
          Players in this region
          <strong className="region-players__count">({onlineCount})</strong>
        </span>
      </button>

      {isOpen ? (
        <section
          id={panelId}
          className="region-players__panel"
          aria-label="Players online here"
        >
          <div className="region-players__panel-header">
            <strong>Players online here</strong>
            <span>{currentMapName}</span>
          </div>

          {players.length === 0 ? (
            <div className="region-players__empty">
              No other players online in this region.
            </div>
          ) : (
            <div className="region-players__list">
              {players.map((player) => (
                <article key={player.id} className="region-players__item">
                  <div className="region-players__item-main">
                    <strong>{player.name}</strong>
                    {player.detail ? (
                      <span className="region-players__item-detail">
                        {player.detail}
                      </span>
                    ) : null}
                  </div>

                  <div className="region-players__actions">
                    {regionPlayerActions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        className="region-players__action-button"
                        onClick={() => action.onSelect?.(player.id, player.name)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
