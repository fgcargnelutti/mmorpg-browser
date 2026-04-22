import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import "./CharacterFlow.css";
import "./CharacterSelectScreen.css";
import { characterClassesData, } from "../data/characterClassesData";
import { resolveCharacterAvatarByClassKey } from "../data/characterAvatarCatalog";
import CharacterAvatar from "../components/CharacterAvatar";
import CharacterClassDetailsSidebar from "../components/character-flow/CharacterClassDetailsSidebar";
import CharacterCenteredCarousel from "../components/character-flow/CharacterCenteredCarousel";
function getWrappedCharacter(characters, index) {
    if (characters.length === 0)
        return null;
    const normalizedIndex = (index + characters.length) % characters.length;
    return characters[normalizedIndex] ?? null;
}
export default function CharacterSelectScreen({ characters, onEnterWorld, onCreateNewCharacter, onDeleteCharacter, }) {
    const initialSelectedId = useMemo(() => characters[0]?.id ?? null, [characters]);
    const [selectedCharacterId, setSelectedCharacterId] = useState(initialSelectedId);
    useEffect(() => {
        if (characters.length === 0) {
            setSelectedCharacterId(null);
            return;
        }
        const hasSelectedCharacter = characters.some((character) => character.id === selectedCharacterId);
        if (!hasSelectedCharacter) {
            setSelectedCharacterId(characters[0].id);
        }
    }, [characters, selectedCharacterId]);
    const selectedIndex = characters.findIndex((character) => character.id === selectedCharacterId);
    const selectedCharacter = (selectedIndex >= 0 ? characters[selectedIndex] : null) ?? null;
    const selectedClass = selectedCharacter
        ? characterClassesData[selectedCharacter.classKey]
        : null;
    const selectedAvatar = selectedCharacter
        ? resolveCharacterAvatarByClassKey(selectedCharacter.classKey)
        : null;
    const previousCharacter = selectedIndex >= 0 ? getWrappedCharacter(characters, selectedIndex - 1) : null;
    const nextCharacter = selectedIndex >= 0 ? getWrappedCharacter(characters, selectedIndex + 1) : null;
    const handleSelectOffset = (offset) => {
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
        const confirmed = window.confirm(`Delete ${selectedCharacter.name}? This action cannot be undone.`);
        if (!confirmed) {
            return;
        }
        onDeleteCharacter(selectedCharacter.id);
    };
    return (_jsxs("main", { className: "character-flow-screen character-select-screen", children: [_jsx("div", { className: "character-flow-backdrop" }), _jsx("div", { className: "character-flow-overlay" }), _jsx("div", { className: "character-flow-vignette" }), _jsx("section", { className: "character-flow-shell character-select-shell", children: _jsx("section", { className: "character-flow-panel character-select-panel", children: selectedCharacter && selectedClass ? (_jsxs("div", { className: "character-select-layout", children: [_jsx(CharacterClassDetailsSidebar, { prefix: "character-select", name: selectedCharacter.name, classNameLabel: selectedClass.name, level: selectedCharacter.level, characterClass: selectedClass }), _jsxs("div", { className: "character-select-stage", children: [_jsx(CharacterCenteredCarousel, { prefix: "character-select", ariaLabel: "Character roster", onPrevious: () => handleSelectOffset(-1), onNext: () => handleSelectOffset(1), disableNavigation: characters.length <= 1, previousCard: previousCharacter
                                            ? {
                                                name: previousCharacter.name,
                                                meta: characterClassesData[previousCharacter.classKey].name,
                                                onSelect: () => setSelectedCharacterId(previousCharacter.id),
                                            }
                                            : null, nextCard: nextCharacter
                                            ? {
                                                name: nextCharacter.name,
                                                meta: characterClassesData[nextCharacter.classKey].name,
                                                onSelect: () => setSelectedCharacterId(nextCharacter.id),
                                            }
                                            : null, activeCard: _jsxs("article", { className: "character-select-carousel-card is-active", children: [selectedAvatar ? (_jsx(CharacterAvatar, { src: selectedAvatar.imageSrc, alt: selectedAvatar.altLabel, size: "lg", className: "character-select-carousel-avatar" })) : null, _jsxs("div", { className: "character-select-carousel-card__content", children: [_jsx("strong", { children: selectedCharacter.name }), _jsxs("span", { children: [selectedClass.name, " \u2022 Level ", selectedCharacter.level] })] })] }) }), _jsxs("div", { className: "character-select-footer", children: [_jsx("button", { type: "button", className: "character-flow-button character-flow-button--primary", onClick: () => onEnterWorld(selectedCharacter), children: "Enter World" }), _jsx("button", { type: "button", className: "character-flow-button character-flow-button--secondary", onClick: onCreateNewCharacter, children: "Create New Character" }), _jsx("button", { type: "button", className: "character-select-delete-link", onClick: handleDeleteSelectedCharacter, children: "Delete Character" })] })] })] })) : (_jsxs("div", { className: "character-empty-state character-select-empty", children: [_jsx("strong", { children: "No characters found" }), _jsx("span", { children: "Create a new character to start building your roster." }), _jsx("div", { className: "character-select-footer", children: _jsx("button", { type: "button", className: "character-flow-button character-flow-button--secondary", onClick: onCreateNewCharacter, children: "Create New Character" }) })] })) }) })] }));
}
