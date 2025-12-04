import { emitEraUpgrade, emitJoinRoom, emitStartGme } from '../shared/routes';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io';
import { ScreenManager } from './screen/manager';
import { ClientReceiver } from '../shared/client';
import { FrontendClientHandler } from './handler';

const socket : Socket<DefaultEventsMap, DefaultEventsMap> = io();
const manager : ScreenManager = new ScreenManager(socket);
const clientHandler : ClientReceiver = new FrontendClientHandler(socket, manager);

manager.joinScreen.joinButton.onclick = joinRoom;
manager.waitingScreen.startButton.onclick = startGame;
manager.gameScreen.upgradeButton.onclick = attemptUpgradeEra;

function joinRoom() {
  emitJoinRoom(socket, manager.joinScreen.nameInput.value, manager.joinScreen.colorSelect.value);
}

function startGame() {
  emitStartGme(socket);
}

// socket.on(GAME_INSTANCE_KEY, drawGame);
// socket.on(UPDGRADE_SUCCESS_KEY, upgradeEra);

function attemptUpgradeEra() {
  emitEraUpgrade(socket);
}