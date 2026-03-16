import type { RoomPhase, ReconnectData, ResourceData } from "../../../shared/types.js";
import type { RoomState } from "../room_state.js";
import type { GameRoom } from "../game_room.js";
import type { ClientHandler } from "../client_handler.js";
import type { EditComputerData, PlayerWaitingData } from "../../../shared/bulider.js";
import { backgrounds } from "../data/backgrounds.js";

export class WaitingState implements RoomState {
    readonly phase: RoomPhase = "waiting";

    constructor(private room?: GameRoom, resetPlayers: boolean = false) {
        if (resetPlayers && room) {
            room.players.forEach(player => player.reset());
        }
    }

    updatePlayer(room: GameRoom, id: string, data: PlayerWaitingData) {
        let player = room.players.get(id);
        if (!player) return;
        player.update(data);
    }

    addComputerPlayer(room: GameRoom, handler: ClientHandler, name: string, color: string, team: number, difficulty: string) {
        room.addComputerPlayer(handler, name, color, team, difficulty);
    }

    removeComputerPlayer(room: GameRoom, id: string) {
        room.players.delete(id);
    }

    editComputerPlayer(room: GameRoom, id: string, data: EditComputerData) {
        room.editComputerPlayer(id, data);
    }

    updateBoard(room: GameRoom, width: number, height: number) {
        if (width < 10 || height < 10) return;
        room.boardX = width;
        room.boardY = height;
    }

    updateResources(room: GameRoom, resources: ResourceData) {
        room.startingResources = {
            gold: Math.max(0, Math.floor(resources.gold)),
            wood: Math.max(0, Math.floor(resources.wood)),
            stone: Math.max(0, Math.floor(resources.stone)),
        };
    }

    updateBackground(room: GameRoom, filename: string) {
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
