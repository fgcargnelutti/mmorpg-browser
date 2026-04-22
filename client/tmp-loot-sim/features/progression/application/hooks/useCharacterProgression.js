import { useEffect, useMemo, useRef, useState } from "react";
import { characterClassesData } from "../../../../data/characterClassesData";
import { getLevelFromTotalXp, getXpProgressInCurrentLevel, } from "../../../../data/experienceTable";
import { applySkillTrainingEvent, buildCharacterSkillSummaries, createInitialSkillProgressionState, } from "../../domain/skillProgression";
import { createInitialBestiaryProgressState, getBestiaryMilestoneMessage, registerCreatureKill, } from "../../../bestiary";
import { createInitialTalentProgressState, unlockTalentNode, } from "../../../specializations";
import { createInitialSpecializationProgressState, selectSpecializationNode, } from "../../../specializations";
import { skillTreesData } from "../../../specializations";
import { loreDiscoveriesData, } from "../../domain/loreDiscoveriesData";
import { applyRewardsToPlayerSnapshot } from "../../../systems/application/systems/playerRewardStateSystem";
import { createSystemMessage, } from "../../../systems/application/systems/eventLogMessageSystem";
import { applyLocationDiscoveryState, applyPoiDiscoveryState, applyRumorDiscoveryState, findMatchingLoreDiscovery, resolveLocationDiscovery, resolvePoiDiscovery, resolveRumorDiscovery, } from "../systems/progressionDiscoverySystem";
import { applyPlayerDamageState, createDamageTakenMessages, createLoreDiscoveryMessages, createRewardApplicationMessages, createXpGainMessages, } from "../systems/progressionVitalsSystem";
import { resolveCharacterRegenConfig } from "../../domain/regenerationData";
import { applyOfflineStaminaRegen, applyOnlineRegen, createInitialPlayerRegenState, } from "../systems/playerRegenerationSystem";
import { deserializePlayerVitalsState, serializePlayerVitalsState, } from "../systems/playerVitalsPersistenceAdapter";
const initialCampaignInventory = [
    "life-potion",
    "mana-potion",
    "variable-potion",
    "rabbit-meat",
    "rabbit-meat",
    "rabbit-meat",
    "rabbit-meat",
    "rabbit-meat",
];
const playerVitalsStorageKeyPrefix = "howl-of-collapse:player-vitals:";
const onlineRegenCheckIntervalMs = 15_000;
function buildSessionKey(selectedCharacter) {
    return selectedCharacter.id;
}
function buildPlayerVitalsStorageKey(sessionKey) {
    return `${playerVitalsStorageKeyPrefix}${sessionKey}`;
}
function resolveDerivedStats(selectedClass, totalXp) {
    const level = getLevelFromTotalXp(totalXp);
    const maxHp = selectedClass.baseHp + (level - 1) * selectedClass.levelScaling.hpPerLevel;
    const maxSp = selectedClass.baseSp + (level - 1) * selectedClass.levelScaling.spPerLevel;
    return {
        level,
        maxHp,
        maxSp,
        maxStamina: selectedClass.baseStamina,
    };
}
function readPersistedPlayerVitals(sessionKey, fallbackPlayer, fallbackRegenState) {
    if (typeof window === "undefined") {
        return {
            player: fallbackPlayer,
            regenState: fallbackRegenState,
        };
    }
    const rawPayload = window.localStorage.getItem(buildPlayerVitalsStorageKey(sessionKey));
    if (!rawPayload) {
        return {
            player: fallbackPlayer,
            regenState: fallbackRegenState,
        };
    }
    try {
        const payload = JSON.parse(rawPayload);
        return deserializePlayerVitalsState(payload, sessionKey, fallbackPlayer, fallbackRegenState);
    }
    catch {
        return {
            player: fallbackPlayer,
            regenState: fallbackRegenState,
        };
    }
}
function persistPlayerVitals(sessionKey, player, regenState) {
    if (typeof window === "undefined") {
        return;
    }
    window.localStorage.setItem(buildPlayerVitalsStorageKey(sessionKey), JSON.stringify(serializePlayerVitalsState(sessionKey, player, regenState)));
}
function createInitialPlayer(selectedCharacter, selectedClass) {
    const initialLevel = 1;
    const initialMaxHp = selectedClass.baseHp +
        (initialLevel - 1) * selectedClass.levelScaling.hpPerLevel;
    return {
        name: selectedCharacter.name,
        totalXp: 0,
        currentHp: initialMaxHp,
        currentSp: selectedClass.baseSp,
        stamina: selectedClass.baseStamina,
        maxStamina: selectedClass.baseStamina,
        activeConditions: [],
        // Every new campaign starts with the same baseline survival kit.
        inventory: [...initialCampaignInventory],
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
function createInitialState(selectedCharacter, selectedClass) {
    const sessionKey = buildSessionKey(selectedCharacter);
    const now = Date.now();
    const fallbackPlayer = createInitialPlayer(selectedCharacter, selectedClass);
    const fallbackRegenState = createInitialPlayerRegenState(now);
    const persistedState = readPersistedPlayerVitals(sessionKey, fallbackPlayer, fallbackRegenState);
    const regenConfig = resolveCharacterRegenConfig(selectedCharacter.classKey);
    const offlineRegenResolution = applyOfflineStaminaRegen({
        ...fallbackPlayer,
        ...persistedState.player,
    }, persistedState.regenState, regenConfig, now);
    return {
        currentLocation: "merchant",
        player: {
            ...fallbackPlayer,
            ...persistedState.player,
            stamina: offlineRegenResolution.nextPlayer.stamina,
        },
        regenState: offlineRegenResolution.nextRegenState,
        sessionKey,
    };
}
export function useCharacterProgression({ selectedCharacter, setEventLogs, }) {
    const selectedClass = useMemo(() => characterClassesData[selectedCharacter.classKey], [selectedCharacter.classKey]);
    const sessionKey = buildSessionKey(selectedCharacter);
    const [state, setState] = useState(() => createInitialState(selectedCharacter, selectedClass));
    const latestPlayerRef = useRef(null);
    const latestRegenStateRef = useRef(null);
    const resolvedState = state.sessionKey === sessionKey
        ? state
        : createInitialState(selectedCharacter, selectedClass);
    const currentLocation = resolvedState.currentLocation;
    const player = resolvedState.player;
    const regenState = resolvedState.regenState;
    const derivedStats = resolveDerivedStats(selectedClass, player.totalXp);
    const computedLevel = derivedStats.level;
    const computedMaxHp = derivedStats.maxHp;
    const computedSp = derivedStats.maxSp;
    const computedCarryWeight = selectedClass.carryWeight;
    const xpProgress = getXpProgressInCurrentLevel(player.totalXp);
    const skills = useMemo(() => buildCharacterSkillSummaries(player.skillProgression), [player.skillProgression]);
    const updateState = (updater) => {
        setState((previousState) => {
            const baseState = previousState.sessionKey === sessionKey
                ? previousState
                : createInitialState(selectedCharacter, selectedClass);
            return updater(baseState);
        });
    };
    const setPlayer = (value) => {
        updateState((currentState) => {
            const nextPlayer = typeof value === "function" ? value(currentState.player) : value;
            return {
                ...currentState,
                player: nextPlayer,
            };
        });
    };
    useEffect(() => {
        latestPlayerRef.current = player;
        latestRegenStateRef.current = regenState;
    }, [player, regenState]);
    useEffect(() => {
        const regenConfig = resolveCharacterRegenConfig(selectedCharacter.classKey);
        const interval = window.setInterval(() => {
            updateState((currentState) => {
                const now = Date.now();
                const currentDerivedStats = resolveDerivedStats(selectedClass, currentState.player.totalXp);
                const onlineRegenResolution = applyOnlineRegen(currentState.player, currentState.regenState, regenConfig, {
                    maxHp: currentDerivedStats.maxHp,
                    maxSp: currentDerivedStats.maxSp,
                    maxStamina: currentDerivedStats.maxStamina,
                }, now);
                if (onlineRegenResolution.summary.hpRecovered === 0 &&
                    onlineRegenResolution.summary.spRecovered === 0 &&
                    onlineRegenResolution.summary.staminaRecovered === 0 &&
                    onlineRegenResolution.nextRegenState.hpAnchorAt === currentState.regenState.hpAnchorAt &&
                    onlineRegenResolution.nextRegenState.spAnchorAt === currentState.regenState.spAnchorAt &&
                    onlineRegenResolution.nextRegenState.staminaAnchorAt ===
                        currentState.regenState.staminaAnchorAt) {
                    return currentState;
                }
                return {
                    ...currentState,
                    player: onlineRegenResolution.nextPlayer,
                    regenState: onlineRegenResolution.nextRegenState,
                };
            });
        }, onlineRegenCheckIntervalMs);
        return () => {
            window.clearInterval(interval);
        };
    }, [selectedCharacter.classKey, selectedClass]);
    useEffect(() => {
        persistPlayerVitals(sessionKey, player, regenState);
    }, [player, regenState, sessionKey]);
    useEffect(() => {
        const handlePersistLastSeen = () => {
            if (!latestPlayerRef.current || !latestRegenStateRef.current) {
                return;
            }
            persistPlayerVitals(sessionKey, latestPlayerRef.current, {
                ...latestRegenStateRef.current,
                lastSeenAt: Date.now(),
            });
        };
        window.addEventListener("pagehide", handlePersistLastSeen);
        window.addEventListener("beforeunload", handlePersistLastSeen);
        return () => {
            handlePersistLastSeen();
            window.removeEventListener("pagehide", handlePersistLastSeen);
            window.removeEventListener("beforeunload", handlePersistLastSeen);
        };
    }, [sessionKey]);
    const recordSkillTraining = (event) => {
        let levelUpMessages = [];
        setPlayer((previousPlayer) => {
            const { nextProgressionState, levelUps } = applySkillTrainingEvent(previousPlayer.skillProgression, event);
            levelUpMessages = levelUps.map((levelUp) => createSystemMessage(`${levelUp.skillName} increased to level ${levelUp.newLevel}.`));
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
    const applyDiscoveryResolutionRewards = (resolution) => {
        setPlayer((previousPlayer) => {
            return applyRewardsToPlayerSnapshot({
                ...previousPlayer,
            }, resolution.rewards);
        });
        setEventLogs((previousLogs) => {
            return [
                ...previousLogs,
                ...createRewardApplicationMessages(player.totalXp, resolution.rewards, resolution.messages),
            ];
        });
    };
    const registerBestiaryKill = (creatureKey, creatureName) => {
        let milestoneMessage = null;
        setPlayer((previousPlayer) => {
            const result = registerCreatureKill(previousPlayer.bestiaryProgress, creatureKey);
            milestoneMessage = getBestiaryMilestoneMessage(creatureName, result.previousTier, result.nextTier);
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
    const spendTalentPoint = (nodeKey, characterLevel = computedLevel) => {
        let wasUnlocked = false;
        setPlayer((previousPlayer) => {
            const nextTalentProgress = unlockTalentNode(previousPlayer.talentProgress, nodeKey, characterLevel);
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
    const selectSkillSpecialization = (skill, nodeKey) => {
        let wasSelected = false;
        setPlayer((previousPlayer) => {
            const nextSpecializationProgress = selectSpecializationNode(previousPlayer.specializationProgress, skill, skillTreesData[skill.key], nodeKey);
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
    const gainCharacterXp = (amount, reason) => {
        if (amount <= 0)
            return;
        setPlayer((previousPlayer) => applyRewardsToPlayerSnapshot(previousPlayer, [
            {
                type: "xp",
                amount,
                reason,
            },
        ]));
        setEventLogs((previousLogs) => [
            ...previousLogs,
            ...createXpGainMessages(player.totalXp, amount, reason),
        ]);
    };
    const applyDamageToPlayer = (damage, reason) => {
        if (damage <= 0)
            return;
        setPlayer((previousPlayer) => applyPlayerDamageState(previousPlayer, damage));
        setEventLogs((previousLogs) => [
            ...previousLogs,
            ...createDamageTakenMessages(damage, reason),
        ]);
    };
    const learnRumor = (rumorKey) => {
        const discovery = resolveRumorDiscovery(rumorKey, player);
        if (!discovery)
            return null;
        setPlayer((previousPlayer) => {
            return applyRumorDiscoveryState(previousPlayer, rumorKey, discovery.revealedPoiKeys);
        });
        applyDiscoveryResolutionRewards(discovery.resolution);
        recordSkillTraining({
            type: "npc.rumor.learned",
            rumorKey,
        });
        return discovery.resolution;
    };
    const discoverPoi = (poiKey) => {
        const discovery = resolvePoiDiscovery(poiKey, player);
        if (!discovery)
            return null;
        setPlayer((previousPlayer) => {
            return applyPoiDiscoveryState(previousPlayer, poiKey, discovery.locationKey);
        });
        applyDiscoveryResolutionRewards(discovery.resolution);
        recordSkillTraining({
            type: "world.discovery.poi",
            poiKey,
        });
        return discovery.resolution;
    };
    const handleTravel = (nextLocation) => {
        updateState((currentState) => ({
            ...currentState,
            currentLocation: nextLocation,
        }));
        const resolution = resolveLocationDiscovery(nextLocation, player);
        if (!resolution) {
            return null;
        }
        setPlayer((previousPlayer) => applyLocationDiscoveryState(previousPlayer, nextLocation));
        applyDiscoveryResolutionRewards(resolution);
        recordSkillTraining({
            type: "world.discovery.location",
            locationKey: nextLocation,
        });
        return resolution;
    };
    const gainLoreDiscoveryXp = (loreKey) => {
        if (player.discoveredLore.includes(loreKey))
            return;
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
                ...createLoreDiscoveryMessages(player.totalXp, loreDiscovery.discoveryMessage, loreDiscovery.xpReward, loreDiscovery.xpReason),
            ];
        });
    };
    const tryTriggerLoreDiscovery = (action) => {
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
            currentSp: Math.min(player.currentSp, computedSp),
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
