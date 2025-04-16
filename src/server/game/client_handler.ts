import { CREATE_ROOM_KEY, DISCONNECT_KEY, JOIN_ROOM_KEY, JOIN_SUCCESS_KEY, PosData, UNIT_SPAWN_KEY, UPDGRADE_SUCCESS_KEY, UPGRADE_ERA_KEY } from "../../shared/types.js";
import { Era } from "./era.js";
import { Game } from "./game.js";
import { GameRoom, randomRoomID } from "./game_room.js";

class ClientHander {
    handleClientActions(client: any, io: any, games : Map<string, GameRoom>){
        let game : Game;
        console.log("guy connected");
        
        client.on(JOIN_ROOM_KEY, handleJoinGame);
        client.on(CREATE_ROOM_KEY, handleCreateGame);
        client.on(DISCONNECT_KEY, handlDisconnect);
        client.on(UNIT_SPAWN_KEY, handleSpawnUnit);
        client.on(UPGRADE_ERA_KEY, handleEraUpgrade);

        function handleCreateGame(name : string) {
            console.log("creating game");
            let roomCode = randomRoomID(4);
            let newGameRoom = new GameRoom(roomCode);
            games[roomCode] = newGameRoom;
            newGameRoom.addPlayer(name);
            client.join(roomCode);
            client.emit(JOIN_SUCCESS_KEY, games[roomCode]);
        }
    
        function handleJoinGame(roomCode : string, name : string){
            console.log("Client's id: " + client.id);
            client.join(roomCode);
            let currGame : GameRoom = games[roomCode];
            if (!currGame) {
                return;
            }
            client.join(roomCode);
            currGame.addPlayer(name);
            io.sockets.in(roomCode).emit(JOIN_SUCCESS_KEY, games[roomCode]);
        }
    
        function handlDisconnect(){
            console.log('client disconnected');
        }

        function handleSpawnUnit(pos : PosData, unitType : string) {
            if (!game) {
                return;
            }
            game.attemptPlaceUnit(pos, unitType);
        }

        function handleEraUpgrade() {
            if (!game) {
                return;
            }
            let era : Era = game.upgradeEra();
            client.emit(UPDGRADE_SUCCESS_KEY, era.getEraData())
        }
    }
    
}

const clientHandler : ClientHander = new ClientHander();
export {clientHandler};