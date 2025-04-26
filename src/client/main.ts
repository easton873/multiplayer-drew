import { emitCreateRoom, emitEraUpgrade, emitJoinRoom, emitStartGme } from '../shared/routes';
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

// socket.on(GAME_INSTANCE_KEY, drawGame);
// socket.on(UPDGRADE_SUCCESS_KEY, upgradeEra);

function attemptUpgradeEra() {
  emitEraUpgrade(socket);
}
