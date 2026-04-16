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
import { applyRewardsToPlayerSnapshot } from "../../../systems/application/systems/playerRewardStateSystem";
import {
  createSystemMessage,
} from "../../../systems/application/systems/eventLogMessageSystem";
import type { DiscoveryResolution } from "../../../systems/domain/discoveryOutcomeTypes";
import {
  applyLocationDiscoveryState,
  applyPoiDiscoveryState,
  applyRumorDiscoveryState,
  findMatchingLoreDiscovery,
  resolveLocationDiscovery,
  resolvePoiDiscovery,
  resolveRumorDiscovery,
} from "../systems/progressionDiscoverySystem";
import {
  applyPlayerDamageState,
  createDamageTakenMessages,
  createLoreDiscoveryMessages,
  createRewardApplicationMessages,
  createXpGainMessages,
} from "../systems/progressionVitalsSystem";

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
          createSystemMessage(
            `${levelUp.skillName} increased to level ${levelUp.newLevel}.`
          )
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
    setPlayer((previousPlayer) => {
      return applyRewardsToPlayerSnapshot({
        ...previousPlayer,
      }, resolution.rewards);
    });

    setEventLogs((previousLogs) => {
      return [
        ...previousLogs,
        ...createRewardApplicationMessages(
          player.totalXp,
          resolution.rewards,
          resolution.messages
        ),
      ];
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

    setPlayer((previousPlayer) =>
      applyRewardsToPlayerSnapshot(previousPlayer, [
        {
          type: "xp",
          amount,
          reason,
        },
      ])
    );

    setEventLogs((previousLogs) => [
      ...previousLogs,
      ...createXpGainMessages(player.totalXp, amount, reason),
    ]);
  };

  const applyDamageToPlayer = (damage: number, reason?: string) => {
    if (damage <= 0) return;

    setPlayer((previousPlayer) => applyPlayerDamageState(previousPlayer, damage));

    setEventLogs((previousLogs) => [
      ...previousLogs,
      ...createDamageTakenMessages(damage, reason),
    ]);
  };

  const learnRumor = (rumorKey: string): DiscoveryResolution | null => {
    const discovery = resolveRumorDiscovery(rumorKey, player);

    if (!discovery) return null;

    setPlayer((previousPlayer) => {
      return applyRumorDiscoveryState(
        previousPlayer,
        rumorKey,
        discovery.revealedPoiKeys
      );
    });

    applyDiscoveryResolutionRewards(discovery.resolution);

    recordSkillTraining({
      type: "npc.rumor.learned",
      rumorKey,
    });

    return discovery.resolution;
  };

  const discoverPoi = (poiKey: string): DiscoveryResolution | null => {
    const discovery = resolvePoiDiscovery(poiKey, player);

    if (!discovery) return null;

    setPlayer((previousPlayer) => {
      return applyPoiDiscoveryState(
        previousPlayer,
        poiKey,
        discovery.locationKey
      );
    });

    applyDiscoveryResolutionRewards(discovery.resolution);

    recordSkillTraining({
      type: "world.discovery.poi",
      poiKey,
    });

    return discovery.resolution;
  };

  const handleTravel = (nextLocation: LocationKey): DiscoveryResolution | null => {
    updateState((currentState) => ({
      ...currentState,
      currentLocation: nextLocation,
    }));

    const resolution = resolveLocationDiscovery(nextLocation, player);

    if (!resolution) {
      return null;
    }

    setPlayer((previousPlayer) =>
      applyLocationDiscoveryState(previousPlayer, nextLocation)
    );

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

    setPlayer((previousPlayer) => {
      if (previousPlayer.discoveredLore.includes(loreKey)) {
        return previousPlayer;
      }

      return {
        ...applyRewardsToPlayerSnapshot(previousPlayer, [
          {
            type: "xp",
            amount: loreDiscovery.xpReward,
            reason: loreDiscovery.xpReason,
          },
        ]),
        discoveredLore: [...previousPlayer.discoveredLore, loreKey],
      };
    });

    setEventLogs((previousLogs) => {
      return [
        ...previousLogs,
        ...createLoreDiscoveryMessages(
          player.totalXp,
          loreDiscovery.discoveryMessage,
          loreDiscovery.xpReward,
          loreDiscovery.xpReason
        ),
      ];
    });
  };

  const tryTriggerLoreDiscovery = (action: ContextAction) => {
    const matchingLoreDiscovery = findMatchingLoreDiscovery(currentLocation, action);

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
