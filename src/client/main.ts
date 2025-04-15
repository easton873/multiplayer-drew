import { GameData } from '../shared/types';
import { io } from 'socket.io-client';

const socket = io();
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

socket.on('gameState', (data : GameData) => {
  console.log(data);
});

// import { io } from 'socket.io-client';
// import { Player } from '../shared/types';

// const socket = io();
// const canvas = document.getElementById('game') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d')!;

// let players: Record<string, Player> = {};

// socket.on('players', (updatedPlayers) => {
//   players = updatedPlayers;
//   draw();
// });

// function draw() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   for (const id in players) {
//     const player = players[id];
//     ctx.fillStyle = id === socket.id ? 'blue' : 'red';
//     ctx.fillRect(player.x, player.y, 20, 20);
//   }
// }

// canvas.addEventListener('mousemove', (e) => {
//   const rect = canvas.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;
//   socket.emit('move', { x, y });
// });

