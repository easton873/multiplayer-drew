import { JOIN_ROOM_KEY, JOIN_SUCCESS_KEY, PosData, UNIT_SPAWN_KEY, UPDGRADE_SUCCESS_KEY, UPGRADE_ERA_KEY } from "../../shared/types.js";
import { Era } from "./era.js";
import { Game } from "./game.js";

class ClientHander {
    handleClientActions(client: any, io: any, game : Game){
        console.log("guy connected");
        
        client.on(JOIN_ROOM_KEY, handleJoinGame);
        client.on('disconnect', handlDisconnect);
        client.on(UNIT_SPAWN_KEY, handleSpawnUnit);
        client.on(UPGRADE_ERA_KEY, handleEraUpgrade);
    
        function handleJoinGame(roomCode : string){
            console.log("Client's id: " + client.id);
            client.join(roomCode);
            client.emit(JOIN_SUCCESS_KEY);
        }
    
        function handlDisconnect(){
            console.log('client disconnected');
        }

        function handleSpawnUnit(pos : PosData, unitType : string) {
            game.attemptPlaceUnit(pos, unitType);
        }

        function handleEraUpgrade() {
            let era : Era = game.upgradeEra();
            client.emit(UPDGRADE_SUCCESS_KEY, era.getEraData())
        }
    }
    
}

const clientHandler : ClientHander = new ClientHander();
export {clientHandler};