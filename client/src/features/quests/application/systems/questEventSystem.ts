import type { DiscoveryResolution } from "../../../systems/domain/discoveryOutcomeTypes";
import type { QuestProgressEvent } from "./questProgressionSystem";

export function createQuestEventsFromDiscoveryResolution(
  resolution: DiscoveryResolution
): QuestProgressEvent[] {
  return [
    ...resolution.revealedPoiKeys.map(
      (poiKey): QuestProgressEvent => ({
        type: "reveal_poi",
        poiKey,
      })
    ),
    ...resolution.discoveredPoiKeys.map(
      (poiKey): QuestProgressEvent => ({
        type: "poi",
        poiKey,
      })
    ),
    ...resolution.discoveredLocationKeys.map(
      (locationKey): QuestProgressEvent => ({
        type: "poi",
        poiKey: locationKey,
      })
    ),
  ];
}

export function mergeQuestProgressEvents(
  ...eventGroups: QuestProgressEvent[][]
): QuestProgressEvent[] {
  const merged = eventGroups.flat();
  const deduped = new Map<string, QuestProgressEvent>();

  for (const event of merged) {
    deduped.set(JSON.stringify(event), event);
  }

  return Array.from(deduped.values());
}
