import { useMemo } from "react";
import { getVisibleBestiaryEntries } from "../selectors/getVisibleBestiaryEntry";
import type { PlayerBestiaryProgressState } from "../../domain/bestiaryTypes";

type UseBestiaryParams = {
  progress: PlayerBestiaryProgressState;
};

export function useBestiary({ progress }: UseBestiaryParams) {
  const entries = useMemo(() => getVisibleBestiaryEntries(progress), [progress]);

  return {
    entries,
    hasEntries: entries.length > 0,
  };
}
