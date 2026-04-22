import { useEffect } from "react";
import { combatInputBindings } from "../../domain/combatActionCatalog";
export function useCombatHotkeys({ enabled, onAction, }) {
    useEffect(() => {
        if (!enabled) {
            return;
        }
        const handleKeyDown = (event) => {
            const target = event.target;
            const tagName = target?.tagName?.toLowerCase();
            if (tagName === "input" ||
                tagName === "textarea" ||
                target?.isContentEditable) {
                return;
            }
            const normalizedKey = event.key === " " ? " " : event.key.toLowerCase();
            const binding = combatInputBindings.find((entry) => entry.key === normalizedKey);
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
