import { Socket } from "socket.io-client";
import { GameSetupData, GameWaitingData, LoadData, PlayerSetupData, PlayerWaitingData } from "../shared/bulider";
import { ClientReceiver } from "../shared/client";
import { ScreenManager } from "./screen/manager";
import { DefaultEventsMap } from "socket.io";
import { emitDeleteUnits, emitSpawnUnit, emitSubmitStartPos } from "../shared/routes";
import { EraData, GameData, GeneralGameData, PosData } from "../shared/types";

export class FrontendClientHandler extends ClientReceiver {
    private latestData : GameSetupData;
    private mouseMoveSelectStartPos;
    private clickSelectStartPos;
    constructor(socket : Socket<DefaultEventsMap, DefaultEventsMap>, private manager : ScreenManager)  {
        super(socket);
    }
    handleJoinSuccess() {
        this.manager.toWaitingScreen();
    }
    handlePlayerWaitingInfo(data: PlayerWaitingData) {
        this.manager.waitingScreen.drawPlayerControls(data);
    }
    handleWaitingRoomUpdate(data: GameWaitingData) {
        this.manager.waitingScreen.drawPlayerList(data.players);
        this.manager.waitingScreen.fillComputerSelect(data.computerDifficulties);
        this.manager.waitingScreen.widthLabel.innerHTML = `Board Width: ${data.board.boardX}`;
        this.manager.waitingScreen.heightLabel.innerHTML = `Board Height: ${data.board.boardY}`;
    }
    handleStartSuccess(data: GameSetupData) {
        this.manager.toGameScreen();
        this.latestData = data;
        this.manager.gameScreen.setCanvasSize(data.boardX, data.boardY);
        this.manager.gameScreen.startSetupRenderLoop(data);
        this.manager.gameScreen.requestFullscreen();
        if (data.placingPlayerName) {
            this.manager.gameScreen.setupBanner.textContent = `${data.placingPlayerName}'s turn to place`;
            this.manager.gameScreen.setupBanner.classList.remove('hidden');
        } else {
            this.manager.gameScreen.setupBanner.classList.add('hidden');
        }
    }
    handleYourTurn(data: GameSetupData) {
        let gameScreen = this.manager.gameScreen;
        this.latestData = data;
        gameScreen.updateSetupData(data);
        let temp = (e : MouseEvent) => {
            const pos = gameScreen.screenToGame(e.clientX, e.clientY);
            gameScreen.setupPreview = { pos, color: data.currPlayer.color };
        };
        let temp2 = (e : MouseEvent) => {
            const pos = gameScreen.screenToGame(e.clientX, e.clientY);
            emitSubmitStartPos(this.socket, pos);
        };
        gameScreen.canvas.addEventListener('mousemove', temp);
        gameScreen.canvas.addEventListener('click', temp2);
        this.mouseMoveSelectStartPos = temp;
        this.clickSelectStartPos = temp2;
    }
    handleSetPosSuccess() {
        this.manager.gameScreen.canvas.removeEventListener('mousemove', this.mouseMoveSelectStartPos);
        this.manager.gameScreen.canvas.removeEventListener('click', this.clickSelectStartPos);
        this.manager.gameScreen.setupPreview = null;
    }
    handleEmitGamestate(gameInstance: GameData) {
        this.manager.gameScreen.stopSetupRenderLoop();
        this.manager.gameScreen.setupBanner.classList.add('hidden');
        this.manager.gameScreen.controls.style.display = "flex";
        this.manager.gameScreen.drawGame(gameInstance);
    }
    handleEmitSpectatorGameState(data: GeneralGameData) {
        this.manager.gameScreen.controls.style.display = "none";
        this.manager.gameScreen.drawGeneralGameData(data);
    }
    handleBuildSucces(era: EraData) {
        console.log('build success!');
        this.manager.gameScreen.upgradeEra(era);
    }
    handleEraUpgradeSuccess(era: EraData) {
        this.manager.gameScreen.upgradeEra(era);
    }
    handleGameOver(winner: string) {
        this.manager.toGameOverScreen();
        this.manager.gameOverScreen.displayWinner(winner);
    }
    handleLoadData(data: LoadData) {
        // this.manager.gameScreen.loadImages(data);
    }
}