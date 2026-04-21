import { useEffect } from "react";
import type { CombatActionId } from "../../domain/combatEngineTypes";
import { combatInputBindings } from "../../domain/combatActionCatalog";

type UseCombatHotkeysParams = {
  enabled: boolean;
  onAction: (actionId: CombatActionId) => void;
};

export function useCombatHotkeys({
  enabled,
  onAction,
}: UseCombatHotkeysParams) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();

      if (
        tagName === "input" ||
        tagName === "textarea" ||
        target?.isContentEditable
      ) {
        return;
      }

      const normalizedKey =
        event.key === " " ? " " : event.key.toLowerCase();
      const binding = combatInputBindings.find(
        (entry) => entry.key === normalizedKey
      );

      if (!binding) {
        return;
      }

      event.preventDefault();
      onAction(binding.actionId);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onAction]);
}
