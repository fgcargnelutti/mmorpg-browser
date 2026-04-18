export type CreatureKnowledgeTier =
  | "unknown"
  | "known"
  | "vitals"
  | "common-drops"
  | "complete";

export type CreatureCategory =
  | "humanoid"
  | "beast"
  | "aberration"
  | "giant"
  | "draconic"
  | "boss";

export type CreatureThreatTier =
  | "common"
  | "dangerous"
  | "elite"
  | "boss";

export type CreatureHabitatTag =
  | "town"
  | "sewer"
  | "forest"
  | "swamp"
  | "rural"
  | "underground"
  | "ruins"
  | "road";

export type CreatureBestiaryKey =
  | "goblin"
  | "orc"
  | "minotaur"
  | "dragon"
  | "thief"
  | "yienkh"
  | "ogre"
  | "troll";

export type CreatureDropGroup = {
  itemKey: string;
  label: string;
  rarity: CreatureDropRateTier;
  dropChancePercent?: number;
};

export type CreatureDropRateTier =
  | "common"
  | "uncommon"
  | "rare"
  | "ultra-rare";

export type CreatureAttackDescriptor = {
  key: string;
  label: string;
  description: string;
};

export type CreatureBestiaryData = {
  key: CreatureBestiaryKey;
  name: string;
  category: CreatureCategory;
  threatTier: CreatureThreatTier;
  habitatTags: CreatureHabitatTag[];
  isBossCandidate: boolean;
  maxHp: number;
  maxSp: number;
  drops: CreatureDropGroup[];
  weaknesses: string[];
  resistances: string[];
  strengths: string[];
  attacks: CreatureAttackDescriptor[];
  notes: string[];
};

export type BestiaryThresholdDefinition = {
  killCount: number;
  tier: CreatureKnowledgeTier;
};

export type PlayerBestiaryEntryState = {
  creatureKey: CreatureBestiaryKey;
  killCount: number;
  unlockedTier: CreatureKnowledgeTier;
};

export type PlayerBestiaryProgressState = Partial<
  Record<CreatureBestiaryKey, PlayerBestiaryEntryState | undefined>
>;

export type VisibleBestiaryEntry = {
  creatureKey: CreatureBestiaryKey;
  killCount: number;
  unlockedTier: CreatureKnowledgeTier;
  name: string;
  category: CreatureCategory;
  threatTier: CreatureThreatTier;
  habitatTags: CreatureHabitatTag[];
  isBossCandidate: boolean;
  maxHp?: number;
  maxSp?: number;
  drops?: CreatureDropGroup[];
  weaknesses?: string[];
  resistances?: string[];
  strengths?: string[];
  attacks?: CreatureAttackDescriptor[];
  notes?: string[];
};

export type BestiaryKillRegistrationResult = {
  nextState: PlayerBestiaryProgressState;
  entry: PlayerBestiaryEntryState;
  previousTier: CreatureKnowledgeTier;
  nextTier: CreatureKnowledgeTier;
  isNewEntry: boolean;
};

export type PersistedBestiaryEntryRecord = {
  creatureKey: string;
  killCount: number;
  unlockedTier: CreatureKnowledgeTier;
};

export type PersistedBestiaryProgressPayload = {
  version: 1;
  entries: PersistedBestiaryEntryRecord[];
};
