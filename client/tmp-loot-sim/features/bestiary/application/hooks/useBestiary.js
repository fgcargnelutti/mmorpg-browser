import { useMemo } from "react";
import { getVisibleBestiaryEntries } from "../selectors/getVisibleBestiaryEntry";
export function useBestiary({ progress }) {
    const entries = useMemo(() => getVisibleBestiaryEntries(progress), [progress]);
    return {
        entries,
        hasEntries: entries.length > 0,
    };
}
