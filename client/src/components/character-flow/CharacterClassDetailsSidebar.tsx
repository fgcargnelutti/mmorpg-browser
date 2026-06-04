import type {
  CharacterClassData,
  LearnByDoingRates,
} from "../../data/characterClassesData";
import {
  buildPrefixedClassName,
  formatSkillLevel,
  skillLabels,
} from "./characterRosterShared";

type CharacterClassDetailsSidebarProps = {
  prefix: string;
  name: string;
  classNameLabel: string;
  level: number;
  characterClass: CharacterClassData;
};

export default function CharacterClassDetailsSidebar({
  prefix,
  name,
  classNameLabel,
  level,
  characterClass,
}: CharacterClassDetailsSidebarProps) {
  return (
    <aside className={`${buildPrefixedClassName(prefix, "sidebar")} game-card`}>
      <div className={`${buildPrefixedClassName(prefix, "identity")} game-card`}>
        <strong>{name}</strong>
        <span>
          {classNameLabel} / Level {level}
        </span>
      </div>

      <section className={`${buildPrefixedClassName(prefix, "section")} game-card`}>
        <h2>{characterClass.title}</h2>
        <p>{characterClass.description}</p>
      </section>

      <section className={`${buildPrefixedClassName(prefix, "section")} game-card`}>
        <h3>Traits</h3>
        <ul className={buildPrefixedClassName(prefix, "listing")}>
          {characterClass.traits.slice(0, 4).map((trait) => (
            <li key={trait}>{trait}</li>
          ))}
        </ul>
      </section>

      <section className={`${buildPrefixedClassName(prefix, "section")} game-card`}>
        <h3>Skill Levels</h3>
        <div className={buildPrefixedClassName(prefix, "skills")}>
          {Object.entries(characterClass.learnByDoingRates).map(
            ([skillKey, rate]) => (
              <div
                key={skillKey}
                className={buildPrefixedClassName(prefix, "skill-row")}
              >
                <span>{skillLabels[skillKey as keyof LearnByDoingRates]}</span>
                <strong>{formatSkillLevel(rate)}</strong>
              </div>
            )
          )}
        </div>
      </section>
    </aside>
  );
}
