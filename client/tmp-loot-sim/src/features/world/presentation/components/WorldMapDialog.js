import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import GameDialog from "../../../../components/GameDialog";
import CharacterAvatar from "../../../../components/CharacterAvatar";
import { worldFastTravelActivityOptions, } from "../../domain/worldFastTravel";
import { worldMapImageDimensions, worldMapPoisData, } from "../../domain/worldMapPoisData";
import { worldMapData } from "../../domain/worldMapData";
import "./WorldMapDialog.css";
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function roundToNearestFive(value) {
    return Math.max(5, Math.round(value / 5) * 5);
}
function formatTravelDuration(minutes) {
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
function formatConditionLabel(conditionKey) {
    return conditionKey
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}
function calculateTravelCost(fromPoi, toPoi) {
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
export default function WorldMapDialog({ isOpen, currentMap, currentWorldMapPoiId, onClose, onPoiSelect, onFastTravelConfirm, activeFastTravel, completedFastTravelReport, onDismissFastTravelReport, overlayToast, onDismissOverlayToast, playerAvatarSrc, playerAvatarAlt, }) {
    const frameRef = useRef(null);
    const [artboardSize, setArtboardSize] = useState({
        width: 0,
        height: 0,
    });
    const [pendingTravelPoiId, setPendingTravelPoiId] = useState(null);
    const [selectedTravelActivityId, setSelectedTravelActivityId] = useState("rest");
    const currentLocationPoi = useMemo(() => 
    // The dialog accepts an explicit continent-position override so the prototype can
    // represent the player's macro location even before every PoI has a linked local map.
    currentWorldMapPoiId
        ? worldMapPoisData.find((poi) => poi.id === currentWorldMapPoiId) ?? null
        : worldMapPoisData.find((poi) => poi.linkedMapIds?.includes(currentMap)) ?? null, [currentMap, currentWorldMapPoiId]);
    const activeTravelOriginPoi = useMemo(() => activeFastTravel
        ? worldMapPoisData.find((poi) => poi.id === activeFastTravel.originPoiId) ?? null
        : null, [activeFastTravel]);
    const activeTravelDestinationPoi = useMemo(() => activeFastTravel
        ? worldMapPoisData.find((poi) => poi.id === activeFastTravel.destinationPoiId) ??
            null
        : null, [activeFastTravel]);
    const pendingTravelPoi = useMemo(() => pendingTravelPoiId
        ? worldMapPoisData.find((poi) => poi.id === pendingTravelPoiId) ?? null
        : null, [pendingTravelPoiId]);
    const pendingTravelCost = useMemo(() => pendingTravelPoi
        ? calculateTravelCost(currentLocationPoi, pendingTravelPoi)
        : null, [currentLocationPoi, pendingTravelPoi]);
    const selectedPoiId = activeFastTravel?.destinationPoiId ??
        pendingTravelPoiId ??
        currentLocationPoi?.id ??
        worldMapPoisData[0]?.id ??
        null;
    const routeDestinationPoi = activeTravelDestinationPoi ?? pendingTravelPoi;
    const routeOriginPoi = activeTravelOriginPoi ?? currentLocationPoi;
    const progressPercent = activeFastTravel?.progressPercent ?? 0;
    const remainingTravelMinutes = activeFastTravel
        ? Math.max(1, Math.ceil(((100 - activeFastTravel.progressPercent) / 100) *
            activeFastTravel.durationMinutes))
        : null;
    const selectedTravelActivity = worldFastTravelActivityOptions.find((activity) => activity.id === selectedTravelActivityId) ?? worldFastTravelActivityOptions[0];
    const reportHasEncounter = Boolean(completedFastTravelReport?.encounterSummary);
    const reportHasLosses = Boolean(completedFastTravelReport &&
        (completedFastTravelReport.hpLoss > 0 ||
            completedFastTravelReport.spLoss > 0 ||
            completedFastTravelReport.inflictedConditions.length > 0));
    const pinPosition = routeOriginPoi
        ? activeFastTravel && routeDestinationPoi
            ? {
                x: routeOriginPoi.position.xPercent +
                    (routeDestinationPoi.position.xPercent - routeOriginPoi.position.xPercent) *
                        (progressPercent / 100),
                y: routeOriginPoi.position.yPercent +
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
        const destinationX = (routeDestinationPoi.position.xPercent / 100) * artboardSize.width;
        const destinationY = (routeDestinationPoi.position.yPercent / 100) * artboardSize.height;
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
        const imageAspect = worldMapImageDimensions.width / worldMapImageDimensions.height;
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
    return (_jsx("div", { className: "world-overview-dialog-anchor", children: _jsx(GameDialog, { title: "Continent", onClose: onClose, children: _jsx("div", { className: "world-overview-dialog", children: _jsxs("div", { className: "world-overview-dialog__frame", ref: frameRef, children: [overlayToast ? (_jsx("div", { className: "world-overview-overlay-toast-layer", "aria-live": "polite", children: _jsxs("article", { className: `world-overview-overlay-toast world-overview-overlay-toast--${overlayToast.tone}`, role: "status", children: [_jsxs("div", { className: "world-overview-overlay-toast__content", children: [overlayToast.title ? (_jsx("strong", { className: "world-overview-overlay-toast__title", children: overlayToast.title })) : null, _jsx("p", { className: "world-overview-overlay-toast__message", children: overlayToast.message })] }), _jsx("button", { type: "button", className: "world-overview-overlay-toast__dismiss", "aria-label": "Dismiss notification", onClick: onDismissOverlayToast, children: "\u00D7" })] }) })) : null, _jsxs("div", { className: "world-overview-dialog__artboard", style: {
                                width: `${artboardSize.width}px`,
                                height: `${artboardSize.height}px`,
                            }, children: [_jsx("img", { src: worldMapData.background, alt: worldMapData.description, className: "world-overview-dialog__image", draggable: false }), shouldRenderTravelRoute && routeGeometry ? (_jsxs("div", { className: "world-overview-dialog__route-layer", "aria-hidden": "true", children: [_jsx("div", { className: `world-overview-dialog__route${activeFastTravel ? " world-overview-dialog__route--active" : ""}`, style: {
                                                left: `${routeGeometry.originX}px`,
                                                top: `${routeGeometry.originY}px`,
                                                width: `${routeGeometry.distance}px`,
                                                transform: `translateY(-50%) rotate(${routeGeometry.angle}deg)`,
                                            } }), _jsx("div", { className: "world-overview-dialog__route-endpoint", style: {
                                                left: `${routeGeometry.originX}px`,
                                                top: `${routeGeometry.originY}px`,
                                            } }), _jsx("div", { className: "world-overview-dialog__route-endpoint", style: {
                                                left: `${routeGeometry.destinationX}px`,
                                                top: `${routeGeometry.destinationY}px`,
                                            } })] })) : null, _jsx("div", { className: "world-overview-dialog__poi-layer", children: worldMapPoisData.map((poi) => {
                                        const isCurrentLocation = poi.id === currentLocationPoi?.id;
                                        const isTravelOrigin = activeFastTravel?.originPoiId === poi.id;
                                        const isTravelDestination = activeFastTravel?.destinationPoiId === poi.id;
                                        const isSelected = selectedPoiId === poi.id;
                                        return (_jsxs("button", { type: "button", className: `world-overview-poi${isSelected ? " world-overview-poi--selected" : ""}${isCurrentLocation ? " world-overview-poi--current" : ""}${isTravelOrigin ? " world-overview-poi--route-origin" : ""}${isTravelDestination
                                                ? " world-overview-poi--route-destination"
                                                : ""}`, style: {
                                                left: `${poi.position.xPercent}%`,
                                                top: `${poi.position.yPercent}%`,
                                            }, onClick: () => {
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
                                            }, "aria-pressed": isSelected, title: poi.label, children: [_jsx("span", { className: "world-overview-poi__dot", "aria-hidden": "true" }), _jsx("span", { className: "world-overview-poi__label-group", children: _jsx("span", { className: "world-overview-poi__label", children: poi.label }) })] }, poi.id));
                                    }) }), pinPosition ? (_jsxs("div", { className: `world-overview-player-pin${activeFastTravel ? " world-overview-player-pin--traveling" : ""}`, style: {
                                        left: `${pinPosition.x}%`,
                                        top: `${pinPosition.y}%`,
                                    }, "aria-label": "Player position", title: activeFastTravel ? "Traveling across the continent" : "Current location", children: [_jsx("span", { className: "world-overview-player-pin__pulse", "aria-hidden": "true" }), _jsx("span", { className: "world-overview-player-pin__marker", "aria-hidden": "true", children: _jsx(CharacterAvatar, { src: playerAvatarSrc, alt: playerAvatarAlt, size: "pin" }) })] })) : null] }), pendingTravelPoi && pendingTravelCost ? (_jsx("div", { className: "world-overview-travel-confirm", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "world-overview-travel-confirm__card", children: [_jsx("h4", { children: "Travel Setup" }), _jsxs("p", { className: "world-overview-travel-confirm__destination", children: ["Destination: ", _jsx("strong", { children: pendingTravelPoi.label })] }), _jsx("div", { className: "world-overview-travel-confirm__preview", children: _jsx("img", { src: pendingTravelPoi.illustration, alt: pendingTravelPoi.label, className: "world-overview-travel-confirm__preview-image" }) }), _jsxs("div", { className: "world-overview-travel-confirm__costs", children: [_jsxs("div", { className: "world-overview-travel-confirm__cost", children: [_jsx("span", { className: "world-overview-travel-confirm__cost-icon", "aria-hidden": "true", children: _jsxs("svg", { viewBox: "0 0 24 24", className: "world-overview-travel-confirm__cost-svg", children: [_jsx("path", { d: "M7.5 4.8c2.2.2 4 1.5 4.9 3.4 1.2-.8 2.8-1.1 4.2-.8 1.9.5 3.1 2 3.1 3.8 0 3.6-3.3 6.8-8.7 8.6-5.4-1.8-8.7-5-8.7-8.6 0-2 1.6-3.8 3.8-4.2.5-.1 1-.2 1.4-.1Z", fill: "currentColor", opacity: "0.94" }), _jsx("path", { d: "M10.4 7.1c-.5 1.2-1.1 2.1-2.1 3M13.2 8.4c0 1.6.8 2.9 2 4", fill: "none", stroke: "rgba(255,255,255,0.5)", strokeWidth: "1.2", strokeLinecap: "round" })] }) }), _jsxs("span", { children: [pendingTravelCost.foodCost, " food"] })] }), _jsxs("div", { className: "world-overview-travel-confirm__cost", children: [_jsx("span", { className: "world-overview-travel-confirm__cost-icon", "aria-hidden": "true", children: _jsxs("svg", { viewBox: "0 0 24 24", className: "world-overview-travel-confirm__cost-svg", children: [_jsx("circle", { cx: "12", cy: "12", r: "7.6", fill: "none", stroke: "currentColor", strokeWidth: "1.7" }), _jsx("path", { d: "M12 8.1v4.1l2.8 1.8", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), _jsx("span", { children: formatTravelDuration(pendingTravelCost.durationMinutes) })] })] }), _jsxs("div", { className: "world-overview-travel-confirm__section", children: [_jsx("div", { className: "world-overview-travel-confirm__section-header", children: "Planned activity" }), _jsx("div", { className: "world-overview-travel-confirm__activity-grid", children: worldFastTravelActivityOptions.map((activity) => {
                                                    const isSelected = activity.id === selectedTravelActivity.id;
                                                    return (_jsx("button", { type: "button", className: `world-overview-travel-confirm__activity${isSelected
                                                            ? " world-overview-travel-confirm__activity--selected"
                                                            : ""}`, onClick: () => {
                                                            setSelectedTravelActivityId(activity.id);
                                                        }, "aria-pressed": isSelected, children: _jsx("span", { className: "world-overview-travel-confirm__activity-label", children: activity.label }) }, activity.id));
                                                }) })] }), _jsxs("div", { className: "world-overview-travel-confirm__actions", children: [_jsx("button", { type: "button", className: "world-overview-travel-confirm__button world-overview-travel-confirm__button--primary", onClick: () => {
                                                    onFastTravelConfirm?.(pendingTravelPoi, pendingTravelCost, selectedTravelActivity);
                                                    setPendingTravelPoiId(null);
                                                    setSelectedTravelActivityId("rest");
                                                }, children: "Begin Travel" }), _jsx("button", { type: "button", className: "world-overview-travel-confirm__button", onClick: () => {
                                                    setPendingTravelPoiId(null);
                                                    setSelectedTravelActivityId("rest");
                                                }, children: "Cancel" })] })] }) })) : null, completedFastTravelReport ? (_jsx("div", { className: "world-overview-travel-confirm", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "world-overview-travel-confirm__card world-overview-travel-report", children: [_jsx("h4", { children: "Travel Report" }), _jsxs("p", { className: "world-overview-travel-confirm__destination", children: [completedFastTravelReport.originLabel, " to", " ", _jsx("strong", { children: completedFastTravelReport.destinationLabel })] }), _jsx("div", { className: "world-overview-travel-confirm__preview", children: _jsx("img", { src: worldMapPoisData.find((poi) => poi.id === completedFastTravelReport.destinationPoiId)?.illustration, alt: completedFastTravelReport.destinationLabel, className: "world-overview-travel-confirm__preview-image" }) }), _jsxs("div", { className: "world-overview-travel-report__status-row", children: [_jsx("div", { className: `world-overview-travel-report__status-badge${reportHasEncounter
                                                    ? " world-overview-travel-report__status-badge--encounter"
                                                    : " world-overview-travel-report__status-badge--quiet"}`, children: reportHasEncounter ? "Encounter resolved" : "Quiet route" }), _jsx("div", { className: `world-overview-travel-report__status-badge${reportHasLosses
                                                    ? " world-overview-travel-report__status-badge--loss"
                                                    : " world-overview-travel-report__status-badge--clean"}`, children: reportHasLosses ? "Travel strain recorded" : "No lasting losses" })] }), _jsxs("div", { className: "world-overview-travel-report__summary-grid", children: [_jsxs("div", { className: "world-overview-travel-report__summary-group", children: [_jsx("div", { className: "world-overview-travel-confirm__section-header", children: "Gains" }), _jsxs("div", { className: "world-overview-travel-report__summary-list", children: [_jsxs("div", { className: "world-overview-travel-report__summary world-overview-travel-report__summary--gain", children: [_jsx("span", { className: "world-overview-travel-report__summary-label", children: "Stamina recovered" }), _jsxs("strong", { children: ["+", completedFastTravelReport.staminaRecovered] })] }), _jsxs("div", { className: "world-overview-travel-report__summary world-overview-travel-report__summary--neutral", children: [_jsx("span", { className: "world-overview-travel-report__summary-label", children: "Food spent" }), _jsx("strong", { children: completedFastTravelReport.foodSpent })] })] })] }), _jsxs("div", { className: "world-overview-travel-report__summary-group", children: [_jsx("div", { className: "world-overview-travel-confirm__section-header", children: "Losses" }), _jsxs("div", { className: "world-overview-travel-report__summary-list", children: [_jsxs("div", { className: "world-overview-travel-report__summary world-overview-travel-report__summary--loss", children: [_jsx("span", { className: "world-overview-travel-report__summary-label", children: "HP lost" }), _jsx("strong", { children: completedFastTravelReport.hpLoss })] }), _jsxs("div", { className: "world-overview-travel-report__summary world-overview-travel-report__summary--loss", children: [_jsx("span", { className: "world-overview-travel-report__summary-label", children: "SP lost" }), _jsx("strong", { children: completedFastTravelReport.spLoss })] })] })] })] }), _jsxs("div", { className: "world-overview-travel-confirm__section", children: [_jsx("div", { className: "world-overview-travel-confirm__section-header", children: "Planned activity" }), _jsxs("p", { className: "world-overview-travel-report__text", children: [_jsx("strong", { children: completedFastTravelReport.activity.label }), ":", " ", completedFastTravelReport.activitySummary] })] }), _jsxs("div", { className: "world-overview-travel-confirm__section", children: [_jsx("div", { className: "world-overview-travel-confirm__section-header", children: "Route assessment" }), _jsx("p", { className: "world-overview-travel-report__text", children: completedFastTravelReport.travelSummary })] }), completedFastTravelReport.encounterSummary ? (_jsxs("div", { className: "world-overview-travel-confirm__section", children: [_jsx("div", { className: "world-overview-travel-confirm__section-header", children: "Route encounter" }), _jsx("p", { className: "world-overview-travel-report__text", children: completedFastTravelReport.encounterSummary })] })) : null, completedFastTravelReport.inflictedConditions.length > 0 ? (_jsxs("div", { className: "world-overview-travel-confirm__section", children: [_jsx("div", { className: "world-overview-travel-confirm__section-header", children: "Conditions applied" }), _jsx("div", { className: "world-overview-travel-report__rewards", children: completedFastTravelReport.inflictedConditions.map((conditionKey) => (_jsx("div", { className: "world-overview-travel-report__reward", children: formatConditionLabel(conditionKey) }, conditionKey))) })] })) : null, _jsxs("div", { className: "world-overview-travel-confirm__section", children: [_jsx("div", { className: "world-overview-travel-confirm__section-header", children: "Rewards" }), completedFastTravelReport.rewardSummaries.length > 0 ? (_jsx("div", { className: "world-overview-travel-report__rewards", children: completedFastTravelReport.rewardSummaries.map((entry) => (_jsx("div", { className: "world-overview-travel-report__reward world-overview-travel-report__reward--gain", children: entry }, entry))) })) : (_jsx("p", { className: "world-overview-travel-report__text", children: "No extra rewards this time. The trip stayed quiet and efficient." }))] }), _jsx("div", { className: "world-overview-travel-confirm__actions", children: _jsx("button", { type: "button", className: "world-overview-travel-confirm__button world-overview-travel-confirm__button--primary", onClick: onDismissFastTravelReport, children: "Close Report" }) })] }) })) : null, activeFastTravel && activeTravelDestinationPoi ? (_jsxs("div", { className: "world-overview-travel-progress", children: [_jsxs("strong", { children: ["Traveling to ", activeTravelDestinationPoi.label] }), _jsxs("span", { children: [formatTravelDuration(remainingTravelMinutes ?? 1), " remaining"] }), _jsxs("span", { children: ["Activity: ", activeFastTravel.activity.label] })] })) : null] }) }) }) }));
}
