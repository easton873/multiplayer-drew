import express from 'express';
import http from 'http';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import { ClientHandler } from './game/client_handler.js';
import { GameRoom } from './game/game_room.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const server = http.createServer(app);
const io : Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = new Server(server);

const room : GameRoom = new GameRoom();

// to get the client associated with the player
const playerClients : Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>> = new Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>();

io.on('connection', (client : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  new ClientHandler(client, io, room, playerClients);
});

app.use(express.static(path.join(__dirname, '../../dist')));

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
