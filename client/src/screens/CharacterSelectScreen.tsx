import { useMemo, useState } from "react";
import "./CharacterSelectScreen.css";
import {
  characterClassesData,
  type CharacterClassKey,
} from "../data/characterClassesData";

export type CharacterSummary = {
  id: string;
  name: string;
  classKey: CharacterClassKey;
  level: number;
};

type CharacterSelectScreenProps = {
  username: string;
  characters: CharacterSummary[];
  onEnterWorld: (character: CharacterSummary) => void;
  onCreateNewCharacter: () => void;
};

export default function CharacterSelectScreen({
  username,
  characters,
  onEnterWorld,
  onCreateNewCharacter,
}: CharacterSelectScreenProps) {
  const initialSelectedId = useMemo(
    () => characters[0]?.id ?? null,
    [characters]
  );

  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    initialSelectedId
  );

  const selectedCharacter =
    characters.find((character) => character.id === selectedCharacterId) ?? null;

  const selectedClass = selectedCharacter
    ? characterClassesData[selectedCharacter.classKey]
    : null;

  return (
    <main className="character-select-screen">
      <div className="character-select-overlay" />

      <section className="character-select-panel">
        <div className="character-select-header">
          <div>
            <h1>Character Selection</h1>
            <p>Welcome back, {username}</p>
          </div>

          <button
            type="button"
            className="character-select-new-button"
            onClick={onCreateNewCharacter}
          >
            New Character
          </button>
        </div>

        <div className="character-select-body">
          <div className="character-select-list">
            {characters.length === 0 ? (
              <div className="character-empty-state">
                <strong>No characters found</strong>
                <span>Create your first character to enter the world.</span>
              </div>
            ) : (
              characters.map((character) => {
                const isSelected = character.id === selectedCharacterId;
                const characterClass = characterClassesData[character.classKey];

                return (
                  <button
                    key={character.id}
                    type="button"
                    className={`character-card ${isSelected ? "is-selected" : ""}`}
                    onClick={() => setSelectedCharacterId(character.id)}
                  >
                    <div className="character-card-portrait">
                      <span>Portrait</span>
                    </div>

                    <div className="character-card-content">
                      <strong>{character.name}</strong>
                      <span>{characterClass.name}</span>
                      <small>Level {character.level}</small>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <aside className="character-class-preview">
            {selectedCharacter && selectedClass ? (
              <>
                <div className="character-class-preview-header">
                  <strong>{selectedCharacter.name}</strong>
                  <span>
                    {selectedClass.name} • Level {selectedCharacter.level}
                  </span>
                </div>

                <div className="character-class-preview-section">
                  <h2>{selectedClass.title}</h2>
                  <p>{selectedClass.description}</p>
                </div>

                <div className="character-class-preview-section">
                  <h3>Base Stats</h3>

                  <div className="character-class-stats-grid">
                    <div className="character-class-stat-card">
                      <small>HP</small>
                      <strong>{selectedClass.baseHp}</strong>
                    </div>

                    <div className="character-class-stat-card">
                      <small>SP</small>
                      <strong>{selectedClass.baseSp}</strong>
                    </div>

                    <div className="character-class-stat-card">
                      <small>Stamina</small>
                      <strong>{selectedClass.baseStamina}</strong>
                    </div>

                    <div className="character-class-stat-card">
                      <small>Carry Weight</small>
                      <strong>{selectedClass.carryWeight} kg</strong>
                    </div>
                  </div>
                </div>

                <div className="character-class-preview-section">
                  <h3>Traits</h3>

                  <ul className="character-class-traits-list">
                    {selectedClass.traits.map((trait) => (
                      <li key={trait}>{trait}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="character-empty-state">
                <strong>No character selected</strong>
                <span>Select a character to preview its class details.</span>
              </div>
            )}
          </aside>
        </div>

        <div className="character-select-footer">
          <div className="character-select-summary">
            {selectedCharacter && selectedClass ? (
              <>
                <strong>{selectedCharacter.name}</strong>
                <span>
                  {selectedClass.name} • Level {selectedCharacter.level}
                </span>
              </>
            ) : (
              <>
                <strong>No character selected</strong>
                <span>Select a character to enter the world.</span>
              </>
            )}
          </div>

          <button
            type="button"
            className="character-select-enter-button"
            disabled={!selectedCharacter}
            onClick={() => {
              if (!selectedCharacter) return;
              onEnterWorld(selectedCharacter);
            }}
          >
            Enter World
          </button>
        </div>
      </section>
    </main>
  );
}