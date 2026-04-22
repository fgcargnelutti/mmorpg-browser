import { getCreatureSpeciesMasterData } from "../../infrastructure/creatureSpeciesMasterDataAdapter";
export function getCreatureSpeciesSnapshot(speciesId) {
    const species = getCreatureSpeciesMasterData(speciesId);
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
