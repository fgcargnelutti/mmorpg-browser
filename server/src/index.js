const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const player = {
  name: "Fernando",
  stamina: 10,
  maxStamina: 10,
  inventory: [],
  logs: [],
};

app.get("/", (req, res) => {
  res.json({ message: "MMORPG server running" });
});

app.get("/player", (req, res) => {
  res.json(player);
});

app.post("/action/gather", (req, res) => {
  const staminaCost = 2;

  if (player.stamina < staminaCost) {
    const log = "Not enough stamina to gather.";
    player.logs.unshift(log);

    return res.status(400).json({
      success: false,
      message: log,
      player,
    });
  }

  player.stamina -= staminaCost;

  const possibleRewards = ["Wood", "Herb", "Stone"];
  const reward =
    possibleRewards[Math.floor(Math.random() * possibleRewards.length)];

  player.inventory.push(reward);

  const log = `You gathered 1 ${reward}.`;
  player.logs.unshift(log);

  res.json({
    success: true,
    message: log,
    reward,
    player,
  });
});

app.post("/action/rest", (req, res) => {
  const recovered = 3;
  player.stamina = Math.min(player.stamina + recovered, player.maxStamina);

  const log = `You rested and recovered stamina.`;
  player.logs.unshift(log);

  res.json({
    success: true,
    message: log,
    player,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});