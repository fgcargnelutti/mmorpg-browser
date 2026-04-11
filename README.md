# 🧠 MMORPG Browser Prototype

A browser-based MMORPG prototype focused on asynchronous gameplay, resource management, and discovery systems.

This project explores how lightweight MMO experiences can be designed for the browser, emphasizing player progression, hidden knowledge mechanics, and meaningful interaction loops.

---

## 🎯 Vision

The goal is to build a minimal yet expandable MMORPG experience where:

- Players interact through actions instead of real-time combat
- Progression is driven by discovery, repetition, and knowledge
- Systems are simple but interconnected (stamina, inventory, exploration)
- The game evolves through layered mechanics (NPCs, secrets, bosses)

---

## 🔁 Core Gameplay Loop

1. Player performs an action (e.g., gather resources)
2. Action consumes stamina
3. Player receives rewards (items, logs)
4. Progression unlocks new possibilities
5. Repeat with new strategies and discoveries

---

## ⚙️ Current Features

- Character state (name, stamina, inventory)
- Stamina system (consumption and recovery)
- Gather action with random rewards
- Rest action to recover stamina
- Inventory system
- Activity log system
- Frontend ↔ Backend communication

---

## 🧱 Tech Stack

**Frontend**
- React
- Vite
- TypeScript

**Backend**
- Node.js
- Express

**Architecture**
- Simple REST API
- Server-side state management
- Client-driven actions

---

## 🧪 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/fgcargnelutti/mmorpg-browser.git
cd mmorpg-browser
