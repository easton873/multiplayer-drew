import express from 'express';
import http from 'http';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { networkInterfaces } from 'os';
import { exec } from 'child_process';

import { ClientHandler } from './game/client_handler.js';
import { GameRoom } from './game/game_room.js';

// import.meta.url is undefined in CJS/pkg bundles; fall back to process.argv[1]
const _filename = import.meta.url
  ? fileURLToPath(import.meta.url)
  : path.resolve(process.argv[1]);
const _dirname = path.dirname(_filename);


const app = express();
const server = http.createServer(app);
const io : Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = new Server(server);

const room : GameRoom = new GameRoom();

// to get the client associated with the player
const playerClients : Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>> = new Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>();

io.on('connection', (client : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  new ClientHandler(client, io, room, playerClients);
});

const isDevMode = _filename.endsWith('.ts');
const distPath = isDevMode
  ? path.join(_dirname, '../../dist')   // ts-node: _dirname = src/server/
  : path.join(_dirname, 'dist');         // pkg/bundle: _dirname = project root
app.use(express.static(distPath));

function getLanIP(): string | null {
  for (const nets of Object.values(networkInterfaces())) {
    for (const net of nets ?? []) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return null;
}

server.listen(3000, () => {
  const lanIP = getLanIP();
  console.log('\nMultiplayer Drew is running!');
  console.log('  Your browser:  http://localhost:3000');
  if (lanIP) console.log(`  LAN friends:   http://${lanIP}:3000`);
  console.log('\nPress Ctrl+C to stop.\n');

  if (!isDevMode) {
    const url = 'http://localhost:3000';
    const cmd = process.platform === 'win32' ? `start ${url}`
              : process.platform === 'darwin' ? `open ${url}`
              : `xdg-open ${url}`;
    exec(cmd);
  }
});
