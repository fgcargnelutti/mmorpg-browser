import { useState } from "react";
import type { EncounterKey } from "../../data/encountersData";
import type { FishingSpotKey } from "../../features/fishing";
import type { MiningSpotKey } from "../../features/mining";
import type { ContextAction, NpcProfileKey } from "../../features/world";

export type GameContextState = "hidden" | "expanded" | "minimized";

export type ActiveEncounter = {
  key: EncounterKey;
  enemyHp: number;
  combatLog: string[];
  isResolved: boolean;
  resolution: "victory" | "defeat" | null;
};

export type ActiveFishingSession = {
  action: ContextAction;
  configKey: FishingSpotKey;
};

export type ActiveMiningSession = {
  action: ContextAction;
  configKey: MiningSpotKey;
};

type OpenEncounterParams = {
  encounterKey: EncounterKey;
  enemyHp: number;
  introText: string;
};

type OpenNpcDialogParams = {
  profileKey: NpcProfileKey;
  dialogueLines: string[];
};

type OpenActivitySessionParams<TConfigKey> = {
  action: ContextAction;
  configKey: TConfigKey;
};

function createEncounterState({
  encounterKey,
  enemyHp,
  introText,
}: OpenEncounterParams): ActiveEncounter {
  return {
    key: encounterKey,
    enemyHp,
    combatLog: [introText],
    isResolved: false,
    resolution: null,
  };
}

export function useGameOverlayState() {
  const [contextState, setContextState] = useState<GameContextState>("hidden");
  const [npcDialogOpen, setNpcDialogOpen] = useState(false);
  const [activeNpcProfileKey, setActiveNpcProfileKey] =
    useState<NpcProfileKey>("jane");
  const [npcDialogueLines, setNpcDialogueLines] = useState<string[]>([]);
  const [activeEncounter, setActiveEncounter] = useState<ActiveEncounter | null>(
    null
  );
  const [activeFishingSession, setActiveFishingSession] =
    useState<ActiveFishingSession | null>(null);
  const [activeMiningSession, setActiveMiningSession] =
    useState<ActiveMiningSession | null>(null);
  const [bestiaryDialogOpen, setBestiaryDialogOpen] = useState(false);
  const [skillTreeDialogOpen, setSkillTreeDialogOpen] = useState(false);
  const [hideoutDialogOpen, setHideoutDialogOpen] = useState(false);
  const [questLogDialogOpen, setQuestLogDialogOpen] = useState(false);

  const closeSideDialogs = () => {
    setBestiaryDialogOpen(false);
    setSkillTreeDialogOpen(false);
    setHideoutDialogOpen(false);
    setQuestLogDialogOpen(false);
  };

  const closeWorldActivityOverlays = () => {
    setNpcDialogOpen(false);
    setActiveEncounter(null);
    setActiveFishingSession(null);
    setActiveMiningSession(null);
  };

  const openNpcDialog = ({ profileKey, dialogueLines }: OpenNpcDialogParams) => {
    closeSideDialogs();
    closeWorldActivityOverlays();
    setContextState("hidden");
    setActiveNpcProfileKey(profileKey);
    setNpcDialogueLines(dialogueLines);
    setNpcDialogOpen(true);
  };

  const closeNpcDialog = () => {
    setNpcDialogOpen(false);
    setContextState("expanded");
  };

  const openEncounter = ({
    encounterKey,
    enemyHp,
    introText,
  }: OpenEncounterParams) => {
    closeSideDialogs();
    closeWorldActivityOverlays();
    setContextState("hidden");
    setActiveEncounter(
      createEncounterState({
        encounterKey,
        enemyHp,
        introText,
      })
    );
  };

  const openFishingSession = ({
    action,
    configKey,
  }: OpenActivitySessionParams<FishingSpotKey>) => {
    closeSideDialogs();
    closeWorldActivityOverlays();
    setContextState("hidden");
    setActiveFishingSession({
      action,
      configKey,
    });
  };

  const closeFishingSession = () => {
    setActiveFishingSession(null);
    setContextState("expanded");
  };

  const openMiningSession = ({
    action,
    configKey,
  }: OpenActivitySessionParams<MiningSpotKey>) => {
    closeSideDialogs();
    closeWorldActivityOverlays();
    setContextState("hidden");
    setActiveMiningSession({
      action,
      configKey,
    });
  };

  const closeMiningSession = () => {
    setActiveMiningSession(null);
    setContextState("expanded");
  };

  const openHideoutDialog = () => {
    closeSideDialogs();
    closeWorldActivityOverlays();
    setContextState("hidden");
    setHideoutDialogOpen(true);
  };

  const closeHideoutDialog = () => {
    setHideoutDialogOpen(false);
    setContextState("expanded");
  };

  const openBestiaryDialog = () => {
    closeSideDialogs();
    closeWorldActivityOverlays();
    setContextState("hidden");
    setBestiaryDialogOpen(true);
  };

  const closeBestiaryDialog = () => {
    setBestiaryDialogOpen(false);
    setContextState("expanded");
  };

  const openSkillTreeDialog = () => {
    closeSideDialogs();
    closeWorldActivityOverlays();
    setContextState("hidden");
    setSkillTreeDialogOpen(true);
  };

  const closeSkillTreeDialog = () => {
    setSkillTreeDialogOpen(false);
    setContextState("expanded");
  };

  const openQuestLogDialog = () => {
    closeSideDialogs();
    closeWorldActivityOverlays();
    setContextState("hidden");
    setQuestLogDialogOpen(true);
  };

  const closeQuestLogDialog = () => {
    setQuestLogDialogOpen(false);
    setContextState("expanded");
  };

  return {
    contextState,
    setContextState,
    npcDialogOpen,
    activeNpcProfileKey,
    npcDialogueLines,
    setNpcDialogueLines,
    activeEncounter,
    setActiveEncounter,
    activeFishingSession,
    activeMiningSession,
    bestiaryDialogOpen,
    skillTreeDialogOpen,
    hideoutDialogOpen,
    questLogDialogOpen,
    closeSideDialogs,
    closeWorldActivityOverlays,
    openNpcDialog,
    closeNpcDialog,
    openEncounter,
    openFishingSession,
    closeFishingSession,
    openMiningSession,
    closeMiningSession,
    openHideoutDialog,
    closeHideoutDialog,
    openBestiaryDialog,
    closeBestiaryDialog,
    openSkillTreeDialog,
    closeSkillTreeDialog,
    openQuestLogDialog,
    closeQuestLogDialog,
  };
}
