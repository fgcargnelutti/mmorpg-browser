import { useEffect, useMemo, useRef, useState } from "react";
import type { FishingSpotConfig } from "../../domain/fishingConfigs";

type FishingPhase = "hook" | "struggle" | "success" | "failure";
type FishingDirection = "up" | "down";

type FishingHotspot = {
  id: string;
  leftPercent: number;
  topPercent: number;
};

type UseFishingMinigameParams = {
  config: FishingSpotConfig;
  isOpen: boolean;
  onCatch: () => void;
  onEscape: () => void;
};

type UseFishingMinigameResult = {
  phase: FishingPhase;
  hotspot: FishingHotspot | null;
  markerPosition: number;
  tension: number;
  timeRemainingMs: number;
  currentDirection: FishingDirection;
  idealZoneCenter: number;
  idealZoneSize: number;
  handleHotspotClick: () => void;
  reset: () => void;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildHotspot(config: FishingSpotConfig, index: number): FishingHotspot {
  const { validArea } = config.hotspot;

  return {
    id: `hotspot-${index}-${Date.now()}`,
    leftPercent: randomBetween(validArea.minXPercent, validArea.maxXPercent),
    topPercent: randomBetween(validArea.minYPercent, validArea.maxYPercent),
  };
}

export function useFishingMinigame({
  config,
  isOpen,
  onCatch,
  onEscape,
}: UseFishingMinigameParams): UseFishingMinigameResult {
  const [phase, setPhase] = useState<FishingPhase>("hook");
  const [hotspot, setHotspot] = useState<FishingHotspot | null>(null);
  const [markerPosition, setMarkerPosition] = useState(50);
  const [tension, setTension] = useState(100);
  const [timeRemainingMs, setTimeRemainingMs] = useState(config.struggle.durationMs);
  const [currentDirection, setCurrentDirection] = useState<FishingDirection>("down");

  const keyStateRef = useRef({ up: false, down: false });
  const hotspotIndexRef = useRef(0);
  const hookTimeoutRef = useRef<number | null>(null);
  const hookRespawnTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousFrameTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef(0);
  const directionChangeAtRef = useRef(0);
  const directionRef = useRef<FishingDirection>("down");
  const markerPositionRef = useRef(50);
  const tensionRef = useRef(100);
  const settledRef = useRef(false);

  const clearHookTimers = () => {
    if (hookTimeoutRef.current !== null) {
      window.clearTimeout(hookTimeoutRef.current);
      hookTimeoutRef.current = null;
    }

    if (hookRespawnTimeoutRef.current !== null) {
      window.clearTimeout(hookRespawnTimeoutRef.current);
      hookRespawnTimeoutRef.current = null;
    }
  };

  const clearStruggleFrame = () => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const reset = () => {
    clearHookTimers();
    clearStruggleFrame();
    settledRef.current = false;
    elapsedTimeRef.current = 0;
    previousFrameTimeRef.current = null;
    hotspotIndexRef.current = 0;
    markerPositionRef.current = 50;
    tensionRef.current = 100;
    directionRef.current = "down";
    keyStateRef.current = { up: false, down: false };
    setPhase("hook");
    setHotspot(null);
    setMarkerPosition(50);
    setTension(100);
    setTimeRemainingMs(config.struggle.durationMs);
    setCurrentDirection("down");
  };

  useEffect(() => {
    if (!isOpen) {
      clearHookTimers();
      clearStruggleFrame();
      return;
    }

    reset();

    return () => {
      clearHookTimers();
      clearStruggleFrame();
    };
  }, [config, isOpen]);

  useEffect(() => {
    if (!isOpen || phase !== "hook") return;

    const spawnHotspot = () => {
      const nextHotspot = buildHotspot(config, hotspotIndexRef.current);
      hotspotIndexRef.current += 1;
      setHotspot(nextHotspot);

      hookTimeoutRef.current = window.setTimeout(() => {
        setHotspot(null);

        hookRespawnTimeoutRef.current = window.setTimeout(() => {
          spawnHotspot();
        }, config.hotspot.respawnDelayMs);
      }, config.hotspot.activeDurationMs);
    };

    spawnHotspot();

    return () => {
      clearHookTimers();
    };
  }, [config, isOpen, phase]);

  useEffect(() => {
    if (!isOpen || phase !== "struggle") return;

    const setNextDirectionChange = (elapsedMs: number) => {
      directionChangeAtRef.current =
        elapsedMs +
        randomBetween(
          config.struggle.directionChangeMinMs,
          config.struggle.directionChangeMaxMs
        );
    };

    setNextDirectionChange(0);

    const tick = (timestamp: number) => {
      if (previousFrameTimeRef.current === null) {
        previousFrameTimeRef.current = timestamp;
      }

      const deltaMs = timestamp - previousFrameTimeRef.current;
      previousFrameTimeRef.current = timestamp;
      elapsedTimeRef.current += deltaMs;

      if (elapsedTimeRef.current >= directionChangeAtRef.current) {
        directionRef.current = Math.random() > 0.5 ? "up" : "down";
        setCurrentDirection(directionRef.current);
        setNextDirectionChange(elapsedTimeRef.current);
      }

      const dt = deltaMs / 1000;
      const fishForce =
        directionRef.current === "up"
          ? -config.struggle.fishForce
          : config.struggle.fishForce;
      const inputForce =
        (keyStateRef.current.down ? config.struggle.controlForce : 0) -
        (keyStateRef.current.up ? config.struggle.controlForce : 0);
      const centerForce =
        (config.struggle.idealZoneCenter - markerPositionRef.current) *
        config.struggle.centerPull;

      markerPositionRef.current = clamp(
        markerPositionRef.current + (fishForce + inputForce + centerForce) * dt,
        0,
        100
      );

      const distanceFromCenter = Math.abs(
        markerPositionRef.current - config.struggle.idealZoneCenter
      );
      const idealHalfSize = config.struggle.idealZoneSize / 2;

      if (distanceFromCenter <= idealHalfSize) {
        tensionRef.current = clamp(
          tensionRef.current + config.struggle.tensionRecoverRate * dt,
          0,
          100
        );
      } else {
        const overflowFactor = 1 + distanceFromCenter / 30;
        tensionRef.current = clamp(
          tensionRef.current - config.struggle.tensionDrainRate * overflowFactor * dt,
          0,
          100
        );
      }

      const remainingTime = Math.max(
        0,
        config.struggle.durationMs - elapsedTimeRef.current
      );

      setMarkerPosition(markerPositionRef.current);
      setTension(tensionRef.current);
      setTimeRemainingMs(remainingTime);

      if (tensionRef.current <= 0 && !settledRef.current) {
        settledRef.current = true;
        setPhase("failure");
        onEscape();
        return;
      }

      if (remainingTime <= 0 && !settledRef.current) {
        settledRef.current = true;
        setPhase("success");
        onCatch();
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      clearStruggleFrame();
      previousFrameTimeRef.current = null;
      elapsedTimeRef.current = 0;
    };
  }, [config, isOpen, onCatch, onEscape, phase]);

  useEffect(() => {
    if (!isOpen || phase !== "struggle") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "w") {
        keyStateRef.current.up = true;
      }

      if (event.key.toLowerCase() === "s") {
        keyStateRef.current.down = true;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "w") {
        keyStateRef.current.up = false;
      }

      if (event.key.toLowerCase() === "s") {
        keyStateRef.current.down = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isOpen, phase]);

  const handleHotspotClick = () => {
    if (phase !== "hook") return;

    clearHookTimers();
    setHotspot(null);
    setPhase("struggle");
    settledRef.current = false;
    elapsedTimeRef.current = 0;
    previousFrameTimeRef.current = null;
    markerPositionRef.current = 50;
    tensionRef.current = 100;
    directionRef.current = Math.random() > 0.5 ? "up" : "down";
    setMarkerPosition(50);
    setTension(100);
    setTimeRemainingMs(config.struggle.durationMs);
    setCurrentDirection(directionRef.current);
  };

  return useMemo(
    () => ({
      phase,
      hotspot,
      markerPosition,
      tension,
      timeRemainingMs,
      currentDirection,
      idealZoneCenter: config.struggle.idealZoneCenter,
      idealZoneSize: config.struggle.idealZoneSize,
      handleHotspotClick,
      reset,
    }),
    [
      config.struggle.idealZoneCenter,
      config.struggle.idealZoneSize,
      currentDirection,
      hotspot,
      markerPosition,
      phase,
      tension,
      timeRemainingMs,
    ]
  );
}
