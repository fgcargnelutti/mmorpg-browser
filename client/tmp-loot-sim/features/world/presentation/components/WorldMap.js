import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import "./WorldMap.css";
import ContextActions from "../../../../components/ContextActions";
import NpcDialog from "../../../../components/NpcDialog";
import CombatDialog from "../../../../components/CombatDialog";
import MapGlobalActionsPanel from "./MapGlobalActionsPanel";
import { mapAtmosphereData } from "../../domain/mapAtmosphereData";
export default function WorldMap({ currentLocation, contextState, mapData, onTravel, onMinimizeContext, onExpandContext, onAction, onGlobalAction, onStopGlobalAction, activeGlobalActionLabel, globalActionStatus = "idle", globalActionEncountersCompleted = 0, npcDialogOpen, npcName, npcRole, npcDialogueLines, npcDialogueOptions, npcLoreNotes, onCloseNpcDialog, onNpcOptionSelect, onNpcBuyItem, onNpcSellItems, npcBuyOffers, npcSellInventoryEntries, npcSellPlaceholderMessage, npcNarrativeHint, showNpcNarrativeStatus, npcNarrativeStatusText, combatDialogOpen, combatEnemyName, combatEnemyTitle, combatEnemyHp, combatEnemyMaxHp, combatLog, combatState, combatActionAvailabilities, combatResolved, onCombatAction, onCombatRetreat, onCloseCombatDialog, discoverablePois, revealedPois, discoveredPois, onDiscoverPoi, overlayContent, }) {
    const [activeDiscoverablePoiHover, setActiveDiscoverablePoiHover] = useState(null);
    const [selectedMapPoiId, setSelectedMapPoiId] = useState(null);
    const hoverTimeoutRef = useRef(null);
    const activeHoverPoiKeyRef = useRef(null);
    const atmosphereProfile = mapAtmosphereData[mapData.id];
    const interactiveMapPois = useMemo(() => mapData.pois
        .filter((poi) => !poi.discoverablePoiKey || discoveredPois.includes(poi.discoverablePoiKey))
        .filter((poi) => poi.type !== "travel"), [discoveredPois, mapData.pois]);
    const visibleMapPois = useMemo(() => mapData.pois.filter((poi) => !poi.discoverablePoiKey || discoveredPois.includes(poi.discoverablePoiKey)), [discoveredPois, mapData.pois]);
    const activeDiscoverablePois = useMemo(() => Object.values(discoverablePois).filter((poi) => poi.mapId === mapData.id &&
        revealedPois.includes(poi.key) &&
        !discoveredPois.includes(poi.key)), [discoverablePois, discoveredPois, mapData.id, revealedPois]);
    const currentLocationPoi = useMemo(() => visibleMapPois.find((poi) => poi.locationKey === currentLocation) ?? null, [currentLocation, visibleMapPois]);
    const selectedMapPoi = useMemo(() => {
        const selected = selectedMapPoiId
            ? visibleMapPois.find((poi) => poi.id === selectedMapPoiId) ?? null
            : null;
        if (selected)
            return selected;
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
    const startPoiDiscoveryHover = (poiKey) => {
        if (discoveredPois.includes(poiKey))
            return;
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
    const stopPoiDiscoveryHover = (poiKey) => {
        if (activeHoverPoiKeyRef.current !== poiKey) {
            return;
        }
        clearHoverTracking();
    };
    const handleMapPoiClick = (poi) => {
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
    const contextLocationDescription = selectedMapPoi?.description ?? mapData.description ?? "";
    const contextActions = selectedMapPoi?.actions ?? mapData.actions ?? [];
    const hasForegroundDialog = npcDialogOpen || combatDialogOpen || Boolean(overlayContent);
    return (_jsx("div", { className: "world-stage world-map-shell", children: _jsxs("div", { className: `world-map-frame world-map-frame--${mapData.id}`, children: [_jsx("img", { src: mapData.background, alt: mapData.name, className: "world-map-image", draggable: false }), _jsxs("div", { className: "world-map-overlay", children: [hasForegroundDialog ? (_jsx("div", { className: "world-map-backdrop", "aria-hidden": "true" })) : null, _jsxs("div", { className: `world-map-atmosphere world-map-atmosphere--${atmosphereProfile.theme}`, "aria-hidden": "true", children: [_jsx("div", { className: "world-map-atmosphere__veil world-map-atmosphere__veil--a" }), _jsx("div", { className: "world-map-atmosphere__veil world-map-atmosphere__veil--b" }), _jsx("div", { className: "world-map-atmosphere__grain" }), _jsx("div", { className: "world-map-atmosphere__vignette" }), atmosphereProfile.effects.map((effect) => (_jsx("div", { className: `world-map-effect world-map-effect--${effect.type}`, style: {
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
                                    } }, effect.id)))] }), visibleMapPois.map((poi) => {
                            const isSelected = (poi.locationKey && poi.locationKey === currentLocation) ||
                                selectedMapPoi?.id === poi.id;
                            const poiVariant = poi.poiVariant ?? mapData.defaultPoiVariant ?? "danger";
                            const isTravelPoi = poi.type === "travel";
                            const isDiscoveredPoi = Boolean(poi.discoverablePoiKey && discoveredPois.includes(poi.discoverablePoiKey));
                            return (_jsxs("button", { className: `poi poi-${poiVariant} ${isSelected ? "is-active" : ""} ${isTravelPoi ? "poi--travel" : "poi--interactive"}${isDiscoveredPoi ? " poi--discovered" : ""}`, type: "button", style: {
                                    top: poi.position.top,
                                    left: poi.position.left,
                                }, onClick: () => handleMapPoiClick(poi), children: [_jsx("span", { className: "poi-dot", "aria-hidden": "true" }), _jsx("span", { className: "poi-label-group", children: _jsx("span", { className: "poi-name", children: poi.label }) })] }, poi.id));
                        }), activeDiscoverablePois.map((discoverablePoi) => (_jsx("div", { className: `poi-discovery-zone ${activeDiscoverablePoiHover?.poiKey === discoverablePoi.key
                                ? "is-hovering"
                                : ""}`, style: {
                                top: discoverablePoi.discoveryZonePosition.top,
                                left: discoverablePoi.discoveryZonePosition.left,
                            }, onMouseEnter: () => startPoiDiscoveryHover(discoverablePoi.key), onMouseLeave: () => stopPoiDiscoveryHover(discoverablePoi.key), children: _jsxs("div", { className: "poi-discovery-zone__inner", children: [_jsx("div", { className: "poi-discovery-zone__hint", children: discoverablePoi.hintText }), _jsx("div", { className: "poi-discovery-zone__progress", children: _jsx("div", { className: "poi-discovery-zone__progress-fill", style: {
                                                width: activeDiscoverablePoiHover?.poiKey === discoverablePoi.key
                                                    ? "100%"
                                                    : "0%",
                                                transitionDuration: activeDiscoverablePoiHover?.poiKey === discoverablePoi.key
                                                    ? `${activeDiscoverablePoiHover.durationMs}ms`
                                                    : "0ms",
                                            } }) })] }) }, discoverablePoi.key))), _jsx(ContextActions, { state: contextState, locationName: contextLocationName, locationDescription: contextLocationDescription, actions: contextActions, onMinimize: onMinimizeContext, onExpand: onExpandContext, onAction: onAction }), _jsx(MapGlobalActionsPanel, { actions: mapData.globalActions ?? [], huntingStatus: globalActionStatus, activeActionLabel: activeGlobalActionLabel, completedEncounters: globalActionEncountersCompleted, onAction: onGlobalAction, onStop: onStopGlobalAction }), _jsx(NpcDialog, { isOpen: npcDialogOpen, npcName: npcName, npcRole: npcRole, dialogueLines: npcDialogueLines, dialogueOptions: npcDialogueOptions, loreNotes: npcLoreNotes, onClose: onCloseNpcDialog, onOptionSelect: onNpcOptionSelect, onBuyItem: onNpcBuyItem, onSellItems: onNpcSellItems, buyOffers: npcBuyOffers, sellInventoryEntries: npcSellInventoryEntries, sellPlaceholderMessage: npcSellPlaceholderMessage, narrativeHint: npcNarrativeHint, showNarrativeStatus: showNpcNarrativeStatus, narrativeStatusText: npcNarrativeStatusText }), _jsx(CombatDialog, { isOpen: combatDialogOpen, enemyName: combatEnemyName, enemyTitle: combatEnemyTitle, enemyHp: combatEnemyHp, enemyMaxHp: combatEnemyMaxHp, combatLog: combatLog, combatState: combatState, actionAvailabilities: combatActionAvailabilities, isResolved: combatResolved, onAction: onCombatAction, onRetreat: onCombatRetreat, onClose: onCloseCombatDialog, loopStatusLabel: globalActionStatus === "hunting" ? "Continuous Hunt Active" : null, onStopLoop: globalActionStatus === "hunting" ? onStopGlobalAction : undefined }), overlayContent] })] }) }));
}
