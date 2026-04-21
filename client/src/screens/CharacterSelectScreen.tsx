import { useEffect, useMemo, useState } from "react";
import "./CharacterFlow.css";
import "./CharacterSelectScreen.css";
import {
  characterClassesData,
  type CharacterClassKey,
} from "../data/characterClassesData";
import { resolveCharacterAvatarByClassKey } from "../data/characterAvatarCatalog";
import CharacterAvatar from "../components/CharacterAvatar";
import CharacterClassDetailsSidebar from "../components/character-flow/CharacterClassDetailsSidebar";
import CharacterCenteredCarousel from "../components/character-flow/CharacterCenteredCarousel";

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
  onDeleteCharacter: (characterId: string) => void;
};

function getWrappedCharacter(characters: CharacterSummary[], index: number) {
  if (characters.length === 0) return null;

  const normalizedIndex = (index + characters.length) % characters.length;
  return characters[normalizedIndex] ?? null;
}

export default function CharacterSelectScreen({
  characters,
  onEnterWorld,
  onCreateNewCharacter,
  onDeleteCharacter,
}: CharacterSelectScreenProps) {
  const initialSelectedId = useMemo(
    () => characters[0]?.id ?? null,
    [characters]
  );

  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    initialSelectedId
  );

  useEffect(() => {
    if (characters.length === 0) {
      setSelectedCharacterId(null);
      return;
    }

    const hasSelectedCharacter = characters.some(
      (character) => character.id === selectedCharacterId
    );

    if (!hasSelectedCharacter) {
      setSelectedCharacterId(characters[0].id);
    }
  }, [characters, selectedCharacterId]);

  const selectedIndex = characters.findIndex(
    (character) => character.id === selectedCharacterId
  );

  const selectedCharacter =
    (selectedIndex >= 0 ? characters[selectedIndex] : null) ?? null;

  const selectedClass = selectedCharacter
    ? characterClassesData[selectedCharacter.classKey]
    : null;

  const selectedAvatar = selectedCharacter
    ? resolveCharacterAvatarByClassKey(selectedCharacter.classKey)
    : null;

  const previousCharacter =
    selectedIndex >= 0 ? getWrappedCharacter(characters, selectedIndex - 1) : null;
  const nextCharacter =
    selectedIndex >= 0 ? getWrappedCharacter(characters, selectedIndex + 1) : null;

  const handleSelectOffset = (offset: number) => {
    if (characters.length <= 1 || selectedIndex < 0) {
      return;
    }

    const targetCharacter = getWrappedCharacter(characters, selectedIndex + offset);

    if (targetCharacter) {
      setSelectedCharacterId(targetCharacter.id);
    }
  };

  const handleDeleteSelectedCharacter = () => {
    if (!selectedCharacter) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedCharacter.name}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    onDeleteCharacter(selectedCharacter.id);
  };

  return (
    <main className="character-flow-screen character-select-screen">
      <div className="character-flow-backdrop" />
      <div className="character-flow-overlay" />
      <div className="character-flow-vignette" />

      <section className="character-flow-shell character-select-shell">
        <section className="character-flow-panel character-select-panel">
          {selectedCharacter && selectedClass ? (
            <div className="character-select-layout">
              <CharacterClassDetailsSidebar
                prefix="character-select"
                name={selectedCharacter.name}
                classNameLabel={selectedClass.name}
                level={selectedCharacter.level}
                characterClass={selectedClass}
              />

              <div className="character-select-stage">
                <CharacterCenteredCarousel
                  prefix="character-select"
                  ariaLabel="Character roster"
                  onPrevious={() => handleSelectOffset(-1)}
                  onNext={() => handleSelectOffset(1)}
                  disableNavigation={characters.length <= 1}
                  previousCard={
                    previousCharacter
                      ? {
                          name: previousCharacter.name,
                          meta: characterClassesData[previousCharacter.classKey].name,
                          onSelect: () =>
                            setSelectedCharacterId(previousCharacter.id),
                        }
                      : null
                  }
                  nextCard={
                    nextCharacter
                      ? {
                          name: nextCharacter.name,
                          meta: characterClassesData[nextCharacter.classKey].name,
                          onSelect: () => setSelectedCharacterId(nextCharacter.id),
                        }
                      : null
                  }
                  activeCard={
                    <article className="character-select-carousel-card is-active">
                      {selectedAvatar ? (
                        <CharacterAvatar
                          src={selectedAvatar.imageSrc}
                          alt={selectedAvatar.altLabel}
                          size="lg"
                          className="character-select-carousel-avatar"
                        />
                      ) : null}

                      <div className="character-select-carousel-card__content">
                        <strong>{selectedCharacter.name}</strong>
                        <span>
                          {selectedClass.name} • Level {selectedCharacter.level}
                        </span>
                      </div>
                    </article>
                  }
                />

                <div className="character-select-footer">
                  <button
                    type="button"
                    className="character-flow-button character-flow-button--primary"
                    onClick={() => onEnterWorld(selectedCharacter)}
                  >
                    Enter World
                  </button>

                  <button
                    type="button"
                    className="character-flow-button character-flow-button--secondary"
                    onClick={onCreateNewCharacter}
                  >
                    Create New Character
                  </button>

                  <button
                    type="button"
                    className="character-select-delete-link"
                    onClick={handleDeleteSelectedCharacter}
                  >
                    Delete Character
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="character-empty-state character-select-empty">
              <strong>No characters found</strong>
              <span>Create a new character to start building your roster.</span>

              <div className="character-select-footer">
                <button
                  type="button"
                  className="character-flow-button character-flow-button--secondary"
                  onClick={onCreateNewCharacter}
                >
                  Create New Character
                </button>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
