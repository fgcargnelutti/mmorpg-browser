import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import "./App.css";
import LoginScreen from "./screens/LoginScreen";
import CharacterSelectScreen, {} from "./screens/CharacterSelectScreen";
import CharacterCreationScreen from "./screens/CharacterCreationScreen";
import GameScreen from "./screens/GameScreen";
import { charactersData } from "./data/charactersData";
import { NotificationProvider } from "./features/notifications";
import { validateMasterDataReferences } from "./features/systems/application/systems/masterDataValidationSystem";
export default function App() {
    const [screen, setScreen] = useState("login");
    const [loggedUser, setLoggedUser] = useState(null);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characters, setCharacters] = useState(charactersData);
    useEffect(() => {
        if (!import.meta.env.DEV) {
            return;
        }
        const report = validateMasterDataReferences();
        if (report.errors.length > 0) {
            console.error("Master data validation errors detected:", report.errors);
        }
        if (report.warnings.length > 0) {
            console.warn("Master data validation warnings detected:", report.warnings);
        }
    }, []);
    const handleLoginSuccess = (username) => {
        setLoggedUser(username);
        setScreen("character-select");
    };
    const handleEnterWorld = (character) => {
        setSelectedCharacter(character);
        setScreen("game");
    };
    const handleOpenCreateCharacter = () => {
        setScreen("character-create");
    };
    const handleBackToCharacterSelect = () => {
        setScreen("character-select");
    };
    const handleCreateCharacter = (character) => {
        setCharacters((prev) => [...prev, character]);
        setSelectedCharacter(character);
        setScreen("character-select");
    };
    const handleDeleteCharacter = (characterId) => {
        setCharacters((prev) => prev.filter((character) => character.id !== characterId));
        setSelectedCharacter((prev) => prev?.id === characterId ? null : prev);
    };
    const handleDisconnect = () => {
        setSelectedCharacter(null);
        setLoggedUser(null);
        setScreen("login");
    };
    let content;
    if (screen === "login") {
        content = _jsx(LoginScreen, { onLoginSuccess: handleLoginSuccess });
    }
    else if (screen === "character-create") {
        content = (_jsx(CharacterCreationScreen, { username: loggedUser ?? "", onBack: handleBackToCharacterSelect, onCreateCharacter: handleCreateCharacter }));
    }
    else if (screen === "character-select" || !selectedCharacter) {
        content = (_jsx(CharacterSelectScreen, { username: loggedUser ?? "", characters: characters, onEnterWorld: handleEnterWorld, onCreateNewCharacter: handleOpenCreateCharacter, onDeleteCharacter: handleDeleteCharacter }));
    }
    else {
        content = (_jsx(GameScreen, { selectedCharacter: selectedCharacter, onDisconnect: handleDisconnect }));
    }
    return _jsx(NotificationProvider, { children: content });
}
