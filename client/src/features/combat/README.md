# Combat Feature

Feature reserved for concentrating combat, encounter state, turn rules, and future integrations.

## Suggested structure

- `presentation`: combat HUD, dialogs, and visual feedback
- `application`: combat flow hooks and action resolution
- `domain`: types, rules, damage tables, enemies, and contracts
- `infrastructure`: backend adapters, persistence, and future synchronization

## Backend seam notes

- Local loot resolution currently exists for the frontend prototype.
- Future authoritative loot claims should preserve one normalized reward payload for UI consumers.
- See `.github/LOOT_BACKEND_MIGRATION.md` for the current migration guidance.
