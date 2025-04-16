import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import { PlayerBuilder } from './game/player.js';
import { GameBuilder } from './game/game_builder.js';
import { Pos } from './game/pos.js';
import { Game } from './game/game.js';
import { GAME_INSTANCE_KEY } from '../shared/types.js';
import { clientHandler } from './game/client_handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const FRAME_RATE = 10;

const builder : GameBuilder = new GameBuilder();
const game : Game = builder.BuildGame(500, 500, [
    new PlayerBuilder(new Pos(10, 50)),
    new PlayerBuilder(new Pos(90, 50)),
]);

function startGameInterval(){
    const intervalId = setInterval(() => {
        game.mainLoop();
        emitGameState("0", game.gameData());
        if (!game.checkGameStillGoing()) {
          clearInterval(intervalId);
        } 
    }, 1000 / FRAME_RATE);
}

function emitGameState(roomName, gameInstance) {
    io.sockets.in(roomName).
        emit(GAME_INSTANCE_KEY, gameInstance);
}

startGameInterval();

io.on('connection', (client) => {
  clientHandler.handleClientActions(client, io, game);
});

app.use(express.static(path.join(__dirname, '../../dist')));

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
