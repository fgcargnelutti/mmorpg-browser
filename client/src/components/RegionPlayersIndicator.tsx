import { useEffect, useRef, useState } from "react";
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
  const { players, onlineCount } = useRegionPlayers({
    currentMapId,
    currentPlayerName,
  });

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
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
      >
        <span className="region-players__status-dot" aria-hidden="true" />
        <span className="region-players__label">
          Players in this region
          <strong className="region-players__count">({onlineCount})</strong>
        </span>
      </button>

      {isOpen ? (
        <section className="region-players__panel" aria-label="Players online here">
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
                    <button
                      type="button"
                      className="region-players__action-button"
                      onClick={() => onSendMessage?.(player.id, player.name)}
                    >
                      Send message
                    </button>

                    <button
                      type="button"
                      className="region-players__action-button"
                      onClick={() => onInviteToHunt?.(player.id, player.name)}
                    >
                      Invite to hunt
                    </button>
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
