import type { RoomPhase, ReconnectData, ResourceData } from "../../../shared/types.js";
import type { RoomState } from "../room_state.js";
import type { GameRoom, SetupPlayer } from "../game_room.js";
import { Game } from "../game.js";
import { Board } from "../board.js";
import { Pos } from "../pos.js";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { emitSetPosSuccess, emitStartSuccess, emitGameBuilt } from "../../../shared/client.js";
import { PlayingState } from "./playing.js";
import type { PosData } from "../../../shared/types.js";

export class PlacingState implements RoomState {
    readonly phase: RoomPhase = "setup";
    public currentlyPlacingId: string | null = null;

    constructor(
        private room: GameRoom,
        private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
        private playerClients: Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>,
        private callerId: string,
    ) {}

    init() {
        let player = this.getPoslessPlayer();
        this.currentlyPlacingId = player.getId();
        let data = this.room.setupData(this.callerId);
        data.placingPlayerName = player.getSetupData().name;
        data.placingPlayerColor = player.getSetupData().color;
        emitStartSuccess(this.io, data);
        player.findStartingPos(this.room.setupData(player.getClient().id));
    }

    submitPos(pos: PosData, id: string, callerClient: any) {
        this.room.players.get(id).setPos(Pos.FromPosData(pos));
        emitSetPosSuccess(callerClient);

        if (this.allPlayersHavePos()) {
            this.currentlyPlacingId = null;
            emitStartSuccess(this.io, this.room.setupData(id));
            let game = this.buildGame();
            game.players.forEach(player => {
                let tempClient = this.playerClients.get(player.getID());
                if (!tempClient) return;
                console.log('emit build success to', player.getID());
                emitGameBuilt(tempClient, player.era.getEraData());
            });
            const playingState = new PlayingState(this.room, game, this.io, this.playerClients);
            this.room.setState(playingState);
            return;
        }

        let nextPlayer = this.getPoslessPlayer();
        this.currentlyPlacingId = nextPlayer.getId();
        let data = this.room.setupData(id);
        data.placingPlayerName = nextPlayer.getSetupData().name;
        data.placingPlayerColor = nextPlayer.getSetupData().color;
        emitStartSuccess(this.io, data);
        nextPlayer.findStartingPos(this.room.setupData(nextPlayer.getClient().id));
    }

    reconnectData(room: GameRoom, playerId: string): ReconnectData | null {
        const setupData = room.setupData(playerId);
        if (this.currentlyPlacingId) {
            const placingPlayer = room.players.get(this.currentlyPlacingId);
            if (placingPlayer) {
                setupData.placingPlayerName = placingPlayer.getSetupData().name;
                setupData.placingPlayerColor = placingPlayer.getSetupData().color;
            }
        }
        return {
            phase: "setup",
            setupData,
            isYourTurn: this.currentlyPlacingId === playerId,
        };
    }

    private buildGame(): Game {
        let board = new Board(this.room.boardX, this.room.boardY);
        let players: any[] = [];
        this.room.players.forEach(player => {
            players.push(player.createPlayer(board, this.room.startingResources));
        });
        return new Game(players, board);
    }

    private getPoslessPlayer(): SetupPlayer {
        let players: SetupPlayer[] = [];
        this.room.players.forEach(player => {
            if (player.getPos() == null) {
                players.push(player);
            }
        });
        if (players.length == 0) {
            throw new Error("no posless players");
        }
        return players[Math.floor(Math.random() * players.length)];
    }

    private allPlayersHavePos(): boolean {
        let allHavePos = true;
        this.room.players.forEach(player => {
            if (player.getPos() == null) allHavePos = false;
        });
        return allHavePos;
    }
}
