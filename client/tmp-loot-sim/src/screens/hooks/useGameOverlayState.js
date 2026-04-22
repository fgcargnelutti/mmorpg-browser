import { useRef, useState } from "react";
function createEncounterState({ instanceId, encounterKey, }) {
    return {
        instanceId,
        key: encounterKey,
    };
}
export function useGameOverlayState() {
    const encounterInstanceCounterRef = useRef(0);
    const [contextState, setContextState] = useState("hidden");
    const [npcDialogOpen, setNpcDialogOpen] = useState(false);
    const [activeNpcProfileKey, setActiveNpcProfileKey] = useState("jane");
    const [npcDialogueLines, setNpcDialogueLines] = useState([]);
    const [activeEncounter, setActiveEncounter] = useState(null);
    const [activeFishingSession, setActiveFishingSession] = useState(null);
    const [activeMiningSession, setActiveMiningSession] = useState(null);
    const [bestiaryDialogOpen, setBestiaryDialogOpen] = useState(false);
    const [skillTreeDialogOpen, setSkillTreeDialogOpen] = useState(false);
    const [hideoutDialogOpen, setHideoutDialogOpen] = useState(false);
    const [questLogDialogOpen, setQuestLogDialogOpen] = useState(false);
    const [worldMapDialogOpen, setWorldMapDialogOpen] = useState(false);
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
        setWorldMapDialogOpen(false);
    };
    const openNpcDialog = ({ profileKey, dialogueLines }) => {
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
    const openEncounter = ({ encounterKey }) => {
        closeSideDialogs();
        closeWorldActivityOverlays();
        setContextState("hidden");
        encounterInstanceCounterRef.current += 1;
        setActiveEncounter(createEncounterState({
            instanceId: encounterInstanceCounterRef.current,
            encounterKey,
        }));
    };
    const openFishingSession = ({ action, configKey, }) => {
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
    const openMiningSession = ({ action, configKey, }) => {
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
    const openWorldMapDialog = () => {
        closeSideDialogs();
        closeWorldActivityOverlays();
        setContextState("hidden");
        setWorldMapDialogOpen(true);
    };
    const closeWorldMapDialog = () => {
        setWorldMapDialogOpen(false);
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
        worldMapDialogOpen,
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
        openWorldMapDialog,
        closeWorldMapDialog,
    };
}
