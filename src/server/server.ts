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

const rooms : Map<string, GameRoom> = new Map<string, GameRoom>();
const playerLookup : Map<string, GameRoom> = new Map<string, GameRoom>();
const playerClients : Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>> = new Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>();

io.on('connection', (client : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  new ClientHandler(client, io, rooms, playerLookup, playerClients);
});

// Fix the path to serve static files from the correct location
app.use(express.static(path.join(__dirname, '../../dist')));

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
