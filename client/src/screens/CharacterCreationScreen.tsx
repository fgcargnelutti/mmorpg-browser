import { useState } from "react";
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
    <main className="character-creation-screen">
      <div className="character-creation-overlay" />

      <section className="character-creation-panel">
        <div className="character-creation-header">
          <div>
            <h1>Create Character</h1>
            <p>Forge a new survivor, {username}</p>
          </div>

          <button
            type="button"
            className="character-creation-back-button"
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

          <aside className="character-creation-preview-panel">
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
                <div className="character-creation-stat-card">
                  <small>HP</small>
                  <strong>{selectedClass.baseHp}</strong>
                </div>

                <div className="character-creation-stat-card">
                  <small>SP</small>
                  <strong>{selectedClass.baseSp}</strong>
                </div>

                <div className="character-creation-stat-card">
                  <small>Stamina</small>
                  <strong>{selectedClass.baseStamina}</strong>
                </div>

                <div className="character-creation-stat-card">
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

        <div className="character-creation-footer">
          <div className="character-creation-summary">
            <strong>Ready to enter the wasteland?</strong>
            <span>
              Choose a name and class. New characters start at level 1.
            </span>
          </div>

          <button
            type="button"
            className="character-creation-submit-button"
            disabled={!isValidName}
            onClick={handleSubmit}
          >
            Create Character
          </button>
        </div>
      </section>
    </main>
  );
}