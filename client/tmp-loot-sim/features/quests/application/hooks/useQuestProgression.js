import { useMemo, useState } from "react";
import { activateQuest, applyQuestProgressEvent, applyQuestProgressEvents, claimQuestRewards, createInitialQuestProgressState, } from "../systems/questProgressionSystem";
export function useQuestProgression({ quests, initialProgressStates, }) {
    const [progressStates, setProgressStates] = useState(initialProgressStates ??
        quests.map((quest) => createInitialQuestProgressState(quest)));
    const questByKey = useMemo(() => new Map(quests.map((quest) => [quest.key, quest])), [quests]);
    const activateQuestByKey = (questKey) => {
        const quest = questByKey.get(questKey);
        let didActivate = false;
        if (!quest)
            return didActivate;
        setProgressStates((previousStates) => previousStates.map((progressState) => progressState.questKey === questKey
            ? (() => {
                const nextState = activateQuest(quest, progressState);
                didActivate ||= nextState !== progressState;
                return nextState;
            })()
            : progressState));
        return didActivate;
    };
    const applyEvent = (event) => {
        const updates = [];
        setProgressStates((previousStates) => previousStates.map((progressState) => {
            const quest = questByKey.get(progressState.questKey);
            if (!quest)
                return progressState;
            const nextState = applyQuestProgressEvent(quest, progressState, event);
            if (nextState !== progressState) {
                updates.push({
                    questKey: progressState.questKey,
                    previousState: progressState.state,
                    nextState: nextState.state,
                });
            }
            return nextState;
        }));
        return updates;
    };
    const applyEvents = (events) => {
        if (events.length === 0) {
            return [];
        }
        const updates = [];
        setProgressStates((previousStates) => previousStates.map((progressState) => {
            const quest = questByKey.get(progressState.questKey);
            if (!quest)
                return progressState;
            const nextState = applyQuestProgressEvents(quest, progressState, events);
            if (nextState !== progressState) {
                updates.push({
                    questKey: progressState.questKey,
                    previousState: progressState.state,
                    nextState: nextState.state,
                });
            }
            return nextState;
        }));
        return updates;
    };
    const claimQuestRewardsByKey = (questKey) => {
        let didClaim = false;
        setProgressStates((previousStates) => previousStates.map((progressState) => {
            if (progressState.questKey !== questKey) {
                return progressState;
            }
            const nextState = claimQuestRewards(progressState);
            didClaim ||= nextState !== progressState;
            return nextState;
        }));
        return didClaim;
    };
    return {
        progressStates,
        activateQuestByKey,
        applyEvent,
        applyEvents,
        claimQuestRewardsByKey,
    };
}
