import { GameSetupData, PlayerSetupData } from '../shared/bulider';
import { CREATE_ROOM_KEY, EraData, GAME_INSTANCE_KEY, GameData, JOIN_ROOM_KEY, JOIN_SUCCESS_KEY, MERCHANT_NAME, PosData, SOLDIER_NAME, UNIT_SPAWN_KEY, UnitData, UPDGRADE_SUCCESS_KEY, UPGRADE_ERA_KEY } from '../shared/types';
import { io } from 'socket.io-client';

const socket = io();

// join room screen
const formScreen = document.getElementById("formScreen") as HTMLDivElement;
const roomInput = document.getElementById("roomInput") as HTMLInputElement;
const nameInput = document.getElementById("nameInput") as HTMLInputElement;
const joinButton = document.getElementById("joinButton") as HTMLButtonElement;
const createButton = document.getElementById("createButton") as HTMLButtonElement;

joinButton.onclick = joinRoom;
createButton.onclick = createRoom;

function joinRoom() {
  socket.emit(JOIN_ROOM_KEY, roomInput.value, nameInput.value);
}

function createRoom() {
  socket.emit(CREATE_ROOM_KEY, nameInput.value);
}

socket.on(JOIN_SUCCESS_KEY, joinSuccess);
function joinSuccess(data : GameSetupData) {
  console.log(data);
  toWaitingScreen();
  drawListFirstTime(data.players);
  roomCodeLabel.innerText = "Room Code: " + data.roomCode;
}

// waiting screen
const waitingScreen = document.getElementById("waitingScreen") as HTMLDivElement;
const playerList = document.getElementById("playerList") as HTMLUListElement;
const roomCodeLabel = document.getElementById("roomCodeLabel") as HTMLLabelElement;

function drawListFirstTime(data : PlayerSetupData[]) {
  playerList.innerHTML = '';
  data.forEach((p : PlayerSetupData) => {
    const li = document.createElement('li');
    li.textContent = p.name;
    playerList.appendChild(li);
  })
}

// game screen
const gameScreen = document.getElementById("gameScreen")!;
const canvas = document.getElementById('game') as HTMLCanvasElement;
const resourceLabel = document.getElementById('resourceLabel') as HTMLLabelElement;
const unitSelect = document.getElementById('unitSelect') as HTMLSelectElement;
const upgradeButton = document.getElementById('upgradeButton') as HTMLButtonElement;
const eraNameLabel = document.getElementById('eraNameLabel') as HTMLLabelElement;
const nextEraLabel = document.getElementById('nextEraLabel') as HTMLLabelElement;
const ctx = canvas.getContext('2d')!;

upgradeButton.onclick = attemptUpgradeEra;
gameScreen.style.display = "none";
waitingScreen.style.display = "none";
formScreen.style.display = "flex";

const SIZE : number = 10;

canvas.addEventListener('click', handleClick);

socket.on(GAME_INSTANCE_KEY, drawGame);
socket.on(UPDGRADE_SUCCESS_KEY, upgradeEra);

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
  removeOptions(selectElement);
  units.forEach(unitType => {
    const optionElement = document.createElement('option');
    optionElement.value = unitType;
    optionElement.text = unitType;
    selectElement.add(optionElement);
  });
}

function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for(i = L; i >= 0; i--) {
     selectElement.remove(i);
  }
}

function attemptUpgradeEra() {
  socket.emit(UPGRADE_ERA_KEY);
}

function upgradeEra(era : EraData) {
  fillSelect(unitSelect, era.availableUnits);
  eraNameLabel.innerText = 'Era: ' + era.eraName;
  nextEraLabel.innerText = 'Next Era Cost:' + era.nextEraCost.gold + 'g' + era.nextEraCost.wood + 'w' + era.nextEraCost.stone + 's'
}

function toWaitingScreen() {
  waitingScreen.style.display = "flex";
  formScreen.style.display = "none";
}

function toGameScreen() {
  waitingScreen.style.display = "none";
  gameScreen.style.display = "inline";
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

