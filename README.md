# MMORPG Web Prototype

Web MMORPG prototype with a `React + TypeScript` frontend, focused on exploration, discovery, local character progression, and incremental UI evolution.

In the current state, the project works mainly as a local frontend. There is a `server` folder based on `Node.js + Express`, but the backend is not yet part of the main development flow.

## Overview

The project explores a browser-based MMORPG experience with an emphasis on:

- map exploration
- discovery of locations and points of interest
- experience-based progression
- NPC dialogues
- basic combat
- HUD and modular side panels
- lore and rumor-driven discovery

The goal is not to build everything at once, but to evolve the game in a safe, modular, and sustainable way.

## Current State

The frontend already has a functional foundation with:

- screen flow for `login`, `character-select`, `character-create`, and `game`
- character selection and creation
- maps such as `town` and `sewer`
- transitions between maps
- a PoI system with rumor and hover-based discovery
- NPC dialogue
- basic combat with real HP
- character, inventory, chat, skills, and HUD panels
- static data organized in `data` and an ongoing migration to `features`

## Stack

### Frontend

- `React 19`
- `TypeScript`
- `Vite`
- `CSS` per component/screen

### Backend

- `Node.js`
- `Express`

Note: the backend is present in the repository, but it is not yet the main runtime source of the project.

## Repository Structure

```text
.
|-- client/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- data/
|   |   |-- features/
|   |   |-- hooks/
|   |   `-- screens/
|-- server/
|   `-- src/
`-- .github/
    |-- AGENTS.md
    |-- PROJECT.md
    |-- HOWL_OF_COLLAPSE.md
    `-- TASKS.md
```

## Frontend Organization

Today the project combines a legacy structure with a newer feature-based organization:

- `client/src/components`: reusable UI components
- `client/src/screens`: main application screens
- `client/src/hooks`: shared hooks
- `client/src/data`: catalogs, tables, and static data
- `client/src/features`: domain-organized modules such as `world` and `progression`

This migration is being done incrementally to avoid regressions and keep the code easy to evolve.

## Running Locally

### Frontend

```bash
cd client
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run lint
npm run preview
```

### Backend

The backend exists in the repository, but it is still not part of the prototype's main flow.

If you only want to inspect it or prepare the environment:

```bash
cd server
npm install
```

## Current Application Flow

The main frontend flow is controlled in `client/src/App.tsx`:

1. `login`
2. `character-select`
3. `character-create`
4. `game`

The main navigation state keeps:

- logged-in user
- selected character
- character list
- current screen

## Development Direction

Project changes follow these directions:

- keep `TypeScript` with explicit, readable typing
- prefer small, focused components
- use semantic `HTML` for structure
- use `CSS` for presentation
- separate domain logic from the visual layer
- avoid turning `GameScreen.tsx` into a monolithic point
- evolve the codebase through small, safe steps

## Context Documentation

The main project context documents are in `.github/`:

- `.github/PROJECT.md`: architecture, stack, structure, and technical guidelines
- `.github/HOWL_OF_COLLAPSE.md`: lore, business rules, and game systems
- `.github/TASKS.md`: roadmap and progress of ongoing work
- `.github/AGENTS.md`: context instructions for development agents

## Project Status

This repository represents an evolving prototype. The current priority is to consolidate the frontend, organize the architecture by domain, and expand the game's core systems before moving further into persistence and a complete backend.
