import { useState } from "react";
import "./CharacterFlow.css";
import "./CharacterCreationScreen.css";
import type { CharacterClassKey } from "../data/characterClassesData";
import { characterClassesData } from "../data/characterClassesData";
import type { CharacterSummary } from "./CharacterSelectScreen";

type CharacterCreationScreenProps = {
  username: string;
  onBack: () => void;
  onCreateCharacter: (character: CharacterSummary) => void;
};

const availableClassKeys: CharacterClassKey[] = [
  "wasteland-warrior",
  "arcanist",
  "thief",
];

export default function CharacterCreationScreen({
  username,
  onBack,
  onCreateCharacter,
}: CharacterCreationScreenProps) {
  const [characterName, setCharacterName] = useState("");
  const [selectedClassKey, setSelectedClassKey] =
    useState<CharacterClassKey>("wasteland-warrior");

  const selectedClass = characterClassesData[selectedClassKey];
  const trimmedName = characterName.trim();
  const isValidName = trimmedName.length >= 3;

  const handleSubmit = () => {
    if (!isValidName) return;

    const newCharacter: CharacterSummary = {
      id: `char-${Date.now()}`,
      name: trimmedName,
      classKey: selectedClassKey,
      level: 1,
    };

    onCreateCharacter(newCharacter);
  };

  return (
    <main className="character-flow-screen character-creation-screen">
      <div className="character-flow-backdrop" />
      <div className="character-flow-overlay" />
      <div className="character-flow-vignette" />

      <section className="character-flow-shell character-creation-shell">
        <aside className="character-flow-hero">
          <div className="character-flow-hero__eyebrow">New Survivor</div>
          <div className="character-flow-hero__title-block">
            <h1>Create Character</h1>
            <p>Forge a new survivor, {username}, and prepare them for the frontier.</p>
          </div>

          <div className="character-flow-hero__copy">
            <p className="character-flow-hero__line">
              Choose a class, shape the first role in your roster, and establish
              the baseline for future progression, quests, and specialization.
            </p>
            <p className="character-flow-hero__line">
              This screen now favors clarity and class identity first, while staying
              ready for portraits, origins, and richer onboarding later.
            </p>
          </div>

          <div className="character-flow-status-row">
            <span className="character-flow-status-pill">
              <span className="character-flow-status-pill__dot" />
              Starting level 1
            </span>
            <span className="character-flow-status-pill">
              Base stamina {selectedClass.baseStamina}
            </span>
          </div>

          <div className="character-flow-hero-card">
            <span className="character-flow-hero-card__label">Class Snapshot</span>
            <strong>{selectedClass.name}</strong>
            <p>{selectedClass.title}</p>
            <div className="character-flow-inline-stats">
              <span>HP {selectedClass.baseHp}</span>
              <span>SP {selectedClass.baseSp}</span>
              <span>Carry {selectedClass.carryWeight}kg</span>
            </div>
          </div>
        </aside>

        <section className="character-flow-panel">
          <div className="character-flow-panel__header character-creation-header">
            <div>
              <h2>Survivor Setup</h2>
              <p>Define a name and class before sending a new character into the world.</p>
            </div>

            <button
              type="button"
              className="character-flow-button character-flow-button--secondary"
              onClick={onBack}
            >
              Back
            </button>
          </div>

          <div className="character-creation-body">
            <section className="character-creation-form-panel">
              <div className="character-creation-field">
                <label htmlFor="character-name">Character Name</label>
                <input
                  id="character-name"
                  type="text"
                  value={characterName}
                  onChange={(event) => setCharacterName(event.target.value)}
                  placeholder="Enter a name"
                  maxLength={20}
                />
                <small>Name must have at least 3 characters.</small>
              </div>

              <div className="character-creation-field">
                <label>Choose a Class</label>

                <div className="character-class-option-list">
                  {availableClassKeys.map((classKey) => {
                    const characterClass = characterClassesData[classKey];
                    const isSelected = classKey === selectedClassKey;

                    return (
                      <button
                        key={classKey}
                        type="button"
                        className={`character-class-option ${
                          isSelected ? "is-selected" : ""
                        }`}
                        onClick={() => setSelectedClassKey(classKey)}
                      >
                        <strong>{characterClass.name}</strong>
                        <span>{characterClass.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <aside className="character-creation-preview-panel character-flow-scroll-panel">
              <div className="character-creation-preview-header">
                <strong>{trimmedName || "Unnamed Survivor"}</strong>
                <span>{selectedClass.name} • Level 1</span>
              </div>

              <div className="character-creation-preview-section">
                <h2>{selectedClass.title}</h2>
                <p>{selectedClass.description}</p>
              </div>

              <div className="character-creation-preview-section">
                <h3>Base Stats</h3>

                <div className="character-creation-stats-grid">
                  <div className="character-creation-stat-card character-flow-stat-card">
                    <small>HP</small>
                    <strong>{selectedClass.baseHp}</strong>
                  </div>

                  <div className="character-creation-stat-card character-flow-stat-card">
                    <small>SP</small>
                    <strong>{selectedClass.baseSp}</strong>
                  </div>

                  <div className="character-creation-stat-card character-flow-stat-card">
                    <small>Stamina</small>
                    <strong>{selectedClass.baseStamina}</strong>
                  </div>

                  <div className="character-creation-stat-card character-flow-stat-card">
                    <small>Carry Weight</small>
                    <strong>{selectedClass.carryWeight} kg</strong>
                  </div>
                </div>
              </div>

              <div className="character-creation-preview-section">
                <h3>Traits</h3>
                <ul className="character-creation-traits-list">
                  {selectedClass.traits.map((trait) => (
                    <li key={trait}>{trait}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <div className="character-flow-panel__footer character-creation-footer">
            <div className="character-flow-summary">
              <strong>Ready to enter the wasteland?</strong>
              <span>
                Choose a name and class. New characters start at level 1.
              </span>
            </div>

            <button
              type="button"
              className="character-flow-button character-flow-button--primary"
              disabled={!isValidName}
              onClick={handleSubmit}
            >
              Create Character
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
