# Asset Structure

This folder is the single source of truth for front-end visual assets used by the game.

## Naming convention

- Use `kebab-case` for file and folder names.
- Prefer plural folder names for categories.
- Keep filenames semantic and gameplay-oriented, not UI-oriented.
- Use stable IDs where possible, so future backend/content tooling can reference the same asset names.

## Folder guide

- `world/`
  - `maps/`: playable map backgrounds, world map art, underground maps.
  - `overlays/`: map atmosphere layers, fog, dust, light masks, regional ambiance.
- `items/`
  - `icons/`: item icons for resources, weapons, armor, potions, quest items.
- `sprites/`
  - `creatures/`: enemy and wildlife sprites.
  - `bosses/`: large encounter-specific sprites.
  - `npcs/`: NPC sprites used in maps or gameplay views.
  - `companions/`: companion sprites and future stance variants.
  - `effects/`: gameplay VFX sprites and animated sheets.
- `npcs/`
  - `portraits/`: dialogue portraits and UI-facing NPC imagery.
- `art/`
  - `illustrations/`: splash art, hero art, support illustrations.
  - `banners/`: promotional or special screen art.
- `ui/`
  - `brand/`: legacy app/demo brand assets and non-game visual defaults.
  - `icons/`: system icons not tied to items.
  - `cursors/`: custom cursor assets.
  - `frames/`: decorative frames, borders, panel ornaments.
  - `overlays/`: UI-exclusive surface effects, masks, and ambient layers.

## Placement rules

- If an asset belongs to gameplay content, prefer the gameplay category over generic `art/`.
- If an asset is a portrait used by dialogue/UI, keep it in `npcs/portraits/`, even if the same NPC later gets a gameplay sprite.
- If an asset is temporary or placeholder, keep it in the correct category and mark it in the filename or nearby documentation, instead of creating a generic `misc` folder.
- Avoid storing production assets in `public/` unless they must be served by absolute URL.

## Import rules

- Feature code should import from the relevant asset category, not from ad-hoc relative paths to random files.
- When a category becomes reused across multiple features, add a small local `index.ts` export file inside that category instead of creating one giant global asset registry.
