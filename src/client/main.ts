import { GameData, UnitData } from '../shared/types';
import { io } from 'socket.io-client';

const socket = io();
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const SCALER : number = 4;
const SIZE : number = 10;

socket.on('gameState', (data : GameData) => {
  ctx.canvas.height = data.board.height * SCALER + SIZE;
  ctx.canvas.width = data.board.width * SCALER + SIZE;
  data.units.forEach((unit : UnitData) => {
    drawUnit(unit);
  });
});

function drawUnit(unit : UnitData) {
  let x : number = unit.pos.x * SCALER;
  let y : number = unit.pos.y * SCALER;
  ctx.fillStyle = 'black';
  ctx.fillRect(x, y, SIZE, SIZE);
}

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

