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
import {
  createInitialBestiaryProgressState,
  getBestiaryMilestoneMessage,
  registerCreatureKill,
  type CreatureBestiaryKey,
  type PlayerBestiaryProgressState,
} from "../../../bestiary";
import {
  createInitialTalentProgressState,
  unlockTalentNode,
  type CharacterTalentProgressState,
} from "../../../specializations";
import {
  createInitialSpecializationProgressState,
  selectSpecializationNode,
} from "../../../specializations";
import { skillTreesData } from "../../../specializations";
import type { SkillTrainingEvent } from "../../domain/skillTrainingRules";
import {
  loreDiscoveriesData,
  type LoreDiscoveryKey,
} from "../../domain/loreDiscoveriesData";
import { locationDiscoveriesData } from "../../domain/locationDiscoveriesData";
import { discoverablePoisData } from "../../../world/domain/discoverablePoisData";
import { collectRewardMessages } from "../../../systems/application/systems/rewardResolutionSystem";
import { resolveDiscoveryOutcomes } from "../../../systems/application/systems/discoveryOutcomeSystem";
import type {
  DiscoveryOutcome,
  DiscoveryResolution,
} from "../../../systems/domain/discoveryOutcomeTypes";

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
  bestiaryProgress: PlayerBestiaryProgressState;
  talentProgress: CharacterTalentProgressState;
  specializationProgress: ReturnType<typeof createInitialSpecializationProgressState>;
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
    bestiaryProgress: createInitialBestiaryProgressState(),
    talentProgress: createInitialTalentProgressState(),
    specializationProgress: createInitialSpecializationProgressState(),
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

  const applyDiscoveryResolutionRewards = (resolution: DiscoveryResolution) => {
    const xpReward = resolution.rewards.reduce((total, reward) => {
      return reward.type === "xp" ? total + reward.amount : total;
    }, 0);

    const previousLevel = getLevelFromTotalXp(player.totalXp);
    const nextLevel = getLevelFromTotalXp(player.totalXp + xpReward);

    setPlayer((previousPlayer) => {
      const nextInventory = [...previousPlayer.inventory];
      let nextTotalXp = previousPlayer.totalXp;
      let nextStamina = previousPlayer.stamina;

      for (const reward of resolution.rewards) {
        if (reward.type === "item") {
          for (let count = 0; count < reward.amount; count += 1) {
            nextInventory.push(reward.itemKey);
          }
          continue;
        }

        if (reward.type === "gold") {
          for (let count = 0; count < reward.amount; count += 1) {
            nextInventory.push("gold");
          }
          continue;
        }

        if (reward.type === "xp") {
          nextTotalXp += reward.amount;
          continue;
        }

        if (reward.type === "stamina") {
          nextStamina = Math.min(previousPlayer.maxStamina, nextStamina + reward.amount);
        }
      }

      return {
        ...previousPlayer,
        inventory: nextInventory,
        totalXp: nextTotalXp,
        stamina: nextStamina,
      };
    });

    const rewardMessages = collectRewardMessages(resolution.rewards);

    setEventLogs((previousLogs) => {
      const nextLogs = [...previousLogs, ...resolution.messages, ...rewardMessages];

      if (xpReward > 0 && nextLevel > previousLevel) {
        nextLogs.push(`System: Level up! You reached level ${nextLevel}.`);
      }

      return nextLogs;
    });
  };

  const registerBestiaryKill = (
    creatureKey: CreatureBestiaryKey,
    creatureName: string
  ) => {
    let milestoneMessage: string | null = null;

    setPlayer((previousPlayer) => {
      const result = registerCreatureKill(
        previousPlayer.bestiaryProgress,
        creatureKey
      );

      milestoneMessage = getBestiaryMilestoneMessage(
        creatureName,
        result.previousTier,
        result.nextTier
      );

      return {
        ...previousPlayer,
        bestiaryProgress: result.nextState,
      };
    });

    if (milestoneMessage) {
      const resolvedMilestoneMessage = milestoneMessage;
      setEventLogs((previousLogs) => [
        ...previousLogs,
        resolvedMilestoneMessage,
      ]);
    }
  };

  const spendTalentPoint = (
    nodeKey: string,
    characterLevel: number = computedLevel
  ) => {
    let wasUnlocked = false;

    setPlayer((previousPlayer) => {
      const nextTalentProgress = unlockTalentNode(
        previousPlayer.talentProgress,
        nodeKey,
        characterLevel
      );

      wasUnlocked = nextTalentProgress !== previousPlayer.talentProgress;

      if (!wasUnlocked) {
        return previousPlayer;
      }

      return {
        ...previousPlayer,
        talentProgress: nextTalentProgress,
      };
    });

    if (wasUnlocked) {
      setEventLogs((previousLogs) => [
        ...previousLogs,
        `Talent Tree: ${nodeKey} unlocked.`,
      ]);
    }
  };

  const selectSkillSpecialization = (
    skill: (typeof skills)[number],
    nodeKey: string
  ) => {
    let wasSelected = false;

    setPlayer((previousPlayer) => {
      const nextSpecializationProgress = selectSpecializationNode(
        previousPlayer.specializationProgress,
        skill,
        skillTreesData[skill.key],
        nodeKey
      );

      wasSelected =
        nextSpecializationProgress !== previousPlayer.specializationProgress;

      if (!wasSelected) {
        return previousPlayer;
      }

      return {
        ...previousPlayer,
        specializationProgress: nextSpecializationProgress,
      };
    });

    if (wasSelected) {
      setEventLogs((previousLogs) => [
        ...previousLogs,
        `Skill Tree: ${skill.name} specialization selected.`,
      ]);
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

  const learnRumor = (rumorKey: string): DiscoveryResolution | null => {
    if (player.learnedRumors.includes(rumorKey)) return null;

    const poisUnlocked = Object.values(discoverablePoisData).filter(
      (poi) => poi.requiredRumorKey === rumorKey
    );
    const newlyRevealedPois = poisUnlocked.filter(
      (poi) => !player.revealedPois.includes(poi.key)
    );
    const revealedPoisKeys = newlyRevealedPois.map((poi) => poi.key);
    const outcomes: DiscoveryOutcome[] = [];

    for (const poi of poisUnlocked) {
      if (poi.learningMessage) {
        outcomes.push({
          type: "log_message",
          message: `System: ${poi.learningMessage}`,
        });
      }
    }

    for (const poi of newlyRevealedPois) {
      outcomes.push({
        type: "reveal_poi",
        poiKey: poi.revealedMapPoiId ?? poi.locationKey ?? poi.key,
      });

      if (poi.xpReward && poi.xpReward > 0) {
        outcomes.push({
          type: "grant_reward",
          rewards: [
            {
              type: "xp",
              amount: poi.xpReward,
              reason: poi.xpReason,
            },
          ],
        });
      }
    }

    const resolution = resolveDiscoveryOutcomes(outcomes);

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

    applyDiscoveryResolutionRewards(resolution);

    recordSkillTraining({
      type: "npc.rumor.learned",
      rumorKey,
    });

    return resolution;
  };

  const discoverPoi = (poiKey: string): DiscoveryResolution | null => {
    if (player.discoveredPois.includes(poiKey)) return null;

    const poi = discoverablePoisData[poiKey as keyof typeof discoverablePoisData];
    const outcomes: DiscoveryOutcome[] = [
      {
        type: "discover_poi",
        poiKey: poi.revealedMapPoiId ?? poi.locationKey ?? poi.key,
      },
      {
        type: "log_message",
        message: `System: ${poi.discoveryMessage}`,
      },
    ];

    if (poi.xpReward && poi.xpReward > 0) {
      outcomes.push({
        type: "grant_reward",
        rewards: [
          {
            type: "xp",
            amount: poi.xpReward,
            reason: poi.xpReason,
          },
        ],
      });
    }

    const resolution = resolveDiscoveryOutcomes(outcomes);

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

    applyDiscoveryResolutionRewards(resolution);

    recordSkillTraining({
      type: "world.discovery.poi",
      poiKey,
    });

    return resolution;
  };

  const handleTravel = (nextLocation: LocationKey): DiscoveryResolution | null => {
    updateState((currentState) => ({
      ...currentState,
      currentLocation: nextLocation,
    }));

    if (player.discoveredLocations.includes(nextLocation)) {
      return null;
    }

    const discoveryData = locationDiscoveriesData[nextLocation];
    const nextDiscoveredLocations = [...player.discoveredLocations, nextLocation];
    const outcomes: DiscoveryOutcome[] = [
      {
        type: "discover_location",
        locationKey: nextLocation,
      },
    ];

    if (discoveryData?.xpReward && discoveryData.xpReward > 0) {
      outcomes.push({
        type: "grant_reward",
        rewards: [
          {
            type: "xp",
            amount: discoveryData.xpReward,
            reason: discoveryData.xpReason,
          },
        ],
      });
    }

    const resolution = resolveDiscoveryOutcomes(outcomes);

    setPlayer((previousPlayer) => ({
      ...previousPlayer,
      discoveredLocations: nextDiscoveredLocations,
    }));

    applyDiscoveryResolutionRewards(resolution);

    recordSkillTraining({
      type: "world.discovery.location",
      locationKey: nextLocation,
    });

    return resolution;
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
    registerBestiaryKill,
    spendTalentPoint,
    selectSkillSpecialization,
  };
}
