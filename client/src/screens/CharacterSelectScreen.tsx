import { useMemo, useState } from "react";
import "./CharacterFlow.css";
import "./CharacterSelectScreen.css";
import {
  characterClassesData,
  type CharacterClassKey,
} from "../data/characterClassesData";
import { resolveCharacterAvatarByClassKey } from "../data/characterAvatarCatalog";
import CharacterAvatar from "../components/CharacterAvatar";

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
  const selectedAvatar = selectedCharacter
    ? resolveCharacterAvatarByClassKey(selectedCharacter.classKey)
    : null;

  return (
    <main className="character-flow-screen character-select-screen">
      <div className="character-flow-backdrop" />
      <div className="character-flow-overlay" />
      <div className="character-flow-vignette" />

      <section className="character-flow-shell character-select-shell">
        <aside className="character-flow-hero">
          <div className="character-flow-hero__eyebrow">Frontier Roster</div>
          <div className="character-flow-hero__title-block">
            <h1>Character Selection</h1>
            <p>Welcome back, {username}. Choose who steps into the wasteland next.</p>
          </div>

          <div className="character-flow-hero__copy">
            <p className="character-flow-hero__line">
              Review your survivors, compare their specializations, and enter the
              world with a clearer sense of role and risk.
            </p>
            <p className="character-flow-hero__line">
              This roster will grow into a richer selection surface as companions,
              progression, and account-level management expand.
            </p>
          </div>

          <div className="character-flow-status-row">
            <span className="character-flow-status-pill">
              <span className="character-flow-status-pill__dot" />
              {characters.length} registered survivors
            </span>
            {selectedCharacter && selectedClass ? (
              <span className="character-flow-status-pill">
                {selectedClass.name} - Level {selectedCharacter.level}
              </span>
            ) : null}
          </div>

          <div className="character-flow-hero-card">
            <span className="character-flow-hero-card__label">Active Preview</span>
            {selectedCharacter && selectedClass && selectedAvatar ? (
              <>
                <div className="character-select-preview-card">
                  <CharacterAvatar
                    src={selectedAvatar.imageSrc}
                    alt={selectedAvatar.altLabel}
                    size="lg"
                  />

                  <div className="character-select-preview-card__content">
                    <strong>{selectedCharacter.name}</strong>
                    <p>{selectedClass.title}</p>
                  </div>
                </div>

                <div className="character-flow-inline-stats">
                  <span>HP {selectedClass.baseHp}</span>
                  <span>SP {selectedClass.baseSp}</span>
                  <span>Stamina {selectedClass.baseStamina}</span>
                </div>
              </>
            ) : (
              <>
                <strong>No character selected</strong>
                <p>Select a survivor to inspect their current class profile.</p>
              </>
            )}
          </div>
        </aside>

        <section className="character-flow-panel">
          <div className="character-flow-panel__header character-select-header">
            <div>
              <h2>Roster</h2>
              <p>Choose a survivor or create a new one before entering the world.</p>
            </div>

            <button
              type="button"
              className="character-flow-button character-flow-button--secondary"
              onClick={onCreateNewCharacter}
            >
              New Character
            </button>
          </div>

          <div className="character-select-body">
            <div className="character-select-list character-flow-scroll-panel">
              {characters.length === 0 ? (
                <div className="character-empty-state">
                  <strong>No characters found</strong>
                  <span>Create your first character to enter the world.</span>
                </div>
              ) : (
                characters.map((character) => {
                  const isSelected = character.id === selectedCharacterId;
                  const characterClass = characterClassesData[character.classKey];
                  const characterAvatar = resolveCharacterAvatarByClassKey(
                    character.classKey
                  );

                  return (
                    <button
                      key={character.id}
                      type="button"
                      className={`character-card ${isSelected ? "is-selected" : ""}`}
                      onClick={() => setSelectedCharacterId(character.id)}
                    >
                      <CharacterAvatar
                        src={characterAvatar.imageSrc}
                        alt={characterAvatar.altLabel}
                        size="sm"
                        className="character-card-portrait"
                      />

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

            <aside className="character-class-preview character-flow-scroll-panel">
              {selectedCharacter && selectedClass && selectedAvatar ? (
                <>
                  <div className="character-class-preview-header">
                    <div className="character-class-preview-header__identity">
                      <CharacterAvatar
                        src={selectedAvatar.imageSrc}
                        alt={selectedAvatar.altLabel}
                        size="md"
                      />

                      <div>
                        <strong>{selectedCharacter.name}</strong>
                        <span>
                          {selectedClass.name} - Level {selectedCharacter.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="character-class-preview-section">
                    <h2>{selectedClass.title}</h2>
                    <p>{selectedClass.description}</p>
                  </div>

                  <div className="character-class-preview-section">
                    <h3>Base Stats</h3>

                    <div className="character-class-stats-grid">
                      <div className="character-class-stat-card character-flow-stat-card">
                        <small>HP</small>
                        <strong>{selectedClass.baseHp}</strong>
                      </div>

                      <div className="character-class-stat-card character-flow-stat-card">
                        <small>SP</small>
                        <strong>{selectedClass.baseSp}</strong>
                      </div>

                      <div className="character-class-stat-card character-flow-stat-card">
                        <small>Stamina</small>
                        <strong>{selectedClass.baseStamina}</strong>
                      </div>

                      <div className="character-class-stat-card character-flow-stat-card">
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

          <div className="character-flow-panel__footer character-select-footer">
            <div className="character-flow-summary">
              {selectedCharacter && selectedClass ? (
                <>
                  <strong>{selectedCharacter.name}</strong>
                  <span>
                    {selectedClass.name} - Level {selectedCharacter.level}
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
              className="character-flow-button character-flow-button--primary"
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
      </section>
    </main>
  );
}
