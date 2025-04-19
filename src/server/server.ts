import express from 'express';
import http from 'http';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import { Game } from './game/game.js';
import { GAME_INSTANCE_KEY } from '../shared/routes.js';
import { ClientHandler } from './game/client_handler.js';
import { GameRoom } from './game/game_room.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const server = http.createServer(app);
const io : Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = new Server(server);
const FRAME_RATE = 10;

const rooms : Map<string, GameRoom> = new Map<string, GameRoom>();
const playerLookup : Map<string, GameRoom> = new Map<string, GameRoom>();

function startGameInterval(){
    const intervalId = setInterval(() => {
        // game.mainLoop();
        // emitGameState("0", game.gameData());
        // if (!game.checkGameStillGoing()) {
        //   clearInterval(intervalId);
        // } 
    }, 1000 / FRAME_RATE);
}

function emitGameState(roomName, gameInstance) {
    io.sockets.in(roomName).
        emit(GAME_INSTANCE_KEY, gameInstance);
}

io.on('connection', (client : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  new ClientHandler(client, io, rooms, playerLookup);
});

app.use(express.static(path.join(__dirname, '../../dist')));

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
