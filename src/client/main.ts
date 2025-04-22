import { emitCreateRoom, emitEraUpgrade, emitJoinRoom, emitSpawnUnit, emitStartGme, GAME_INSTANCE_KEY, UPDGRADE_SUCCESS_KEY } from '../shared/routes';
import { GameWaitingData, PlayerWaitingData, PlayerSetupData } from '../shared/bulider';
import { EraData, GameData, MERCHANT_NAME, PosData, SOLDIER_NAME, UnitData } from '../shared/types';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io';
import { ScreenManager } from './screen/manager';
import { ClientReceiver } from '../shared/client';
import { FrontendClientHandler } from './handler';

const socket : Socket<DefaultEventsMap, DefaultEventsMap> = io();
const manager : ScreenManager = new ScreenManager();
const clientHandler : ClientReceiver = new FrontendClientHandler(socket, manager);

manager.joinScreen.joinButton.onclick = joinRoom;
manager.joinScreen.createButton.onclick = createRoom;
manager.waitingScreen.startButton.onclick = startGame;
manager.gameScreen.upgradeButton.onclick = attemptUpgradeEra;

function joinRoom() {
  emitJoinRoom(socket, manager.joinScreen.roomInput.value, manager.joinScreen.nameInput.value);
}

function createRoom() {
  emitCreateRoom(socket, manager.joinScreen.nameInput.value);
}

function startGame() {
  emitStartGme(socket);
}

manager.gameScreen.canvas.addEventListener('click', handleClick);

// socket.on(GAME_INSTANCE_KEY, drawGame);
// socket.on(UPDGRADE_SUCCESS_KEY, upgradeEra);

function handleClick(event) {
  const rect = manager.gameScreen.canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / manager.gameScreen.SIZE);
  const y = Math.floor((event.clientY - rect.top) / manager.gameScreen.SIZE);
  const posData : PosData = {x:x, y:y};
  emitSpawnUnit(socket, posData, manager.gameScreen.unitSelect.value);
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
  emitEraUpgrade(socket);
}

function upgradeEra(era : EraData) {
  fillSelect(manager.gameScreen.unitSelect, era.availableUnits);
  manager.gameScreen.eraNameLabel.innerText = 'Era: ' + era.eraName;
  manager.gameScreen.nextEraLabel.innerText = 'Next Era Cost:' + era.nextEraCost.gold + 'g' + era.nextEraCost.wood + 'w' + era.nextEraCost.stone + 's'
}
