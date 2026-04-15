import { useEffect, useMemo, useRef, useState } from "react";
import type { MiningSpotConfig } from "../../domain/miningConfigs";

type MiningPhase = "active" | "success" | "failure";

type MiningWeakPoint = {
  id: string;
  leftPercent: number;
  topPercent: number;
  sizePx: number;
};

type MiningImpactState = "idle" | "hit" | "miss";

type UseMiningMinigameParams = {
  config: MiningSpotConfig;
  isOpen: boolean;
  onSuccess: () => void;
  onFailure: () => void;
};

type UseMiningMinigameResult = {
  phase: MiningPhase;
  weakPoint: MiningWeakPoint | null;
  progress: number;
  timeRemainingMs: number;
  hits: number;
  misses: number;
  combo: number;
  impactState: MiningImpactState;
  handleWeakPointClick: () => void;
  handleRockMissClick: () => void;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildWeakPoint(config: MiningSpotConfig, index: number): MiningWeakPoint {
  const { validArea } = config.weakPoint;

  return {
    id: `mining-weak-point-${index}-${Date.now()}`,
    leftPercent: randomBetween(validArea.minXPercent, validArea.maxXPercent),
    topPercent: randomBetween(validArea.minYPercent, validArea.maxYPercent),
    sizePx: config.weakPoint.sizePx,
  };
}

export function useMiningMinigame({
  config,
  isOpen,
  onSuccess,
  onFailure,
}: UseMiningMinigameParams): UseMiningMinigameResult {
  const [phase, setPhase] = useState<MiningPhase>("active");
  const [weakPoint, setWeakPoint] = useState<MiningWeakPoint | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeRemainingMs, setTimeRemainingMs] = useState(config.session.durationMs);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [combo, setCombo] = useState(0);
  const [impactState, setImpactState] = useState<MiningImpactState>("idle");

  const weakPointIndexRef = useRef(0);
  const weakPointTimeoutRef = useRef<number | null>(null);
  const weakPointRespawnTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousFrameTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef(0);
  const progressRef = useRef(0);
  const settledRef = useRef(false);
  const impactTimeoutRef = useRef<number | null>(null);

  const clearWeakPointTimers = () => {
    if (weakPointTimeoutRef.current !== null) {
      window.clearTimeout(weakPointTimeoutRef.current);
      weakPointTimeoutRef.current = null;
    }

    if (weakPointRespawnTimeoutRef.current !== null) {
      window.clearTimeout(weakPointRespawnTimeoutRef.current);
      weakPointRespawnTimeoutRef.current = null;
    }
  };

  const clearAnimationFrame = () => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const clearImpactTimeout = () => {
    if (impactTimeoutRef.current !== null) {
      window.clearTimeout(impactTimeoutRef.current);
      impactTimeoutRef.current = null;
    }
  };

  const showImpact = (nextState: MiningImpactState) => {
    clearImpactTimeout();
    setImpactState(nextState);
    impactTimeoutRef.current = window.setTimeout(() => {
      setImpactState("idle");
    }, 180);
  };

  const resetState = () => {
    clearWeakPointTimers();
    clearAnimationFrame();
    clearImpactTimeout();
    weakPointIndexRef.current = 0;
    previousFrameTimeRef.current = null;
    elapsedTimeRef.current = 0;
    progressRef.current = 0;
    settledRef.current = false;
    setPhase("active");
    setWeakPoint(null);
    setProgress(0);
    setTimeRemainingMs(config.session.durationMs);
    setHits(0);
    setMisses(0);
    setCombo(0);
    setImpactState("idle");
  };

  useEffect(() => {
    if (!isOpen) {
      clearWeakPointTimers();
      clearAnimationFrame();
      clearImpactTimeout();
      return;
    }

    resetState();

    return () => {
      clearWeakPointTimers();
      clearAnimationFrame();
      clearImpactTimeout();
    };
  }, [config, isOpen]);

  useEffect(() => {
    if (!isOpen || phase !== "active") return;

    const spawnWeakPoint = () => {
      setWeakPoint(buildWeakPoint(config, weakPointIndexRef.current));
      weakPointIndexRef.current += 1;

      weakPointTimeoutRef.current = window.setTimeout(() => {
        setWeakPoint(null);

        weakPointRespawnTimeoutRef.current = window.setTimeout(() => {
          spawnWeakPoint();
        }, config.weakPoint.respawnDelayMs);
      }, config.weakPoint.activeDurationMs);
    };

    spawnWeakPoint();

    return () => {
      clearWeakPointTimers();
    };
  }, [config, isOpen, phase]);

  useEffect(() => {
    if (!isOpen || phase !== "active") return;

    const tick = (timestamp: number) => {
      if (previousFrameTimeRef.current === null) {
        previousFrameTimeRef.current = timestamp;
      }

      const deltaMs = timestamp - previousFrameTimeRef.current;
      previousFrameTimeRef.current = timestamp;
      elapsedTimeRef.current += deltaMs;

      const nextProgress = clamp(
        progressRef.current - config.session.idleDecayPerSecond * (deltaMs / 1000),
        0,
        config.session.targetProgress
      );
      progressRef.current = nextProgress;
      setProgress(nextProgress);

      const remainingTime = Math.max(0, config.session.durationMs - elapsedTimeRef.current);
      setTimeRemainingMs(remainingTime);

      if (remainingTime <= 0 && !settledRef.current) {
        settledRef.current = true;
        clearWeakPointTimers();
        setWeakPoint(null);
        setPhase("failure");
        onFailure();
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      clearAnimationFrame();
      previousFrameTimeRef.current = null;
      elapsedTimeRef.current = 0;
    };
  }, [config, isOpen, onFailure, phase]);

  const handleWeakPointClick = () => {
    if (phase !== "active") return;

    clearWeakPointTimers();
    setWeakPoint(null);
    showImpact("hit");
    setHits((previousHits) => previousHits + 1);
    setCombo((previousCombo) => previousCombo + 1);

    const nextProgress = clamp(
      progressRef.current + config.session.hitProgress,
      0,
      config.session.targetProgress
    );

    progressRef.current = nextProgress;
    setProgress(nextProgress);

    if (nextProgress >= config.session.targetProgress && !settledRef.current) {
      settledRef.current = true;
      clearWeakPointTimers();
      setWeakPoint(null);
      setPhase("success");
      onSuccess();
      return;
    }

    const spawnWeakPoint = () => {
      setWeakPoint(buildWeakPoint(config, weakPointIndexRef.current));
      weakPointIndexRef.current += 1;

      weakPointTimeoutRef.current = window.setTimeout(() => {
        setWeakPoint(null);

        weakPointRespawnTimeoutRef.current = window.setTimeout(() => {
          if (settledRef.current) return;
          spawnWeakPoint();
        }, config.weakPoint.respawnDelayMs);
      }, config.weakPoint.activeDurationMs);
    };

    weakPointRespawnTimeoutRef.current = window.setTimeout(() => {
      if (settledRef.current) return;
      spawnWeakPoint();
    }, config.weakPoint.respawnDelayMs);
  };

  const handleRockMissClick = () => {
    if (phase !== "active") return;

    showImpact("miss");
    setMisses((previousMisses) => previousMisses + 1);
    setCombo(0);

    const nextProgress = clamp(
      progressRef.current - config.session.missPenalty,
      0,
      config.session.targetProgress
    );

    progressRef.current = nextProgress;
    setProgress(nextProgress);
  };

  return useMemo(
    () => ({
      phase,
      weakPoint,
      progress,
      timeRemainingMs,
      hits,
      misses,
      combo,
      impactState,
      handleWeakPointClick,
      handleRockMissClick,
    }),
    [combo, hits, impactState, misses, phase, progress, timeRemainingMs, weakPoint]
  );
}
