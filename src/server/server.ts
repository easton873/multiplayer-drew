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

const builder : GameBuilder = new GameBuilder();
const game : Game = builder.BuildGame(500, 500, [
    new PlayerBuilder(new Pos(10, 50)),
    new PlayerBuilder(new Pos(90, 50)),
]);

const FRAME_RATE = 10;

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
  client.join("0");
  clientHandler.handleClientActions(client, io, game);

//     client.on('draw', (data) => {
//     // Broadcast to all other clients
//     client.broadcast.emit('draw', data);
//   });

client.on('disconnect', () => {
  console.log('user disconnected:', client.id);
});
});

// io.on('connection', (socket) => {
//   const newPlayer: Player = { id: socket.id, x: 0, y: 0 };
//   players[socket.id] = newPlayer;

//   io.emit('players', players);

//   socket.on('move', (pos: { x: number; y: number }) => {
//     players[socket.id].x = pos.x;
//     players[socket.id].y = pos.y;
//     io.emit('players', players);
//   });

//   socket.on('disconnect', () => {
//     delete players[socket.id];
//     io.emit('players', players);
//   });
// });

app.use(express.static(path.join(__dirname, '../../dist')));

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});

// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import path from 'path';
// import { Player } from '../shared/types';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// const players: Record<string, Player> = {};

// io.on('connection', (socket) => {
//   const newPlayer: Player = { id: socket.id, x: 0, y: 0 };
//   players[socket.id] = newPlayer;

//   io.emit('players', players);

//   socket.on('move', (pos: { x: number; y: number }) => {
//     players[socket.id].x = pos.x;
//     players[socket.id].y = pos.y;
//     io.emit('players', players);
//   });

//   socket.on('disconnect', () => {
//     delete players[socket.id];
//     io.emit('players', players);
//   });
// });

// app.use(express.static(path.join(__dirname, '../../dist')));

// server.listen(3000, () => {
//   console.log('Server listening on http://localhost:3000');
// });
