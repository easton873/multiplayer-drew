import { GAME_INSTANCE_KEY, GameData, MERCHANT_NAME, PosData, SOLDIER_NAME, UNIT_SPAWN_KEY, UnitData } from '../shared/types';
import { io } from 'socket.io-client';

const socket = io();
const canvas = document.getElementById('game') as HTMLCanvasElement;
const resourceLabel = document.getElementById('resourceLabel') as HTMLLabelElement;
const unitSelect = document.getElementById('unitSelect') as HTMLSelectElement;
const ctx = canvas.getContext('2d')!;

const SIZE : number = 10;

fillSelect(unitSelect, [
  SOLDIER_NAME,
  MERCHANT_NAME,
]);

canvas.addEventListener('click', handleClick);

socket.on(GAME_INSTANCE_KEY, drawGame);

function drawGame(data : GameData) {
  resourceLabel.innerText = 'Gold: ' + data.resources.gold + ' Wood: ' + data.resources.wood + ' Stone: ' + data.resources.stone;
  ctx.canvas.height = data.board.height * SIZE + SIZE;
  ctx.canvas.width = data.board.width * SIZE + SIZE;
  data.units.forEach((unit : UnitData) => {
    drawUnit(unit);
  });
}

function drawUnit(unit : UnitData) {
  let x : number = unit.pos.x * SIZE;
  let y : number = unit.pos.y * SIZE;
  ctx.fillStyle = 'black';
  ctx.fillRect(x, y, SIZE, SIZE);
}

function handleClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / SIZE);
  const y = Math.floor((event.clientY - rect.top) / SIZE);
  const posData : PosData = {x:x, y:y};
  socket.emit(UNIT_SPAWN_KEY, posData, unitSelect.value);
}

function fillSelect(selectElement : HTMLSelectElement, units : string[]) {
  units.forEach(unitType => {
    const optionElement = document.createElement('option');
    optionElement.value = unitType;
    optionElement.text = unitType;
    selectElement.add(optionElement);
  });
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

