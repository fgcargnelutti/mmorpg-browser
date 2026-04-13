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
import { discoverablePoisData } from "../data/discoverablePoisData";

import type { LocationKey, ContextAction } from "../data/locations";
import type { CharacterSummary } from "../screens/CharacterSelectScreen";

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

  const computedMaxHp =
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
    const initialLevel = 1;
    const initialMaxHp =
      selectedClass.baseHp +
      (initialLevel - 1) * selectedClass.levelScaling.hpPerLevel;

    setPlayer({
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
    });

    setCurrentLocation("merchant");
  }, [selectedCharacter, selectedClass]);

  useEffect(() => {
    if (!player) return;

    if (player.currentHp > computedMaxHp) {
      setPlayer((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          currentHp: computedMaxHp,
        };
      });
    }
  }, [computedMaxHp, player]);

  const gainCharacterXp = (amount: number, reason: string) => {
    if (!player || amount <= 0) return;

    const previousLevel = getLevelFromTotalXp(player.totalXp);
    const nextTotalXp = player.totalXp + amount;
    const nextLevel = getLevelFromTotalXp(nextTotalXp);

    setPlayer((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        totalXp: prev.totalXp + amount,
      };
    });

    setEventLogs((prevLogs) => {
      const nextLogs = [
        ...prevLogs,
        `System: You gained ${amount} XP. (${reason})`,
      ];

      if (nextLevel > previousLevel) {
        nextLogs.push(`System: Level up! You reached level ${nextLevel}.`);
      }

      return nextLogs;
    });
  };

  const applyDamageToPlayer = (damage: number, reason?: string) => {
    if (!player || damage <= 0) return;

    setPlayer((prev) => {
      if (!prev) return prev;

      const nextHp = Math.max(0, prev.currentHp - damage);

      return {
        ...prev,
        currentHp: nextHp,
      };
    });

    setEventLogs((prevLogs) => [
      ...prevLogs,
      `System: You received ${damage} damage${
        reason ? ` from ${reason}` : ""
      }.`,
    ]);
  };

  const learnRumor = (rumorKey: string) => {
    if (!player) return;
    if (player.learnedRumors.includes(rumorKey)) return;

    const poisUnlocked = Object.values(discoverablePoisData).filter(
      (poi) => poi.requiredRumorKey === rumorKey
    );

    const revealedPoisKeys = poisUnlocked.map((poi) => poi.key);

    setPlayer((prev) => {
      if (!prev) return prev;
      if (prev.learnedRumors.includes(rumorKey)) return prev;

      return {
        ...prev,
        learnedRumors: [...prev.learnedRumors, rumorKey],
        revealedPois: [...prev.revealedPois, ...revealedPoisKeys],
      };
    });

    setEventLogs((prevLogs) => [
      ...prevLogs,
      "✨ System: You learned something.",
    ]);
  };

  const discoverPoi = (poiKey: string) => {
    if (!player) return;
    if (player.discoveredPois.includes(poiKey)) return;

    const poi = discoverablePoisData[poiKey as keyof typeof discoverablePoisData];

    setPlayer((prev) => {
      if (!prev) return prev;
      if (prev.discoveredPois.includes(poiKey)) return prev;

      return {
        ...prev,
        discoveredPois: [...prev.discoveredPois, poiKey],
        discoveredLocations: prev.discoveredLocations.includes(poi.locationKey)
          ? prev.discoveredLocations
          : [...prev.discoveredLocations, poi.locationKey],
      };
    });

    setEventLogs((prevLogs) => [
      ...prevLogs,
      `System: ${poi.discoveryMessage}`,
    ]);
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
      setPlayer((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          discoveredLocations: nextDiscoveredLocations,
        };
      });
      return;
    }

    const previousLevel = getLevelFromTotalXp(player.totalXp);
    const nextTotalXp = player.totalXp + discoveryData.xpReward;
    const nextLevel = getLevelFromTotalXp(nextTotalXp);

    setPlayer((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        totalXp: prev.totalXp + discoveryData.xpReward,
        discoveredLocations: nextDiscoveredLocations,
      };
    });

    setEventLogs((prevLogs) => {
      const nextLogs = [
        ...prevLogs,
        `System: You gained ${discoveryData.xpReward} XP. (${discoveryData.xpReason})`,
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

    setPlayer((prev) => {
      if (!prev) return prev;
      if (prev.discoveredLore.includes(loreKey)) return prev;

      return {
        ...prev,
        totalXp: prev.totalXp + loreDiscovery.xpReward,
        discoveredLore: [...prev.discoveredLore, loreKey],
      };
    });

    setEventLogs((prevLogs) => {
      const nextLogs = [
        ...prevLogs,
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
    computedHp: player?.currentHp ?? computedMaxHp,
    computedMaxHp,
    computedSp,
    computedCarryWeight,
    xpProgress,

    handleTravel,
    tryTriggerLoreDiscovery,
    gainCharacterXp,
    applyDamageToPlayer,

    learnRumor,
    discoverPoi,
  };
}