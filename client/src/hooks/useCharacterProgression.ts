import { useEffect, useState } from "react";
import { characterClassesData } from "../data/characterClassesData";
import {
  getLevelFromTotalXp,
  getXpProgressInCurrentLevel,
} from "../data/experienceTable";
import {
  loreDiscoveriesData,
  type LoreDiscoveryKey,
} from "../data/loreDiscoveriesData";
import { locationDiscoveriesData } from "../data/locationDiscoveriesData";
import type { LocationKey, ContextAction } from "../data/locations";
import type { CharacterSummary } from "../screens/CharacterSelectScreen";

type Player = {
  name: string;
  totalXp: number;
  stamina: number;
  maxStamina: number;
  inventory: string[];
  logs: string[];
  discoveredLocations: LocationKey[];
  discoveredLore: LoreDiscoveryKey[];
};

type UseCharacterProgressionParams = {
  selectedCharacter: CharacterSummary;
  setEventLogs: React.Dispatch<React.SetStateAction<string[]>>;
};

export function useCharacterProgression({
  selectedCharacter,
  setEventLogs,
}: UseCharacterProgressionParams) {
  const [player, setPlayer] = useState<Player | null>(null);

  const [currentLocation, setCurrentLocation] =
    useState<LocationKey>("merchant");

  const selectedClass = characterClassesData[selectedCharacter.classKey];

  const computedLevel = player
    ? getLevelFromTotalXp(player.totalXp)
    : selectedCharacter.level;

  const computedHp =
    selectedClass.baseHp +
    (computedLevel - 1) * selectedClass.levelScaling.hpPerLevel;

  const computedSp =
    selectedClass.baseSp +
    (computedLevel - 1) * selectedClass.levelScaling.spPerLevel;

  const computedCarryWeight = selectedClass.carryWeight;

  const xpProgress = player
    ? getXpProgressInCurrentLevel(player.totalXp)
    : null;

  useEffect(() => {
    setPlayer({
      name: selectedCharacter.name,
      totalXp: 0,
      stamina: selectedClass.baseStamina,
      maxStamina: selectedClass.baseStamina,
      inventory: [],
      logs: [],
      discoveredLocations: ["merchant"],
      discoveredLore: [],
    });

    setCurrentLocation("merchant");
  }, [selectedCharacter, selectedClass]);

  const gainCharacterXp = (amount: number, reason: string) => {
    if (!player || amount <= 0) return;

    const previousLevel = getLevelFromTotalXp(player.totalXp);
    const nextTotalXp = player.totalXp + amount;
    const nextLevel = getLevelFromTotalXp(nextTotalXp);

    setPlayer({
      ...player,
      totalXp: nextTotalXp,
    });

    setEventLogs((prev) => {
      const nextLogs = [
        ...prev,
        `System: You gained ${amount} XP. (${reason})`,
      ];

      if (nextLevel > previousLevel) {
        nextLogs.push(`System: Level up! You reached level ${nextLevel}.`);
      }

      return nextLogs;
    });
  };

  const gainLoreDiscoveryXp = (loreKey: LoreDiscoveryKey) => {
    if (!player) return;
    if (player.discoveredLore.includes(loreKey)) return;

    const loreDiscovery = loreDiscoveriesData[loreKey];
    const previousLevel = getLevelFromTotalXp(player.totalXp);
    const nextTotalXp = player.totalXp + loreDiscovery.xpReward;
    const nextLevel = getLevelFromTotalXp(nextTotalXp);

    setPlayer({
      ...player,
      totalXp: nextTotalXp,
      discoveredLore: [...player.discoveredLore, loreKey],
    });

    setEventLogs((prev) => {
      const nextLogs = [
        ...prev,
        `System: ${loreDiscovery.discoveryMessage}`,
        `System: You gained ${loreDiscovery.xpReward} XP. (${loreDiscovery.xpReason})`,
      ];

      if (nextLevel > previousLevel) {
        nextLogs.push(`System: Level up! You reached level ${nextLevel}.`);
      }

      return nextLogs;
    });
  };

  const handleTravel = (nextLocation: LocationKey) => {
    if (!player) return;

    setCurrentLocation(nextLocation);

    if (player.discoveredLocations.includes(nextLocation)) {
      return;
    }

    const discoveryData = locationDiscoveriesData[nextLocation];
    const nextDiscoveredLocations = [...player.discoveredLocations, nextLocation];

    if (!discoveryData || discoveryData.xpReward <= 0) {
      setPlayer({
        ...player,
        discoveredLocations: nextDiscoveredLocations,
      });
      return;
    }

    const previousLevel = getLevelFromTotalXp(player.totalXp);
    const nextTotalXp = player.totalXp + discoveryData.xpReward;
    const nextLevel = getLevelFromTotalXp(nextTotalXp);

    setPlayer({
      ...player,
      totalXp: nextTotalXp,
      discoveredLocations: nextDiscoveredLocations,
    });

    setEventLogs((prev) => {
      const nextLogs = [
        ...prev,
        `System: You gained ${discoveryData.xpReward} XP. (${discoveryData.xpReason})`,
      ];

      if (nextLevel > previousLevel) {
        nextLogs.push(`System: Level up! You reached level ${nextLevel}.`);
      }

      return nextLogs;
    });
  };

  const tryTriggerLoreDiscovery = (action: ContextAction) => {
    if (!player) return;

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
    player,
    setPlayer,
    selectedClass,
    currentLocation,
    computedLevel,
    computedHp,
    computedSp,
    computedCarryWeight,
    xpProgress,
    handleTravel,
    tryTriggerLoreDiscovery,
    gainCharacterXp,
  };
}