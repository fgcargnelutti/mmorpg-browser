import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "./WorldMap.css";
import ContextActions from "../../../../components/ContextActions";
import NpcDialog from "../../../../components/NpcDialog";
import CombatDialog from "../../../../components/CombatDialog";
import MapGlobalActionsPanel from "./MapGlobalActionsPanel";
import { mapAtmosphereData } from "../../domain/mapAtmosphereData";
import type { LocationKey, ContextAction } from "../../domain/locations";
import type {
  DiscoverablePoiData,
  DiscoverablePoiKey,
} from "../../domain/discoverablePoisData";
import type { MapData, MapGlobalAction, MapPoi } from "../../domain/mapsData";
import type { DialogueOption } from "../../../../components/NpcDialog";
import type { NpcShopOffer } from "../../domain/npcProfilesData";
import type { InventoryPanelItem } from "../../../../components/InventoryPanel";
import type { CharacterClassKey } from "../../../../data/characterClassesData";
import type {
  CombatActionAvailability,
  CombatActionId,
  CombatState,
} from "../../../combat/domain/combatEngineTypes";

type WorldMapProps = {
  currentLocation: LocationKey;
  contextState: "hidden" | "expanded" | "minimized";
  mapData: MapData;
  onTravel: (location: LocationKey) => void;
  onMinimizeContext: () => void;
  onExpandContext: () => void;
  onAction: (action: ContextAction) => void;
  onGlobalAction: (action: MapGlobalAction) => void;
  onStopGlobalAction: () => void;
  activeGlobalActionLabel?: string | null;
  globalActionStatus?: "idle" | "hunting" | "stopped";
  globalActionEncountersCompleted?: number;

  npcDialogOpen: boolean;
  npcName: string;
  npcRole: string;
  npcDialogueLines: string[];
  npcDialogueOptions: DialogueOption[];
  npcLoreNotes: string[];
  onCloseNpcDialog: () => void;
  onNpcOptionSelect: (optionId: string) => void;
  onNpcBuyItem: (offer: NpcShopOffer) => void;
  onNpcSellItems: (items: Array<{ itemKey: string; count: number }>) => boolean;
  npcBuyOffers?: NpcShopOffer[];
  npcSellInventoryEntries?: InventoryPanelItem[];
  npcSellPlaceholderMessage?: string;

  npcNarrativeHint?: string;
  showNpcNarrativeStatus?: boolean;
  npcNarrativeStatusText?: string;

  combatDialogOpen: boolean;
  combatEnemyName: string;
  combatEnemyTitle: string;
  combatEnemyHp: number;
  combatEnemyMaxHp: number;
  combatLog: string[];
  combatState: CombatState | null;
  playerClassKey: CharacterClassKey;
  combatActionAvailabilities: CombatActionAvailability[];
  combatResolved: boolean;
  onCombatAction: (actionId: CombatActionId) => void;
  onCombatRetreat: () => void;
  onCloseCombatDialog: () => void;

  discoverablePois: Record<DiscoverablePoiKey, DiscoverablePoiData>;
  revealedPois: string[];
  discoveredPois: string[];
  onDiscoverPoi: (poiKey: string) => void;
  overlayContent?: ReactNode;
};

export default function WorldMap({
  currentLocation,
  contextState,
  mapData,
  onTravel,
  onMinimizeContext,
  onExpandContext,
  onAction,
  onGlobalAction,
  onStopGlobalAction,
  activeGlobalActionLabel,
  globalActionStatus = "idle",
  globalActionEncountersCompleted = 0,
  npcDialogOpen,
  npcName,
  npcRole,
  npcDialogueLines,
  npcDialogueOptions,
  npcLoreNotes,
  onCloseNpcDialog,
  onNpcOptionSelect,
  onNpcBuyItem,
  onNpcSellItems,
  npcBuyOffers,
  npcSellInventoryEntries,
  npcSellPlaceholderMessage,
  npcNarrativeHint,
  showNpcNarrativeStatus,
  npcNarrativeStatusText,
  combatDialogOpen,
  combatEnemyName,
  combatEnemyTitle,
  combatEnemyHp,
  combatEnemyMaxHp,
  combatLog,
  combatState,
  playerClassKey,
  combatActionAvailabilities,
  combatResolved,
  onCombatAction,
  onCombatRetreat,
  onCloseCombatDialog,
  discoverablePois,
  revealedPois,
  discoveredPois,
  onDiscoverPoi,
  overlayContent,
}: WorldMapProps) {
  const [activeDiscoverablePoiHover, setActiveDiscoverablePoiHover] = useState<{
    poiKey: string;
    durationMs: number;
  } | null>(null);
  const [selectedMapPoiId, setSelectedMapPoiId] = useState<string | null>(null);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeHoverPoiKeyRef = useRef<string | null>(null);
  const atmosphereProfile = mapAtmosphereData[mapData.id];

  const interactiveMapPois = useMemo(
    () =>
      mapData.pois
        .filter(
          (poi) =>
            !poi.discoverablePoiKey || discoveredPois.includes(poi.discoverablePoiKey)
        )
        .filter((poi) => poi.type !== "travel"),
    [discoveredPois, mapData.pois]
  );

  const visibleMapPois = useMemo(
    () =>
      mapData.pois.filter(
        (poi) =>
          !poi.discoverablePoiKey || discoveredPois.includes(poi.discoverablePoiKey)
      ),
    [discoveredPois, mapData.pois]
  );

  const activeDiscoverablePois = useMemo(
    () =>
      (Object.values(discoverablePois) as DiscoverablePoiData[]).filter(
        (poi) =>
          poi.mapId === mapData.id &&
          revealedPois.includes(poi.key) &&
          !discoveredPois.includes(poi.key)
      ),
    [discoverablePois, discoveredPois, mapData.id, revealedPois]
  );

  const currentLocationPoi = useMemo(
    () =>
      visibleMapPois.find((poi) => poi.locationKey === currentLocation) ?? null,
    [currentLocation, visibleMapPois]
  );

  const selectedMapPoi: MapPoi | null = useMemo(() => {
    const selected = selectedMapPoiId
      ? visibleMapPois.find((poi) => poi.id === selectedMapPoiId) ?? null
      : null;

    if (selected) return selected;

    return currentLocationPoi ?? interactiveMapPois[0] ?? visibleMapPois[0] ?? null;
  }, [currentLocationPoi, interactiveMapPois, selectedMapPoiId, visibleMapPois]);

  const clearHoverTracking = () => {
    activeHoverPoiKeyRef.current = null;

    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setActiveDiscoverablePoiHover(null);
  };

  useEffect(() => {
    return () => clearHoverTracking();
  }, []);

  const startPoiDiscoveryHover = (poiKey: DiscoverablePoiKey) => {
    if (discoveredPois.includes(poiKey)) return;

    const poiData = discoverablePois[poiKey];

    activeHoverPoiKeyRef.current = poiKey;
    setActiveDiscoverablePoiHover({
      poiKey,
      durationMs: poiData.hoverDurationMs,
    });

    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = window.setTimeout(() => {
      if (activeHoverPoiKeyRef.current === poiKey) {
        onDiscoverPoi(poiKey);
        clearHoverTracking();
      }
    }, poiData.hoverDurationMs);
  };

  const stopPoiDiscoveryHover = (poiKey: DiscoverablePoiKey) => {
    if (activeHoverPoiKeyRef.current !== poiKey) {
      return;
    }

    clearHoverTracking();
  };

  const handleMapPoiClick = (poi: MapPoi) => {
    if (poi.locationKey) {
      setSelectedMapPoiId(poi.id);
      onTravel(poi.locationKey);
      onExpandContext();
      return;
    }

    setSelectedMapPoiId(poi.id);
    onExpandContext();
  };

  const contextLocationName = selectedMapPoi?.label ?? mapData.name;

  const contextLocationDescription =
    selectedMapPoi?.description ?? mapData.description ?? "";

  const contextActions = selectedMapPoi?.actions ?? mapData.actions ?? [];
  const hasForegroundDialog =
    npcDialogOpen || combatDialogOpen || Boolean(overlayContent);

  return (
    <div className="world-stage world-map-shell">
      <div className={`world-map-frame world-map-frame--${mapData.id}`}>
        <img
          src={mapData.background}
          alt={mapData.name}
          className="world-map-image"
          draggable={false}
        />

        <div className="world-map-overlay">
          {hasForegroundDialog ? (
            <div className="world-map-backdrop" aria-hidden="true" />
          ) : null}

          <div
            className={`world-map-atmosphere world-map-atmosphere--${atmosphereProfile.theme}`}
            aria-hidden="true"
          >
            <div className="world-map-atmosphere__veil world-map-atmosphere__veil--a" />
            <div className="world-map-atmosphere__veil world-map-atmosphere__veil--b" />
            <div className="world-map-atmosphere__grain" />
            <div className="world-map-atmosphere__vignette" />
            {atmosphereProfile.effects.map((effect) => (
              <div
                key={effect.id}
                className={`world-map-effect world-map-effect--${effect.type}`}
                style={{
                  top: effect.top,
                  left: effect.left,
                  width: effect.width,
                  height: effect.height,
                  opacity: effect.opacity,
                  animationDelay: effect.delayMs
                    ? `${effect.delayMs}ms`
                    : undefined,
                  animationDuration: effect.durationMs
                    ? `${effect.durationMs}ms`
                    : undefined,
                }}
              />
            ))}
          </div>

          {visibleMapPois.map((poi) => {
            const isSelected =
              (poi.locationKey && poi.locationKey === currentLocation) ||
              selectedMapPoi?.id === poi.id;
            const poiVariant = poi.poiVariant ?? mapData.defaultPoiVariant ?? "danger";
            const isTravelPoi = poi.type === "travel";
            const isDiscoveredPoi = Boolean(
              poi.discoverablePoiKey && discoveredPois.includes(poi.discoverablePoiKey)
            );

            return (
              <button
                key={poi.id}
                className={`poi poi-${poiVariant} ${isSelected ? "is-active" : ""} ${
                  isTravelPoi ? "poi--travel" : "poi--interactive"
                }${isDiscoveredPoi ? " poi--discovered" : ""}`}
                type="button"
                style={{
                  top: poi.position.top,
                  left: poi.position.left,
                }}
                onClick={() => handleMapPoiClick(poi)}
              >
                <span className="poi-dot" aria-hidden="true" />
                <span className="poi-label-group">
                  <span className="poi-name">{poi.label}</span>
                </span>
              </button>
            );
          })}

          {activeDiscoverablePois.map((discoverablePoi) => (
            <div
              key={discoverablePoi.key}
              className={`poi-discovery-zone ${
                activeDiscoverablePoiHover?.poiKey === discoverablePoi.key
                  ? "is-hovering"
                  : ""
              }`}
              style={{
                top: discoverablePoi.discoveryZonePosition.top,
                left: discoverablePoi.discoveryZonePosition.left,
              }}
              onMouseEnter={() => startPoiDiscoveryHover(discoverablePoi.key)}
              onMouseLeave={() => stopPoiDiscoveryHover(discoverablePoi.key)}
            >
              <div className="poi-discovery-zone__inner">
                <div className="poi-discovery-zone__hint">
                  {discoverablePoi.hintText}
                </div>

                <div className="poi-discovery-zone__progress">
                  <div
                    className="poi-discovery-zone__progress-fill"
                    style={{
                      width:
                        activeDiscoverablePoiHover?.poiKey === discoverablePoi.key
                          ? "100%"
                          : "0%",
                      transitionDuration:
                        activeDiscoverablePoiHover?.poiKey === discoverablePoi.key
                          ? `${activeDiscoverablePoiHover.durationMs}ms`
                          : "0ms",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          <ContextActions
            state={contextState}
            locationName={contextLocationName}
            locationDescription={contextLocationDescription}
            actions={contextActions}
            onMinimize={onMinimizeContext}
            onExpand={onExpandContext}
            onAction={onAction}
          />

          <MapGlobalActionsPanel
            actions={mapData.globalActions ?? []}
            huntingStatus={globalActionStatus}
            activeActionLabel={activeGlobalActionLabel}
            completedEncounters={globalActionEncountersCompleted}
            onAction={onGlobalAction}
            onStop={onStopGlobalAction}
          />

          <NpcDialog
            isOpen={npcDialogOpen}
            npcName={npcName}
            npcRole={npcRole}
            dialogueLines={npcDialogueLines}
            dialogueOptions={npcDialogueOptions}
            loreNotes={npcLoreNotes}
            onClose={onCloseNpcDialog}
            onOptionSelect={onNpcOptionSelect}
            onBuyItem={onNpcBuyItem}
            onSellItems={onNpcSellItems}
            buyOffers={npcBuyOffers}
            sellInventoryEntries={npcSellInventoryEntries}
            sellPlaceholderMessage={npcSellPlaceholderMessage}
            narrativeHint={npcNarrativeHint}
            showNarrativeStatus={showNpcNarrativeStatus}
            narrativeStatusText={npcNarrativeStatusText}
          />

          <CombatDialog
            isOpen={combatDialogOpen}
            enemyName={combatEnemyName}
            enemyTitle={combatEnemyTitle}
            enemyHp={combatEnemyHp}
            enemyMaxHp={combatEnemyMaxHp}
            combatLog={combatLog}
            combatState={combatState}
            playerClassKey={playerClassKey}
            actionAvailabilities={combatActionAvailabilities}
            isResolved={combatResolved}
            onAction={onCombatAction}
            onRetreat={onCombatRetreat}
            onClose={onCloseCombatDialog}
            loopStatusLabel={
              globalActionStatus === "hunting" ? "Continuous Hunt Active" : null
            }
            onStopLoop={
              globalActionStatus === "hunting" ? onStopGlobalAction : undefined
            }
          />

          {overlayContent}
        </div>
      </div>
    </div>
  );
}
