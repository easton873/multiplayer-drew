import { emitCreateRoom, emitEraUpgrade, emitJoinRoom, emitStartGme } from '../shared/routes';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io';
import { ScreenManager } from './screen/manager';
import { ClientReceiver } from '../shared/client';
import { FrontendClientHandler } from './handler';

const socket : Socket<DefaultEventsMap, DefaultEventsMap> = io();
const manager : ScreenManager = new ScreenManager(socket);
const clientHandler : ClientReceiver = new FrontendClientHandler(socket, manager);

// Ensure form screen is shown by default
manager.joinScreen.div.style.display = "flex";
manager.waitingScreen.div.style.display = "none";
manager.gameScreen.div.style.display = "none";

// Debug logging
console.log("🔵 Initial screen setup:");
console.log("Form screen display:", manager.joinScreen.div.style.display);
console.log("Waiting screen display:", manager.waitingScreen.div.style.display);
console.log("Game screen display:", manager.gameScreen.div.style.display);
console.log("Form screen div:", manager.joinScreen.div);
console.log("Waiting screen div:", manager.waitingScreen.div);
console.log("Game screen div:", manager.gameScreen.div);

// Add a small delay to ensure DOM is ready
setTimeout(() => {
    console.log("🔵 After delay - checking screen states:");
    console.log("Form screen display:", manager.joinScreen.div.style.display);
    console.log("Waiting screen display:", manager.waitingScreen.div.style.display);
    console.log("Game screen display:", manager.gameScreen.div.style.display);
}, 100);

// Main screen buttons
manager.joinScreen.joinButton.onclick = showJoinModal;
manager.joinScreen.createButton.onclick = createRoom;

// Modal buttons
manager.joinScreen.confirmJoinButton.onclick = joinRoom;
manager.joinScreen.cancelJoinButton.onclick = hideJoinModal;

// Other screen buttons
manager.waitingScreen.startButton.onclick = startGame;
manager.gameScreen.upgradeButton.onclick = attemptUpgradeEra;

// Handle Enter key in room input
manager.joinScreen.roomInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinRoom();
    }
});

function showJoinModal() {
    // Validate name and color are filled
    if (!manager.joinScreen.nameInput.value.trim()) {
        alert('Please enter your name first');
        manager.joinScreen.nameInput.focus();
        return;
    }
    manager.joinScreen.showRoomCodeModal();
}

function hideJoinModal() {
    manager.joinScreen.hideRoomCodeModal();
}

function joinRoom() {
    const roomCode = manager.joinScreen.roomInput.value.trim();
    if (!roomCode) {
        alert('Please enter a room code');
        manager.joinScreen.roomInput.focus();
        return;
    }
    
    emitJoinRoom(socket, roomCode, manager.joinScreen.nameInput.value, manager.joinScreen.colorSelect.value);
    hideJoinModal();
}

function createRoom() {
    if (!manager.joinScreen.nameInput.value.trim()) {
        alert('Please enter your name first');
        manager.joinScreen.nameInput.focus();
        return;
    }
    emitCreateRoom(socket, manager.joinScreen.nameInput.value, manager.joinScreen.colorSelect.value);
}

function startGame() {
  emitStartGme(socket);
}

// socket.on(GAME_INSTANCE_KEY, drawGame);
// socket.on(UPDGRADE_SUCCESS_KEY, upgradeEra);

function attemptUpgradeEra() {
  emitEraUpgrade(socket);
}
