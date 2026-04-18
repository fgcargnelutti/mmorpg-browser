import { useEffect, useMemo, useRef, useState } from "react";
import GameDialog from "../../../../components/GameDialog";
import CharacterAvatar from "../../../../components/CharacterAvatar";
import type { MapId } from "../../domain/mapsData";
import {
  worldFastTravelActivityOptions,
  type ActiveWorldFastTravel,
  type WorldFastTravelActivity,
  type WorldFastTravelActivityId,
  type WorldFastTravelReport,
  type WorldMapTravelCost,
} from "../../domain/worldFastTravel";
import {
  worldMapImageDimensions,
  worldMapPoisData,
  type WorldMapPoi,
  type WorldMapPoiId,
} from "../../domain/worldMapPoisData";
import { worldMapData } from "../../domain/worldMapData";
import "./WorldMapDialog.css";

type WorldMapDialogProps = {
  isOpen: boolean;
  currentMap: MapId;
  currentWorldMapPoiId?: WorldMapPoiId | null;
  onClose: () => void;
  onPoiSelect?: (poi: WorldMapPoi) => void;
  onFastTravelConfirm?: (
    poi: WorldMapPoi,
    cost: WorldMapTravelCost,
    activity: WorldFastTravelActivity
  ) => void;
  activeFastTravel?: ActiveWorldFastTravel | null;
  completedFastTravelReport?: WorldFastTravelReport | null;
  onDismissFastTravelReport?: () => void;
  overlayToast?: {
    tone: "error" | "info" | "success" | "warning";
    title?: string;
    message: string;
  } | null;
  onDismissOverlayToast?: () => void;
  playerAvatarSrc: string;
  playerAvatarAlt: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundToNearestFive(value: number) {
  return Math.max(5, Math.round(value / 5) * 5);
}

function formatTravelDuration(minutes: number) {
  if (minutes === 1) {
    return "1 minute";
  }

  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatConditionLabel(conditionKey: string) {
  return conditionKey
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function calculateTravelCost(
  fromPoi: WorldMapPoi | null,
  toPoi: WorldMapPoi
): WorldMapTravelCost {
  if (!fromPoi) {
    return {
      foodCost: 10,
      durationMinutes: 1,
    };
  }

  const deltaX = toPoi.position.xPercent - fromPoi.position.xPercent;
  const deltaY = toPoi.position.yPercent - fromPoi.position.yPercent;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  const foodCost = roundToNearestFive(clamp(distance * 0.42, 5, 30));

  return {
    foodCost,
    durationMinutes: 1,
  };
}

export default function WorldMapDialog({
  isOpen,
  currentMap,
  currentWorldMapPoiId,
  onClose,
  onPoiSelect,
  onFastTravelConfirm,
  activeFastTravel,
  completedFastTravelReport,
  onDismissFastTravelReport,
  overlayToast,
  onDismissOverlayToast,
  playerAvatarSrc,
  playerAvatarAlt,
}: WorldMapDialogProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [artboardSize, setArtboardSize] = useState({
    width: 0,
    height: 0,
  });
  const [pendingTravelPoiId, setPendingTravelPoiId] = useState<WorldMapPoiId | null>(
    null
  );
  const [selectedTravelActivityId, setSelectedTravelActivityId] =
    useState<WorldFastTravelActivityId>("rest");

  const currentLocationPoi = useMemo(
    () =>
      // The dialog accepts an explicit continent-position override so the prototype can
      // represent the player's macro location even before every PoI has a linked local map.
      currentWorldMapPoiId
        ? worldMapPoisData.find((poi) => poi.id === currentWorldMapPoiId) ?? null
        : worldMapPoisData.find((poi) => poi.linkedMapIds?.includes(currentMap)) ?? null,
    [currentMap, currentWorldMapPoiId]
  );
  const activeTravelOriginPoi = useMemo(
    () =>
      activeFastTravel
        ? worldMapPoisData.find((poi) => poi.id === activeFastTravel.originPoiId) ?? null
        : null,
    [activeFastTravel]
  );
  const activeTravelDestinationPoi = useMemo(
    () =>
      activeFastTravel
        ? worldMapPoisData.find((poi) => poi.id === activeFastTravel.destinationPoiId) ??
          null
        : null,
    [activeFastTravel]
  );
  const pendingTravelPoi = useMemo(
    () =>
      pendingTravelPoiId
        ? worldMapPoisData.find((poi) => poi.id === pendingTravelPoiId) ?? null
        : null,
    [pendingTravelPoiId]
  );
  const pendingTravelCost = useMemo(
    () =>
      pendingTravelPoi
        ? calculateTravelCost(currentLocationPoi, pendingTravelPoi)
        : null,
    [currentLocationPoi, pendingTravelPoi]
  );
  const selectedPoiId =
    activeFastTravel?.destinationPoiId ??
    pendingTravelPoiId ??
    currentLocationPoi?.id ??
    worldMapPoisData[0]?.id ??
    null;

  const routeDestinationPoi = activeTravelDestinationPoi ?? pendingTravelPoi;
  const routeOriginPoi = activeTravelOriginPoi ?? currentLocationPoi;
  const progressPercent = activeFastTravel?.progressPercent ?? 0;
  const remainingTravelMinutes = activeFastTravel
    ? Math.max(
        1,
        Math.ceil(
          ((100 - activeFastTravel.progressPercent) / 100) *
            activeFastTravel.durationMinutes
        )
      )
    : null;
  const selectedTravelActivity =
    worldFastTravelActivityOptions.find(
      (activity) => activity.id === selectedTravelActivityId
    ) ?? worldFastTravelActivityOptions[0];
  const reportHasEncounter = Boolean(completedFastTravelReport?.encounterSummary);
  const reportHasLosses = Boolean(
    completedFastTravelReport &&
      (completedFastTravelReport.hpLoss > 0 ||
        completedFastTravelReport.spLoss > 0 ||
        completedFastTravelReport.inflictedConditions.length > 0)
  );
  const pinPosition = routeOriginPoi
    ? activeFastTravel && routeDestinationPoi
      ? {
          x:
            routeOriginPoi.position.xPercent +
            (routeDestinationPoi.position.xPercent - routeOriginPoi.position.xPercent) *
              (progressPercent / 100),
          y:
            routeOriginPoi.position.yPercent +
            (routeDestinationPoi.position.yPercent - routeOriginPoi.position.yPercent) *
              (progressPercent / 100),
        }
      : {
          x: routeOriginPoi.position.xPercent,
          y: routeOriginPoi.position.yPercent,
        }
    : null;
  const shouldRenderTravelRoute = Boolean(routeOriginPoi && routeDestinationPoi);
  const routeGeometry = useMemo(() => {
    if (!routeOriginPoi || !routeDestinationPoi) {
      return null;
    }

    const originX = (routeOriginPoi.position.xPercent / 100) * artboardSize.width;
    const originY = (routeOriginPoi.position.yPercent / 100) * artboardSize.height;
    const destinationX =
      (routeDestinationPoi.position.xPercent / 100) * artboardSize.width;
    const destinationY =
      (routeDestinationPoi.position.yPercent / 100) * artboardSize.height;

    const deltaX = destinationX - originX;
    const deltaY = destinationY - originY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

    return {
      originX,
      originY,
      destinationX,
      destinationY,
      distance,
      angle,
    };
  }, [artboardSize.height, artboardSize.width, routeDestinationPoi, routeOriginPoi]);

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame || !isOpen) {
      return;
    }

    const imageAspect =
      worldMapImageDimensions.width / worldMapImageDimensions.height;

    const updateArtboardSize = () => {
      const frameWidth = frame.clientWidth;
      const frameHeight = frame.clientHeight;

      if (frameWidth === 0 || frameHeight === 0) {
        return;
      }

      const frameAspect = frameWidth / frameHeight;

      if (frameAspect > imageAspect) {
        setArtboardSize({
          width: frameWidth,
          height: frameWidth / imageAspect,
        });
        return;
      }

      setArtboardSize({
        width: frameHeight * imageAspect,
        height: frameHeight,
      });
    };

    updateArtboardSize();

    const observer = new ResizeObserver(() => {
      updateArtboardSize();
    });

    observer.observe(frame);

    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="world-overview-dialog-anchor">
      <GameDialog title="Continent" onClose={onClose}>
        <div className="world-overview-dialog">
          <div className="world-overview-dialog__frame" ref={frameRef}>
            {overlayToast ? (
              <div className="world-overview-overlay-toast-layer" aria-live="polite">
                <article
                  className={`world-overview-overlay-toast world-overview-overlay-toast--${overlayToast.tone}`}
                  role="status"
                >
                  <div className="world-overview-overlay-toast__content">
                    {overlayToast.title ? (
                      <strong className="world-overview-overlay-toast__title">
                        {overlayToast.title}
                      </strong>
                    ) : null}
                    <p className="world-overview-overlay-toast__message">
                      {overlayToast.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="world-overview-overlay-toast__dismiss"
                    aria-label="Dismiss notification"
                    onClick={onDismissOverlayToast}
                  >
                    ×
                  </button>
                </article>
              </div>
            ) : null}

            <div
              className="world-overview-dialog__artboard"
              style={{
                width: `${artboardSize.width}px`,
                height: `${artboardSize.height}px`,
              }}
            >
              <img
                src={worldMapData.background}
                alt={worldMapData.description}
                className="world-overview-dialog__image"
                draggable={false}
              />

              {shouldRenderTravelRoute && routeGeometry ? (
                <div className="world-overview-dialog__route-layer" aria-hidden="true">
                  <div
                    className={`world-overview-dialog__route${
                      activeFastTravel ? " world-overview-dialog__route--active" : ""
                    }`}
                    style={{
                      left: `${routeGeometry.originX}px`,
                      top: `${routeGeometry.originY}px`,
                      width: `${routeGeometry.distance}px`,
                      transform: `translateY(-50%) rotate(${routeGeometry.angle}deg)`,
                    }}
                  />

                  <div
                    className="world-overview-dialog__route-endpoint"
                    style={{
                      left: `${routeGeometry.originX}px`,
                      top: `${routeGeometry.originY}px`,
                    }}
                  />

                  <div
                    className="world-overview-dialog__route-endpoint"
                    style={{
                      left: `${routeGeometry.destinationX}px`,
                      top: `${routeGeometry.destinationY}px`,
                    }}
                  />
                </div>
              ) : null}

              <div className="world-overview-dialog__poi-layer">
                {worldMapPoisData.map((poi) => {
                  const isCurrentLocation = poi.id === currentLocationPoi?.id;
                  const isTravelOrigin = activeFastTravel?.originPoiId === poi.id;
                  const isTravelDestination =
                    activeFastTravel?.destinationPoiId === poi.id;
                  const isSelected = selectedPoiId === poi.id;

                  return (
                    <button
                      key={poi.id}
                      type="button"
                      className={`world-overview-poi${
                        isSelected ? " world-overview-poi--selected" : ""
                      }${
                        isCurrentLocation ? " world-overview-poi--current" : ""
                      }${
                        isTravelOrigin ? " world-overview-poi--route-origin" : ""
                      }${
                        isTravelDestination
                          ? " world-overview-poi--route-destination"
                          : ""
                      }`}
                      style={{
                        left: `${poi.position.xPercent}%`,
                        top: `${poi.position.yPercent}%`,
                      }}
                      onClick={() => {
                        if (activeFastTravel) {
                          return;
                        }

                        onPoiSelect?.(poi);

                        if (poi.id === currentLocationPoi?.id) {
                          setPendingTravelPoiId(null);
                          setSelectedTravelActivityId("rest");
                          return;
                        }

                        setPendingTravelPoiId(poi.id);
                        setSelectedTravelActivityId("rest");
                      }}
                      aria-pressed={isSelected}
                      title={poi.label}
                    >
                      <span className="world-overview-poi__dot" aria-hidden="true" />
                      <span className="world-overview-poi__label-group">
                        <span className="world-overview-poi__label">{poi.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {pinPosition ? (
                <div
                  className={`world-overview-player-pin${
                    activeFastTravel ? " world-overview-player-pin--traveling" : ""
                  }`}
                  style={{
                    left: `${pinPosition.x}%`,
                    top: `${pinPosition.y}%`,
                  }}
                  aria-label="Player position"
                  title={
                    activeFastTravel ? "Traveling across the continent" : "Current location"
                  }
                >
                  <span className="world-overview-player-pin__pulse" aria-hidden="true" />
                  <span className="world-overview-player-pin__marker" aria-hidden="true">
                    <CharacterAvatar
                      src={playerAvatarSrc}
                      alt={playerAvatarAlt}
                      size="pin"
                    />
                  </span>
                </div>
              ) : null}
            </div>

            {pendingTravelPoi && pendingTravelCost ? (
              <div className="world-overview-travel-confirm" role="dialog" aria-modal="true">
                <div className="world-overview-travel-confirm__card">
                  <h4>Travel Setup</h4>
                  <p className="world-overview-travel-confirm__destination">
                    Destination: <strong>{pendingTravelPoi.label}</strong>
                  </p>

                  <div className="world-overview-travel-confirm__preview">
                    <img
                      src={pendingTravelPoi.illustration}
                      alt={pendingTravelPoi.label}
                      className="world-overview-travel-confirm__preview-image"
                    />
                  </div>

                  <div className="world-overview-travel-confirm__costs">
                    <div className="world-overview-travel-confirm__cost">
                      <span
                        className="world-overview-travel-confirm__cost-icon"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="world-overview-travel-confirm__cost-svg"
                        >
                          <path
                            d="M7.5 4.8c2.2.2 4 1.5 4.9 3.4 1.2-.8 2.8-1.1 4.2-.8 1.9.5 3.1 2 3.1 3.8 0 3.6-3.3 6.8-8.7 8.6-5.4-1.8-8.7-5-8.7-8.6 0-2 1.6-3.8 3.8-4.2.5-.1 1-.2 1.4-.1Z"
                            fill="currentColor"
                            opacity="0.94"
                          />
                          <path
                            d="M10.4 7.1c-.5 1.2-1.1 2.1-2.1 3M13.2 8.4c0 1.6.8 2.9 2 4"
                            fill="none"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span>{pendingTravelCost.foodCost} food</span>
                    </div>

                    <div className="world-overview-travel-confirm__cost">
                      <span
                        className="world-overview-travel-confirm__cost-icon"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="world-overview-travel-confirm__cost-svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="7.6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />
                          <path
                            d="M12 8.1v4.1l2.8 1.8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span>{formatTravelDuration(pendingTravelCost.durationMinutes)}</span>
                    </div>
                  </div>

                  <div className="world-overview-travel-confirm__section">
                    <div className="world-overview-travel-confirm__section-header">
                      Planned activity
                    </div>

                    <div className="world-overview-travel-confirm__activity-grid">
                      {worldFastTravelActivityOptions.map((activity) => {
                        const isSelected = activity.id === selectedTravelActivity.id;

                        return (
                          <button
                            key={activity.id}
                            type="button"
                            className={`world-overview-travel-confirm__activity${
                              isSelected
                                ? " world-overview-travel-confirm__activity--selected"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedTravelActivityId(activity.id);
                            }}
                            aria-pressed={isSelected}
                          >
                            <span className="world-overview-travel-confirm__activity-label">
                              {activity.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="world-overview-travel-confirm__actions">
                    <button
                      type="button"
                      className="world-overview-travel-confirm__button world-overview-travel-confirm__button--primary"
                      onClick={() => {
                        onFastTravelConfirm?.(
                          pendingTravelPoi,
                          pendingTravelCost,
                          selectedTravelActivity
                        );
                        setPendingTravelPoiId(null);
                        setSelectedTravelActivityId("rest");
                      }}
                    >
                      Begin Travel
                    </button>

                    <button
                      type="button"
                      className="world-overview-travel-confirm__button"
                      onClick={() => {
                        setPendingTravelPoiId(null);
                        setSelectedTravelActivityId("rest");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {completedFastTravelReport ? (
              <div className="world-overview-travel-confirm" role="dialog" aria-modal="true">
                <div className="world-overview-travel-confirm__card world-overview-travel-report">
                  <h4>Travel Report</h4>
                  <p className="world-overview-travel-confirm__destination">
                    {completedFastTravelReport.originLabel} to{" "}
                    <strong>{completedFastTravelReport.destinationLabel}</strong>
                  </p>

                  <div className="world-overview-travel-confirm__preview">
                    <img
                      src={
                        worldMapPoisData.find(
                          (poi) => poi.id === completedFastTravelReport.destinationPoiId
                        )?.illustration
                      }
                      alt={completedFastTravelReport.destinationLabel}
                      className="world-overview-travel-confirm__preview-image"
                    />
                  </div>

                  <div className="world-overview-travel-report__status-row">
                    <div
                      className={`world-overview-travel-report__status-badge${
                        reportHasEncounter
                          ? " world-overview-travel-report__status-badge--encounter"
                          : " world-overview-travel-report__status-badge--quiet"
                      }`}
                    >
                      {reportHasEncounter ? "Encounter resolved" : "Quiet route"}
                    </div>

                    <div
                      className={`world-overview-travel-report__status-badge${
                        reportHasLosses
                          ? " world-overview-travel-report__status-badge--loss"
                          : " world-overview-travel-report__status-badge--clean"
                      }`}
                    >
                      {reportHasLosses ? "Travel strain recorded" : "No lasting losses"}
                    </div>
                  </div>

                  <div className="world-overview-travel-report__summary-grid">
                    <div className="world-overview-travel-report__summary-group">
                      <div className="world-overview-travel-confirm__section-header">
                        Gains
                      </div>
                      <div className="world-overview-travel-report__summary-list">
                        <div className="world-overview-travel-report__summary world-overview-travel-report__summary--gain">
                          <span className="world-overview-travel-report__summary-label">
                            Stamina recovered
                          </span>
                          <strong>+{completedFastTravelReport.staminaRecovered}</strong>
                        </div>

                        <div className="world-overview-travel-report__summary world-overview-travel-report__summary--neutral">
                          <span className="world-overview-travel-report__summary-label">
                            Food spent
                          </span>
                          <strong>{completedFastTravelReport.foodSpent}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="world-overview-travel-report__summary-group">
                      <div className="world-overview-travel-confirm__section-header">
                        Losses
                      </div>
                      <div className="world-overview-travel-report__summary-list">
                        <div className="world-overview-travel-report__summary world-overview-travel-report__summary--loss">
                          <span className="world-overview-travel-report__summary-label">
                            HP lost
                          </span>
                          <strong>{completedFastTravelReport.hpLoss}</strong>
                        </div>

                        <div className="world-overview-travel-report__summary world-overview-travel-report__summary--loss">
                          <span className="world-overview-travel-report__summary-label">
                            SP lost
                          </span>
                          <strong>{completedFastTravelReport.spLoss}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="world-overview-travel-confirm__section">
                    <div className="world-overview-travel-confirm__section-header">
                      Planned activity
                    </div>
                    <p className="world-overview-travel-report__text">
                      <strong>{completedFastTravelReport.activity.label}</strong>:{" "}
                      {completedFastTravelReport.activitySummary}
                    </p>
                  </div>

                  <div className="world-overview-travel-confirm__section">
                    <div className="world-overview-travel-confirm__section-header">
                      Route assessment
                    </div>
                    <p className="world-overview-travel-report__text">
                      {completedFastTravelReport.travelSummary}
                    </p>
                  </div>

                  {completedFastTravelReport.encounterSummary ? (
                    <div className="world-overview-travel-confirm__section">
                      <div className="world-overview-travel-confirm__section-header">
                        Route encounter
                      </div>
                      <p className="world-overview-travel-report__text">
                        {completedFastTravelReport.encounterSummary}
                      </p>
                    </div>
                  ) : null}

                  {completedFastTravelReport.inflictedConditions.length > 0 ? (
                    <div className="world-overview-travel-confirm__section">
                      <div className="world-overview-travel-confirm__section-header">
                        Conditions applied
                      </div>
                      <div className="world-overview-travel-report__rewards">
                        {completedFastTravelReport.inflictedConditions.map((conditionKey) => (
                          <div
                            key={conditionKey}
                            className="world-overview-travel-report__reward"
                          >
                            {formatConditionLabel(conditionKey)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="world-overview-travel-confirm__section">
                    <div className="world-overview-travel-confirm__section-header">
                      Rewards
                    </div>
                    {completedFastTravelReport.rewardSummaries.length > 0 ? (
                      <div className="world-overview-travel-report__rewards">
                        {completedFastTravelReport.rewardSummaries.map((entry) => (
                          <div
                            key={entry}
                            className="world-overview-travel-report__reward world-overview-travel-report__reward--gain"
                          >
                            {entry}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="world-overview-travel-report__text">
                        No extra rewards this time. The trip stayed quiet and efficient.
                      </p>
                    )}
                  </div>

                  <div className="world-overview-travel-confirm__actions">
                    <button
                      type="button"
                      className="world-overview-travel-confirm__button world-overview-travel-confirm__button--primary"
                      onClick={onDismissFastTravelReport}
                    >
                      Close Report
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {activeFastTravel && activeTravelDestinationPoi ? (
              <div className="world-overview-travel-progress">
                <strong>Traveling to {activeTravelDestinationPoi.label}</strong>
                <span>
                  {formatTravelDuration(remainingTravelMinutes ?? 1)} remaining
                </span>
                <span>Activity: {activeFastTravel.activity.label}</span>
              </div>
            ) : null}
          </div>
        </div>
      </GameDialog>
    </div>
  );
}
