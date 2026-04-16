import { useState } from "react";
import "./App.css";
import LoginScreen from "./screens/LoginScreen";
import CharacterSelectScreen, {
  type CharacterSummary,
} from "./screens/CharacterSelectScreen";
import CharacterCreationScreen from "./screens/CharacterCreationScreen";
import GameScreen from "./screens/GameScreen";
import { charactersData } from "./data/charactersData";
import { NotificationProvider } from "./features/notifications";

type AppScreen = "login" | "character-select" | "character-create" | "game";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("login");
  const [loggedUser, setLoggedUser] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterSummary | null>(null);
  const [characters, setCharacters] = useState<CharacterSummary[]>(charactersData);

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
      />
    );
  } else {
    content = <GameScreen selectedCharacter={selectedCharacter} />;
  }

  return <NotificationProvider>{content}</NotificationProvider>;
}
