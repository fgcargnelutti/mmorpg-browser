import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import "./CharacterFlow.css";
import "./CharacterCreationScreen.css";
import { characterClassesData } from "../data/characterClassesData";
import { resolveCharacterAvatarByClassKey } from "../data/characterAvatarCatalog";
import CharacterAvatar from "../components/CharacterAvatar";
import CharacterClassDetailsSidebar from "../components/character-flow/CharacterClassDetailsSidebar";
import CharacterCenteredCarousel from "../components/character-flow/CharacterCenteredCarousel";
const availableClassKeys = [
    "wasteland-warrior",
    "arcanist",
    "thief",
];
export default function CharacterCreationScreen({ onBack, onCreateCharacter, }) {
    const [characterName, setCharacterName] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedClassKey = availableClassKeys[selectedIndex];
    const selectedClass = characterClassesData[selectedClassKey];
    const selectedAvatar = resolveCharacterAvatarByClassKey(selectedClassKey);
    const trimmedName = characterName.trim();
    const isValidName = trimmedName.length >= 3;
    const previousIndex = (selectedIndex - 1 + availableClassKeys.length) % availableClassKeys.length;
    const nextIndex = (selectedIndex + 1) % availableClassKeys.length;
    const previousClassKey = availableClassKeys[previousIndex];
    const nextClassKey = availableClassKeys[nextIndex];
    const handleSubmit = () => {
        if (!isValidName)
            return;
        const newCharacter = {
            id: `char-${Date.now()}`,
            name: trimmedName,
            classKey: selectedClassKey,
            level: 1,
        };
        onCreateCharacter(newCharacter);
    };
    return (_jsxs("main", { className: "character-flow-screen character-creation-screen", children: [_jsx("div", { className: "character-flow-backdrop" }), _jsx("div", { className: "character-flow-overlay" }), _jsx("div", { className: "character-flow-vignette" }), _jsx("section", { className: "character-flow-shell character-creation-shell", children: _jsxs("section", { className: "character-flow-panel character-creation-panel", children: [_jsx("button", { type: "button", className: "character-flow-button character-flow-button--secondary character-creation-back", onClick: onBack, children: "Back" }), _jsxs("div", { className: "character-creation-layout", children: [_jsx(CharacterClassDetailsSidebar, { prefix: "character-creation", name: trimmedName || selectedClass.name, classNameLabel: selectedClass.name, level: 1, characterClass: selectedClass }), _jsxs("div", { className: "character-creation-stage", children: [_jsx(CharacterCenteredCarousel, { prefix: "character-creation", ariaLabel: "Class carousel", onPrevious: () => setSelectedIndex(previousIndex), onNext: () => setSelectedIndex(nextIndex), previousCard: {
                                                name: characterClassesData[previousClassKey].name,
                                                meta: characterClassesData[previousClassKey].title,
                                                onSelect: () => setSelectedIndex(previousIndex),
                                            }, nextCard: {
                                                name: characterClassesData[nextClassKey].name,
                                                meta: characterClassesData[nextClassKey].title,
                                                onSelect: () => setSelectedIndex(nextIndex),
                                            }, activeCard: _jsxs("article", { className: "character-creation-carousel-card is-active", children: [_jsx(CharacterAvatar, { src: selectedAvatar.imageSrc, alt: selectedAvatar.altLabel, size: "lg", className: "character-creation-preview-avatar" }), _jsxs("div", { className: "character-creation-preview__content", children: [_jsx("strong", { children: trimmedName || selectedClass.name }), _jsxs("span", { children: [selectedClass.name, " \u2022 Level 1"] })] })] }) }), _jsxs("div", { className: "character-creation-actions", children: [_jsx("input", { id: "character-name", type: "text", value: characterName, onChange: (event) => setCharacterName(event.target.value), placeholder: "Character name", maxLength: 20, className: "character-creation-name-input" }), _jsx("button", { type: "button", className: "character-flow-button character-flow-button--primary", disabled: !isValidName, onClick: handleSubmit, children: "Create" })] })] })] })] }) })] }));
}
