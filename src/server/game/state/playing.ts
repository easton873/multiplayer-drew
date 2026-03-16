import type { GeneralGameData, PosData, ReconnectData, RoomPhase } from "../../../shared/types.js";
import type { RoomState } from "../room_state.js";
import type { GameRoom } from "../game_room.js";
import { Game } from "../game.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { WaitingState } from "./waiting.js";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { emitGameOver, emitGameState, emitSpectatorGameState, emitUpgradeEraSuccess, emitWaitingRoomUpdate } from "../../../shared/client.js";

export const FRAME_RATE = 30;

export class PlayingState implements RoomState {
    readonly phase: RoomPhase = "playing";
    private intervalId: ReturnType<typeof setInterval>;

    constructor(
        private room: GameRoom,
        private game: Game,
        private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
        private playerClients: Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>,
    ) {
        console.log('starting game loop');
        this.intervalId = setInterval(() => this.tick(), 1000 / FRAME_RATE);
    }

    private tick() {
        this.game.mainLoop();

        this.game.players.forEach((player: Player) => {
            let tempClient = this.playerClients.get(player.getID());
            if (!tempClient) return;
            let data = this.game.gameData(player.getID());
            if (!data) return;
            emitGameState(tempClient, data);
        });

        this.game.spectators.forEach((id: string) => {
            let tempClient = this.playerClients.get(id);
            if (!tempClient) return;
            let data: GeneralGameData = this.game.generalGameData();
            if (!data) return;
            emitSpectatorGameState(tempClient, data);
        });

        if (!this.game.checkGameStillGoing()) {
            console.log('game over');
            clearInterval(this.intervalId);

            let winner = "No Winner";
            if (this.game.players.length == 1) {
                let id = this.game.players[0].getID();
                if (id) {
                    let p = this.room.players.get(id);
                    winner = p.getJoinData().name;
                }
            } else if (this.game.players.length > 1) {
                let player = this.game.players[0];
                winner = "Team " + player.getTeam();
            }

            this.room.reset();
            emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
            emitGameOver(this.io, winner);
        }
    }

    spawnUnit(playerId: string, pos: PosData, unitType: string) {
        let player = this.game.getPlayer(playerId);
        if (!player) return;
        player.NewUnit(unitType, new Pos(pos.x, pos.y));
    }

    deleteUnits(playerId: string, pos: PosData) {
        let player = this.game.getPlayer(playerId);
        if (!player) return;
        player.DeleteUnits(new Pos(pos.x, pos.y));
    }

    upgradeEra(playerId: string, client: any): boolean {
        let player = this.game.getPlayer(playerId);
        if (!player) return false;
        if (player.attemptUpgradeEra()) {
            emitUpgradeEraSuccess(client, player.era.getEraData());
            return true;
        }
        return false;
    }

    getGame(): Game {
        return this.game;
    }

    reconnectData(room: GameRoom, playerId: string): ReconnectData | null {
        if (this.game.spectators.includes(playerId)) {
            return {
                phase: "spectating",
                spectatorData: this.game.generalGameData(),
            };
        }
        const player = this.game.getPlayer(playerId);
        if (!player) return null;
        return {
            phase: "playing",
            eraData: player.era.getEraData(),
            gameData: this.game.gameData(playerId),
        };
    }
}
