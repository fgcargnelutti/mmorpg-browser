import { useState } from "react";
import "./CharacterFlow.css";
import "./CharacterCreationScreen.css";
import type { CharacterClassKey } from "../data/characterClassesData";
import { characterClassesData } from "../data/characterClassesData";
import { resolveCharacterAvatarByClassKey } from "../data/characterAvatarCatalog";
import CharacterAvatar from "../components/CharacterAvatar";
import CharacterClassDetailsSidebar from "../components/character-flow/CharacterClassDetailsSidebar";
import CharacterCenteredCarousel from "../components/character-flow/CharacterCenteredCarousel";
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
  onBack,
  onCreateCharacter,
}: CharacterCreationScreenProps) {
  const [characterName, setCharacterName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedClassKey = availableClassKeys[selectedIndex];
  const selectedClass = characterClassesData[selectedClassKey];
  const selectedAvatar = resolveCharacterAvatarByClassKey(selectedClassKey);
  const trimmedName = characterName.trim();
  const isValidName = trimmedName.length >= 3;

  const previousIndex =
    (selectedIndex - 1 + availableClassKeys.length) % availableClassKeys.length;
  const nextIndex = (selectedIndex + 1) % availableClassKeys.length;
  const previousClassKey = availableClassKeys[previousIndex];
  const nextClassKey = availableClassKeys[nextIndex];

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
        <section className="character-flow-panel character-creation-panel">
          <button
            type="button"
            className="character-flow-button character-flow-button--secondary character-creation-back"
            onClick={onBack}
          >
            Back
          </button>

          <div className="character-creation-layout">
            <CharacterClassDetailsSidebar
              prefix="character-creation"
              name={trimmedName || selectedClass.name}
              classNameLabel={selectedClass.name}
              level={1}
              characterClass={selectedClass}
            />

            <div className="character-creation-stage">
              <CharacterCenteredCarousel
                prefix="character-creation"
                ariaLabel="Class carousel"
                onPrevious={() => setSelectedIndex(previousIndex)}
                onNext={() => setSelectedIndex(nextIndex)}
                previousCard={{
                  name: characterClassesData[previousClassKey].name,
                  meta: characterClassesData[previousClassKey].title,
                  onSelect: () => setSelectedIndex(previousIndex),
                }}
                nextCard={{
                  name: characterClassesData[nextClassKey].name,
                  meta: characterClassesData[nextClassKey].title,
                  onSelect: () => setSelectedIndex(nextIndex),
                }}
                activeCard={
                  <article className="character-creation-carousel-card is-active">
                    <CharacterAvatar
                      src={selectedAvatar.imageSrc}
                      alt={selectedAvatar.altLabel}
                      size="lg"
                      className="character-creation-preview-avatar"
                    />

                    <div className="character-creation-preview__content">
                      <strong>{trimmedName || selectedClass.name}</strong>
                      <span>{selectedClass.name} • Level 1</span>
                    </div>
                  </article>
                }
              />

              <div className="character-creation-actions">
                <input
                  id="character-name"
                  type="text"
                  value={characterName}
                  onChange={(event) => setCharacterName(event.target.value)}
                  placeholder="Character name"
                  maxLength={20}
                  className="character-creation-name-input"
                />

                <button
                  type="button"
                  className="character-flow-button character-flow-button--primary"
                  disabled={!isValidName}
                  onClick={handleSubmit}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
