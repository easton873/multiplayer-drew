class ClientHander {
    handleClientActions(client: any, io: any){
        console.log("guy connected");
        
        client.on('joinGame', handleJoinGame);
        client.on('disconnect', handlDisconnect);
    
        function handleJoinGame(roomCode : string){
            console.log("Client's id: " + client.id);
            client.join(roomCode);
        }
    
        function handlDisconnect(){
            console.log('client disconnected');
        }

    }
}

const clientHandler : ClientHander = new ClientHander();
export {clientHandler};