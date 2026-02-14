# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server (frontend):** `npm run dev` — starts Vite dev server
- **Build:** `npm run build` — builds frontend with Vite to `dist/`
- **Start server:** `npm start` — builds then runs Express/Socket.IO server with ts-node
- **Run all tests:** `npm test` — runs Mocha test suite
- **Run a single test file:** `npx mocha --loader ts-node/esm test/<file>.ts`

## Architecture

Real-time multiplayer strategy/tower defense game. Express + Socket.IO backend, Vite + Canvas frontend, all TypeScript (ESM).

### Three-layer structure

- **`src/server/`** — Game logic and server. `server.ts` sets up Express + Socket.IO. `game/` contains all game mechanics.
- **`src/client/`** — Browser client. `screen/manager.ts` navigates between 4 screens (join, waiting, game, game_over). `game.ts` renders via Canvas.
- **`src/shared/`** — Types and Socket.IO event definitions shared by client and server. `routes.ts` defines server-bound events with `RouteReceiver` abstract class. `client.ts` defines client-bound events with `ClientReceiver` abstract class.

### Server game flow

`GameRoom` manages the lobby/setup phase → `Game` runs the main loop (move entities → player turns → check alive) → state is emitted to clients each frame at 30 FPS.

### Key abstractions

- **`Player`** — Owns resources, era, heart (base unit), and unit count. `PlayerProxy` extends it to enforce placement radius/unit limits for human players.
- **`Board`** — Spatial entity manager. Observes unit deaths to remove them from the entity list.
- **`Era`** — Progression system (6 eras). Each era unlocks units, increases heart HP, resource rates, placement radius, and unit cap. Advancing costs resources.
- **`Unit`** hierarchy — `Unit` → `UnitWithTarget` → `TargetChasingUnit`. Units use the Observer pattern to notify owners on death. All unit types registered in `unit/all_units.ts` via `UNIT_MAP`.
- **`Heart`** — The player's base unit. If it dies, the player is eliminated.
- **Resources** — Three types: gold, wood, stone. Resource units generate them passively.

### Computer AI

Four AI difficulty levels in `game/computer/`: Winner (aggressive), Basic (balanced), Simple (conservative), Wave (wave-based attacks). All extend `PlayerProxy`. Created via factory pattern from difficulty string.

### Socket.IO communication pattern

Events are defined as constants + emit helper functions in `shared/routes.ts` (client→server) and `shared/client.ts` (server→client). Server-side handlers implement `RouteReceiver`; client-side handlers implement `ClientReceiver`. `ClientHandler` in `game/client_handler.ts` is the concrete server-side handler.

## Testing

Tests are in `test/` using Mocha + Node assert. Tests cover positions, eras, units, board, game loop, and resources. Tests run via ts-node/esm loader.
