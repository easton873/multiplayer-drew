import type { RoomPhase, ReconnectData } from "../../shared/types.js";
import type { GameRoom } from "./game_room.js";

export interface RoomState {
    readonly phase: RoomPhase;
    reconnectData(room: GameRoom, playerId: string): ReconnectData | null;
}
