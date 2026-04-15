import { useMemo, useState } from "react";
import { characterClassesData } from "../../../../data/characterClassesData";
import {
  getLevelFromTotalXp,
  getXpProgressInCurrentLevel,
} from "../../../../data/experienceTable";
import {
  applySkillTrainingEvent,
  buildCharacterSkillSummaries,
  createInitialSkillProgressionState,
  type CharacterSkillProgressionState,
} from "../../domain/skillProgression";
import type { SkillTrainingEvent } from "../../domain/skillTrainingRules";
import {
  loreDiscoveriesData,
  type LoreDiscoveryKey,
} from "../../domain/loreDiscoveriesData";
import { locationDiscoveriesData } from "../../domain/locationDiscoveriesData";
import { discoverablePoisData } from "../../../world/domain/discoverablePoisData";

import type { LocationKey, ContextAction } from "../../../world/domain/locations";
import type { CharacterSummary } from "../../../../screens/CharacterSelectScreen";

type Player = {
  name: string;
  totalXp: number;
  currentHp: number;
  stamina: number;
  maxStamina: number;
  inventory: string[];
  logs: string[];
  discoveredLocations: LocationKey[];
  discoveredLore: LoreDiscoveryKey[];
  learnedRumors: string[];
  revealedPois: string[];
  discoveredPois: string[];
  skillProgression: CharacterSkillProgressionState;
};

type UseCharacterProgressionParams = {
  selectedCharacter: CharacterSummary;
  setEventLogs: React.Dispatch<React.SetStateAction<string[]>>;
};

type ProgressionState = {
  currentLocation: LocationKey;
  player: Player;
  sessionKey: string;
};

function buildSessionKey(selectedCharacter: CharacterSummary) {
  return selectedCharacter.id;
}

function createInitialPlayer(
  selectedCharacter: CharacterSummary,
  selectedClass: (typeof characterClassesData)[keyof typeof characterClassesData]
): Player {
  const initialLevel = 1;
  const initialMaxHp =
    selectedClass.baseHp +
    (initialLevel - 1) * selectedClass.levelScaling.hpPerLevel;

  return {
    name: selectedCharacter.name,
    totalXp: 0,
    currentHp: initialMaxHp,
    stamina: selectedClass.baseStamina,
    maxStamina: selectedClass.baseStamina,
    inventory: [],
    logs: [],
    discoveredLocations: ["merchant"],
    discoveredLore: [],
    learnedRumors: [],
    revealedPois: [],
    discoveredPois: [],
    skillProgression: createInitialSkillProgressionState(),
  };
}

function createInitialState(
  selectedCharacter: CharacterSummary,
  selectedClass: (typeof characterClassesData)[keyof typeof characterClassesData]
): ProgressionState {
  return {
    currentLocation: "merchant",
    player: createInitialPlayer(selectedCharacter, selectedClass),
    sessionKey: buildSessionKey(selectedCharacter),
  };
}

export function useCharacterProgression({
  selectedCharacter,
  setEventLogs,
}: UseCharacterProgressionParams) {
  const selectedClass = useMemo(
    () => characterClassesData[selectedCharacter.classKey],
    [selectedCharacter.classKey]
  );
  const sessionKey = buildSessionKey(selectedCharacter);
  const [state, setState] = useState<ProgressionState>(() =>
    createInitialState(selectedCharacter, selectedClass)
  );

  const resolvedState =
    state.sessionKey === sessionKey
      ? state
      : createInitialState(selectedCharacter, selectedClass);

  const currentLocation = resolvedState.currentLocation;
  const player = resolvedState.player;

  const computedLevel = getLevelFromTotalXp(player.totalXp);
  const computedMaxHp =
    selectedClass.baseHp +
    (computedLevel - 1) * selectedClass.levelScaling.hpPerLevel;
  const computedSp =
    selectedClass.baseSp +
    (computedLevel - 1) * selectedClass.levelScaling.spPerLevel;
  const computedCarryWeight = selectedClass.carryWeight;
  const xpProgress = getXpProgressInCurrentLevel(player.totalXp);
  const skills = useMemo(
    () => buildCharacterSkillSummaries(player.skillProgression),
    [player.skillProgression]
  );

  const updateState = (
    updater: (currentState: ProgressionState) => ProgressionState
  ) => {
    setState((previousState) => {
      const baseState =
        previousState.sessionKey === sessionKey
          ? previousState
          : createInitialState(selectedCharacter, selectedClass);

      return updater(baseState);
    });
  };

  const setPlayer: React.Dispatch<React.SetStateAction<Player>> = (value) => {
    updateState((currentState) => {
      const nextPlayer =
        typeof value === "function" ? value(currentState.player) : value;

      return {
        ...currentState,
        player: nextPlayer,
      };
    });
  };

  const recordSkillTraining = (event: SkillTrainingEvent) => {
    let levelUpMessages: string[] = [];

    setPlayer((previousPlayer) => {
      const { nextProgressionState, levelUps } = applySkillTrainingEvent(
        previousPlayer.skillProgression,
        event
      );

      levelUpMessages = levelUps.map(
        (levelUp) =>
          `System: ${levelUp.skillName} increased to level ${levelUp.newLevel}.`
      );

      if (nextProgressionState === previousPlayer.skillProgression) {
        return previousPlayer;
      }

      return {
        ...previousPlayer,
        skillProgression: nextProgressionState,
      };
    });

    if (levelUpMessages.length > 0) {
      setEventLogs((previousLogs) => [...previousLogs, ...levelUpMessages]);
    }
  };

  const gainCharacterXp = (amount: number, reason: string) => {
    if (amount <= 0) return;

    const previousLevel = getLevelFromTotalXp(player.totalXp);
    const nextTotalXp = player.totalXp + amount;
    const nextLevel = getLevelFromTotalXp(nextTotalXp);

    setPlayer((previousPlayer) => ({
      ...previousPlayer,
      totalXp: previousPlayer.totalXp + amount,
    }));

    setEventLogs((previousLogs) => {
      const nextLogs = [
        ...previousLogs,
        `System: You gained ${amount} XP. (${reason})`,
      ];

      if (nextLevel > previousLevel) {
        nextLogs.push(`System: Level up! You reached level ${nextLevel}.`);
      }

      return nextLogs;
    });
  };

  const applyDamageToPlayer = (damage: number, reason?: string) => {
    if (damage <= 0) return;

    setPlayer((previousPlayer) => {
      const nextHp = Math.max(0, previousPlayer.currentHp - damage);

      return {
        ...previousPlayer,
        currentHp: nextHp,
      };
    });

    setEventLogs((previousLogs) => [
      ...previousLogs,
      `System: You received ${damage} damage${
        reason ? ` from ${reason}` : ""
      }.`,
    ]);
  };

  const learnRumor = (rumorKey: string) => {
    if (player.learnedRumors.includes(rumorKey)) return;

    const poisUnlocked = Object.values(discoverablePoisData).filter(
      (poi) => poi.requiredRumorKey === rumorKey
    );
    const revealedPoisKeys = poisUnlocked.map((poi) => poi.key);
    const learningMessages = poisUnlocked.map((poi) => poi.learningMessage);

    setPlayer((previousPlayer) => {
      if (previousPlayer.learnedRumors.includes(rumorKey)) {
        return previousPlayer;
      }

      return {
        ...previousPlayer,
        learnedRumors: [...previousPlayer.learnedRumors, rumorKey],
        revealedPois: [...previousPlayer.revealedPois, ...revealedPoisKeys],
      };
    });

    setEventLogs((previousLogs) => [
      ...previousLogs,
      ...(learningMessages.length > 0
        ? learningMessages.map((message) => `System: ${message}`)
        : ["System: You learned something useful."]),
    ]);

    recordSkillTraining({
      type: "npc.rumor.learned",
      rumorKey,
    });
  };

  const discoverPoi = (poiKey: string) => {
    if (player.discoveredPois.includes(poiKey)) return;

    const poi = discoverablePoisData[poiKey as keyof typeof discoverablePoisData];

    setPlayer((previousPlayer) => {
      if (previousPlayer.discoveredPois.includes(poiKey)) {
        return previousPlayer;
      }

      return {
        ...previousPlayer,
        discoveredPois: [...previousPlayer.discoveredPois, poiKey],
        discoveredLocations:
          poi.locationKey &&
          !previousPlayer.discoveredLocations.includes(poi.locationKey)
            ? [...previousPlayer.discoveredLocations, poi.locationKey]
            : previousPlayer.discoveredLocations,
      };
    });

    setEventLogs((previousLogs) => [
      ...previousLogs,
      `System: ${poi.discoveryMessage}`,
    ]);

    recordSkillTraining({
      type: "world.discovery.poi",
      poiKey,
    });
  };

  const handleTravel = (nextLocation: LocationKey) => {
    updateState((currentState) => ({
      ...currentState,
      currentLocation: nextLocation,
    }));

    if (player.discoveredLocations.includes(nextLocation)) {
      return;
    }

    const discoveryData = locationDiscoveriesData[nextLocation];
    const nextDiscoveredLocations = [...player.discoveredLocations, nextLocation];

    if (!discoveryData || discoveryData.xpReward <= 0) {
      setPlayer((previousPlayer) => ({
        ...previousPlayer,
        discoveredLocations: nextDiscoveredLocations,
      }));

      recordSkillTraining({
        type: "world.discovery.location",
        locationKey: nextLocation,
      });
      return;
    }

    const previousLevel = getLevelFromTotalXp(player.totalXp);
    const nextTotalXp = player.totalXp + discoveryData.xpReward;
    const nextLevel = getLevelFromTotalXp(nextTotalXp);

    setPlayer((previousPlayer) => ({
      ...previousPlayer,
      totalXp: previousPlayer.totalXp + discoveryData.xpReward,
      discoveredLocations: nextDiscoveredLocations,
    }));

    setEventLogs((previousLogs) => {
      const nextLogs = [
        ...previousLogs,
        `System: You gained ${discoveryData.xpReward} XP. (${discoveryData.xpReason})`,
      ];

      if (nextLevel > previousLevel) {
        nextLogs.push(`System: Level up! You reached level ${nextLevel}.`);
      }

      return nextLogs;
    });

    recordSkillTraining({
      type: "world.discovery.location",
      locationKey: nextLocation,
    });
  };

  const gainLoreDiscoveryXp = (loreKey: LoreDiscoveryKey) => {
    if (player.discoveredLore.includes(loreKey)) return;

    const loreDiscovery = loreDiscoveriesData[loreKey];
    const previousLevel = getLevelFromTotalXp(player.totalXp);
    const nextTotalXp = player.totalXp + loreDiscovery.xpReward;
    const nextLevel = getLevelFromTotalXp(nextTotalXp);

    setPlayer((previousPlayer) => {
      if (previousPlayer.discoveredLore.includes(loreKey)) {
        return previousPlayer;
      }

      return {
        ...previousPlayer,
        totalXp: previousPlayer.totalXp + loreDiscovery.xpReward,
        discoveredLore: [...previousPlayer.discoveredLore, loreKey],
      };
    });

    setEventLogs((previousLogs) => {
      const nextLogs = [
        ...previousLogs,
        `System: ${loreDiscovery.discoveryMessage}`,
        `System: You gained ${loreDiscovery.xpReward} XP. (${loreDiscovery.xpReason})`,
      ];

      if (nextLevel > previousLevel) {
        nextLogs.push(`System: Level up! You reached level ${nextLevel}.`);
      }

      return nextLogs;
    });
  };

  const tryTriggerLoreDiscovery = (action: ContextAction) => {
    const matchingLoreDiscovery = Object.values(loreDiscoveriesData).find(
      (loreDiscovery) =>
        loreDiscovery.locationKey === currentLocation &&
        action.label.toLowerCase().includes(loreDiscovery.actionMatch)
    );

    if (!matchingLoreDiscovery) {
      return;
    }

    gainLoreDiscoveryXp(matchingLoreDiscovery.key);
  };

  return {
    player: {
      ...player,
      currentHp: Math.min(player.currentHp, computedMaxHp),
    },
    setPlayer,
    selectedClass,
    currentLocation,
    computedLevel,
    computedHp: Math.min(player.currentHp, computedMaxHp),
    computedMaxHp,
    computedSp,
    computedCarryWeight,
    xpProgress,
    skills,
    handleTravel,
    tryTriggerLoreDiscovery,
    gainCharacterXp,
    applyDamageToPlayer,
    learnRumor,
    discoverPoi,
    recordSkillTraining,
  };
}
