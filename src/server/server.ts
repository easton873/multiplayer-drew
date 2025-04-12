// import { clientHandler } from "./client_handler";

// const express = require('express');
// const app = express();

// const server = require('http').Server(app);
// const io = require('socket.io')(server, {
//         cors: {
//             origin: '*',
//         }
//     });

// const path = require('path');

// const PORT = process.env.PORT || 8080;

// app.use( express.static(path.resolve('./***path***/build/')));

// app.get('/', function(req : any, res : any) {
//     res.sendFile(path.resolve('./***path***/index.html'));
// });

// server.listen(PORT, ()=>{
//     console.log("Up and at 'em");
// });

// // const io = require('socket.io')({
// //     cors: {
// //         origin: '*',
// //     }
// // });

// io.on('connection', (client : any) => {
//     clientHandler.handleClientActions(client, io);
// });
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { GameBuilder } from './game_builder';
import { Game } from './game';
import { PlayerBuilder } from './player';
import { Pos } from './pos';
import { clientHandler } from './client_handler';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname, './frontend')));

io.on('connection', (client) => {
    client.join("0");
    clientHandler.handleClientActions(client, io);
    console.log('a user connected:', client.id);

//     client.on('draw', (data) => {
//     // Broadcast to all other clients
//     client.broadcast.emit('draw', data);
//   });

  client.on('disconnect', () => {
    console.log('user disconnected:', client.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const builder : GameBuilder = new GameBuilder();
const game : Game = builder.BuildGame(100, 100, [
    new PlayerBuilder(new Pos(10, 50)),
    new PlayerBuilder(new Pos(90, 50)),
]);

const FRAME_RATE = 10;

function startGameInterval(){
    const intervalId = setInterval(() => {
        game.mainLoop();
        emitGameState("0", game.gameData());
        //clearInterval(intervalId); end game line
    }, 1000 / FRAME_RATE);
}

function emitGameState(roomName, gameInstance) {
    io.sockets.in(roomName).
        emit('gameState', JSON.stringify(gameInstance));
}

startGameInterval();