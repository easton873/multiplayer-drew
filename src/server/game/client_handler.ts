import { PosData, UNIT_SPAWN_KEY } from "../../shared/types.js";
import { Game } from "./game.js";

class ClientHander {
    handleClientActions(client: any, io: any, game : Game){
        console.log("guy connected");
        
        client.on('joinGame', handleJoinGame);
        client.on('disconnect', handlDisconnect);
        client.on(UNIT_SPAWN_KEY, handleSpawnUnit);
    
        function handleJoinGame(roomCode : string){
            console.log("Client's id: " + client.id);
            client.join(roomCode);
        }
    
        function handlDisconnect(){
            console.log('client disconnected');
        }

        function handleSpawnUnit(pos : PosData, unitType : string) {
            game.attemptPlaceUnit(pos, unitType);
        }
    }
    
}

const clientHandler : ClientHander = new ClientHander();
export {clientHandler};