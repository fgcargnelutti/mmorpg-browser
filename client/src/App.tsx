import { useEffect, useState } from "react";

type Player = {
  name: string;
  stamina: number;
  maxStamina: number;
  inventory: string[];
  logs: string[];
};

function App() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [statusMessage, setStatusMessage] = useState("Loading...");

  const loadPlayer = async () => {
    try {
      const res = await fetch("http://localhost:3000/player");
      const data = await res.json();
      setPlayer(data);
      setStatusMessage("Connected to server.");
    } catch {
      setStatusMessage("Failed to load player.");
    }
  };

  useEffect(() => {
    loadPlayer();
  }, []);

  const handleGather = async () => {
    try {
      const res = await fetch("http://localhost:3000/action/gather", {
        method: "POST",
      });

      const data = await res.json();
      setPlayer(data.player);
      setStatusMessage(data.message);
    } catch {
      setStatusMessage("Error performing gather action.");
    }
  };

  const handleRest = async () => {
    try {
      const res = await fetch("http://localhost:3000/action/rest", {
        method: "POST",
      });

      const data = await res.json();
      setPlayer(data.player);
      setStatusMessage(data.message);
    } catch {
      setStatusMessage("Error performing rest action.");
    }
  };

  if (!player) {
    return (
      <main style={{ padding: "24px", fontFamily: "Arial" }}>
        <h1>MMORPG Browser</h1>
        <p>{statusMessage}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "24px", fontFamily: "Arial" }}>
      <h1>MMORPG Browser</h1>
      <p>{statusMessage}</p>

      <section style={{ marginTop: "24px" }}>
        <h2>Character</h2>
        <p>Name: {player.name}</p>
        <p>
          Stamina: {player.stamina} / {player.maxStamina}
        </p>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Actions</h2>
        <button onClick={handleGather} style={{ marginRight: "12px" }}>
          Gather Resource (-2 stamina)
        </button>

        <button onClick={handleRest}>Rest (+3 stamina)</button>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Inventory</h2>
        {player.inventory.length === 0 ? (
          <p>Empty inventory.</p>
        ) : (
          <ul>
            {player.inventory.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Logs</h2>
        {player.logs.length === 0 ? (
          <p>No logs yet.</p>
        ) : (
          <ul>
            {player.logs.map((log, index) => (
              <li key={`${log}-${index}`}>{log}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;