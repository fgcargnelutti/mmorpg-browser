import { useEffect, useState } from "react";
import "./App.css";
import LoginScreen from "./screens/LoginScreen";
import CharacterSelectScreen, {
  type CharacterSummary,
} from "./screens/CharacterSelectScreen";
import CharacterCreationScreen from "./screens/CharacterCreationScreen";
import GameScreen from "./screens/GameScreen";
import { charactersData } from "./data/charactersData";
import { NotificationProvider } from "./features/notifications";
import { validateMasterDataReferences } from "./features/systems/application/systems/masterDataValidationSystem";

type AppScreen = "login" | "character-select" | "character-create" | "game";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("login");
  const [loggedUser, setLoggedUser] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterSummary | null>(null);
  const [characters, setCharacters] = useState<CharacterSummary[]>(charactersData);

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

  const handleLoginSuccess = (username: string) => {
    setLoggedUser(username);
    setScreen("character-select");
  };

  const handleEnterWorld = (character: CharacterSummary) => {
    setSelectedCharacter(character);
    setScreen("game");
  };

  const handleOpenCreateCharacter = () => {
    setScreen("character-create");
  };

  const handleBackToCharacterSelect = () => {
    setScreen("character-select");
  };

  const handleCreateCharacter = (character: CharacterSummary) => {
    setCharacters((prev) => [...prev, character]);
    setSelectedCharacter(character);
    setScreen("character-select");
  };

  const handleDeleteCharacter = (characterId: string) => {
    setCharacters((prev) =>
      prev.filter((character) => character.id !== characterId)
    );

    setSelectedCharacter((prev) =>
      prev?.id === characterId ? null : prev
    );
  };

  const handleDisconnect = () => {
    setSelectedCharacter(null);
    setLoggedUser(null);
    setScreen("login");
  };

  let content;

  if (screen === "login") {
    content = <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  } else if (screen === "character-create") {
    content = (
      <CharacterCreationScreen
        username={loggedUser ?? ""}
        onBack={handleBackToCharacterSelect}
        onCreateCharacter={handleCreateCharacter}
      />
    );
  } else if (screen === "character-select" || !selectedCharacter) {
    content = (
      <CharacterSelectScreen
        username={loggedUser ?? ""}
        characters={characters}
        onEnterWorld={handleEnterWorld}
        onCreateNewCharacter={handleOpenCreateCharacter}
        onDeleteCharacter={handleDeleteCharacter}
      />
    );
  } else {
    content = (
      <GameScreen
        selectedCharacter={selectedCharacter}
        onDisconnect={handleDisconnect}
      />
    );
  }

  return <NotificationProvider>{content}</NotificationProvider>;
}
