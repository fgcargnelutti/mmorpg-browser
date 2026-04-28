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
  const [inspectedPlayerId, setInspectedPlayerId] = useState<string | null>(null);
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
      setInspectedPlayerId(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
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

  return (
    <div ref={containerRef} className="region-players">
      <button
        type="button"
        className={`region-players__trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => {
          setIsOpen((previous) => !previous);
          setInspectedPlayerId(null);
        }}
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
          className="region-players__panel ornate-section ornate-corners"
          aria-label="Players online here"
        >
          <div className="region-players__panel-header ornate-header">
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
                <article key={player.id} className="region-players__item ornate-slot">
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
                      className={`region-players__action-button ornate-button ${
                        inspectedPlayerId === player.id
                          ? "region-players__action-button--active"
                          : ""
                      }`}
                      onClick={() =>
                        setInspectedPlayerId((currentId) =>
                          currentId === player.id ? null : player.id
                        )
                      }
                    >
                      Inspect
                    </button>
                    {regionPlayerActions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        className="region-players__action-button ornate-button"
                        onClick={() => action.onSelect?.(player.id, player.name)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>

                  {inspectedPlayerId === player.id ? (
                    <div
                      className="region-players__inspect-panel"
                      aria-label={`Inspect ${player.name}`}
                    >
                      <div className="region-players__inspect-row">
                        <span>Player</span>
                        <strong>{player.name}</strong>
                      </div>
                      <div className="region-players__inspect-row">
                        <span>Region</span>
                        <strong>{currentMapName}</strong>
                      </div>
                      <div className="region-players__inspect-row">
                        <span>Status</span>
                        <strong>Online</strong>
                      </div>
                      <p className="region-players__inspect-note">
                        {player.detail ??
                          "No additional inspection details are available yet."}
                      </p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
