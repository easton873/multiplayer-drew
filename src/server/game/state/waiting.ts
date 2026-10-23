import type { RoomPhase, ReconnectData, ResourceData } from "../../../shared/types.js";
import type { RoomState } from "../room_state.js";
import type { GameRoom } from "../game_room.js";
import type { ClientHandler } from "../client_handler.js";
import type { EditComputerData, PlayerWaitingData } from "../../../shared/bulider.js";
import { backgrounds } from "../data/backgrounds.js";
import { RESOURCE_TYPES, defaultStartingResources } from "../../../shared/resource_types.js";

export class WaitingState implements RoomState {
    readonly phase: RoomPhase = "waiting";

    constructor(private room?: GameRoom, resetPlayers: boolean = false) {
        if (resetPlayers && room) {
            room.players.forEach(player => player.reset());
        }
    }

    updatePlayer(room: GameRoom, id: string, data: PlayerWaitingData): void {
        let player = room.players.get(id);
        if (!player) return;
        player.update(data);
    }

    addComputerPlayer(room: GameRoom, handler: ClientHandler, name: string, color: string, team: number, difficulty: string): void {
        room.addComputerPlayer(handler, name, color, team, difficulty);
    }

    removeComputerPlayer(room: GameRoom, id: string): void {
        room.players.delete(id);
    }

    editComputerPlayer(room: GameRoom, id: string, data: EditComputerData): void {
        room.editComputerPlayer(id, data);
    }

    updateBoard(room: GameRoom, width: number, height: number): void {
        if (width < 10 || height < 10) return;
        room.boardX = width;
        room.boardY = height;
    }

    updateResources(room: GameRoom, resources: ResourceData): void {
        const sanitized = defaultStartingResources();
        for (const t of RESOURCE_TYPES) {
            sanitized[t] = Math.max(0, Math.floor(resources[t] || 0));
        }
        room.startingResources = sanitized;
    }

    updateBackground(room: GameRoom, filename: string): void {
        if (backgrounds.includes(filename)) {
            room.background = filename;
        }
    }

    reconnectData(room: GameRoom, playerId: string): ReconnectData | null {
        return {
            phase: "waiting",
            waitingData: room.joinRoomData(),
            playerData: room.getPlayerJoinDataById(playerId),
        };
    }
}
