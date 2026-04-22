"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreatureSpeciesSnapshot = getCreatureSpeciesSnapshot;
const creatureSpeciesMasterDataAdapter_1 = require("../../infrastructure/creatureSpeciesMasterDataAdapter");
function getCreatureSpeciesSnapshot(speciesId) {
    const species = (0, creatureSpeciesMasterDataAdapter_1.getCreatureSpeciesMasterData)(speciesId);
    if (!species) {
        return null;
    }
    return {
        id: species.id,
        name: species.name,
        category: species.category,
        threatTier: species.threatTier,
        habitatTags: species.habitatTags,
        isBossCandidate: species.isBossCandidate,
        maxHp: species.baseStats.maxHp,
        maxSp: species.baseStats.maxSp,
        combatDefaults: species.combatDefaults,
        weaknesses: species.traits.weaknesses,
        resistances: species.traits.resistances,
        strengths: species.traits.strengths,
        attacks: species.attacks,
        notes: species.loreNotes,
    };
}
