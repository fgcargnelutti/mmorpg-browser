# Frontend Features

This folder organizes the frontend by feature and by internal layer.

## Base structure

Each feature can contain:

- `presentation`: components, styles, and feature-specific visual elements
- `application`: hooks, use cases, and orchestration flows
- `domain`: types, rules, data, and feature contracts
- `infrastructure`: external integrations and adapters

## Current adoption

At the moment, the features with an initial structure are:

- `world`
- `progression`

The next natural candidates are:

- `character`
- `combat`
- `npc`
- `inventory`
- `chat`

## Maintenance rule

Every new behavior should be added to the correct feature first.
Files outside `features` should remain there only when they are truly shared or still in migration.
