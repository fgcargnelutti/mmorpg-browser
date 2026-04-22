import goblinCreatureImage from "../../../assets/sprites/creatures/goblin-creature.png";
import type { CreatureBestiaryKey } from "../../bestiary/domain/bestiaryTypes";

export type CreatureVisualDefinition = {
  portraitImageSrc?: string;
};

export const creatureVisualData: Partial<
  Record<CreatureBestiaryKey, CreatureVisualDefinition>
> = {
  goblin: {
    portraitImageSrc: goblinCreatureImage,
  },
};
