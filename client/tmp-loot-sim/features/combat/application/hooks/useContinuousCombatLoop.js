import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pickRandomEncounterFromMap, } from "../systems/continuousCombatLoopSystem";
import { canMapStartHunting, isSearchForHuntAction, } from "../../../world/application/systems/mapGlobalActionSystem";
const initialLoopState = {
    status: "idle",
    activeActionId: null,
    activeMapId: null,
    completedEncounters: 0,
    pendingEncounterKey: null,
    pendingEncounterToken: 0,
    stopReason: null,
};
export function useContinuousCombatLoop({ mapData, activeEncounter, onOpenEncounter, onCloseEncounter, }) {
    const [loopState, setLoopState] = useState(initialLoopState);
    const autoAdvanceTimeoutRef = useRef(null);
    const lastResolvedCycleRef = useRef(null);
    const encounterSequenceRef = useRef(0);
    const clearAutoAdvanceTimeout = useCallback(() => {
        if (autoAdvanceTimeoutRef.current) {
            clearTimeout(autoAdvanceTimeoutRef.current);
            autoAdvanceTimeoutRef.current = null;
        }
    }, []);
    const stopLoop = useCallback((reason = "manual") => {
        clearAutoAdvanceTimeout();
        lastResolvedCycleRef.current = null;
        setLoopState((previousState) => ({
            ...previousState,
            status: "stopped",
            pendingEncounterKey: null,
            stopReason: reason,
        }));
    }, [clearAutoAdvanceTimeout]);
    const resetLoop = useCallback(() => {
        clearAutoAdvanceTimeout();
        lastResolvedCycleRef.current = null;
        setLoopState(initialLoopState);
    }, [clearAutoAdvanceTimeout]);
    const startGlobalAction = useCallback((action) => {
        if (loopState.status === "hunting") {
            return { ok: false, reason: "already-active" };
        }
        if (activeEncounter) {
            return { ok: false, reason: "combat-active" };
        }
        if (!isSearchForHuntAction(action)) {
            return { ok: false, reason: "unsupported-action" };
        }
        if (!canMapStartHunting(mapData)) {
            return { ok: false, reason: "no-encounters" };
        }
        const firstEncounterKey = pickRandomEncounterFromMap(mapData);
        if (!firstEncounterKey) {
            return { ok: false, reason: "no-encounters" };
        }
        clearAutoAdvanceTimeout();
        lastResolvedCycleRef.current = null;
        encounterSequenceRef.current += 1;
        setLoopState({
            status: "hunting",
            activeActionId: action.id,
            activeMapId: mapData.id,
            completedEncounters: 0,
            pendingEncounterKey: firstEncounterKey,
            pendingEncounterToken: encounterSequenceRef.current,
            stopReason: null,
        });
        return { ok: true };
    }, [activeEncounter, clearAutoAdvanceTimeout, loopState.status, mapData]);
    useEffect(() => {
        if (loopState.status !== "hunting" ||
            !loopState.pendingEncounterKey ||
            activeEncounter) {
            return;
        }
        onOpenEncounter(loopState.pendingEncounterKey);
    }, [
        activeEncounter,
        loopState.pendingEncounterKey,
        loopState.pendingEncounterToken,
        loopState.status,
        onOpenEncounter,
    ]);
    useEffect(() => {
        if (!activeEncounter || loopState.status !== "hunting") {
            return;
        }
        if (!activeEncounter.isResolved || !activeEncounter.resolution) {
            return;
        }
        const resolutionKey = `${loopState.pendingEncounterToken}:${activeEncounter.key}:${activeEncounter.resolution}`;
        if (lastResolvedCycleRef.current === resolutionKey) {
            return;
        }
        lastResolvedCycleRef.current = resolutionKey;
        if (activeEncounter.resolution === "defeat") {
            window.setTimeout(() => {
                stopLoop("defeat");
            }, 0);
            return;
        }
        const nextEncounterKey = pickRandomEncounterFromMap(mapData);
        if (!nextEncounterKey) {
            window.setTimeout(() => {
                stopLoop("unavailable");
            }, 0);
            return;
        }
        clearAutoAdvanceTimeout();
        autoAdvanceTimeoutRef.current = setTimeout(() => {
            onCloseEncounter();
            encounterSequenceRef.current += 1;
            setLoopState((previousState) => {
                if (previousState.status !== "hunting") {
                    return previousState;
                }
                return {
                    ...previousState,
                    completedEncounters: previousState.completedEncounters + 1,
                    pendingEncounterKey: nextEncounterKey,
                    pendingEncounterToken: encounterSequenceRef.current,
                };
            });
        }, 700);
    }, [
        activeEncounter,
        clearAutoAdvanceTimeout,
        loopState.pendingEncounterToken,
        loopState.status,
        mapData,
        onCloseEncounter,
        stopLoop,
    ]);
    useEffect(() => {
        return () => {
            clearAutoAdvanceTimeout();
        };
    }, [clearAutoAdvanceTimeout]);
    useEffect(() => {
        if (loopState.status === "hunting" &&
            loopState.activeMapId &&
            loopState.activeMapId !== mapData.id) {
            window.setTimeout(() => {
                stopLoop("manual");
            }, 0);
        }
    }, [loopState.activeMapId, loopState.status, mapData.id, stopLoop]);
    const activeLoopActionLabel = useMemo(() => {
        if (!loopState.activeActionId) {
            return null;
        }
        return (mapData.globalActions?.find((action) => action.id === loopState.activeActionId)
            ?.label ?? null);
    }, [loopState.activeActionId, mapData.globalActions]);
    return {
        loopState,
        activeLoopActionLabel,
        isHunting: loopState.status === "hunting",
        startGlobalAction,
        stopLoop,
        resetLoop,
    };
}
