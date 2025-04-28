import { Socket } from "socket.io-client";
import { GameSetupData, GameWaitingData, PlayerSetupData } from "../shared/bulider";
import { ClientReceiver } from "../shared/client";
import { ScreenManager } from "./screen/manager";
import { DefaultEventsMap } from "socket.io";
import { emitSpawnUnit, emitSubmitStartPos } from "../shared/routes";
import { EraData, GameData, PosData } from "../shared/types";

export class FrontendClientHandler extends ClientReceiver {
    private latestData : GameSetupData;
    private mouseMoveSelectStartPos;
    private clickSelectStartPos;
    private unitPlaceFn;
    constructor(socket : Socket<DefaultEventsMap, DefaultEventsMap>, private manager : ScreenManager)  {
        super(socket);
    }
    handleJoinSuccess(data: GameWaitingData) {
        this.manager.toWaitingScreen();
        this.manager.waitingScreen.drawListFirstTime(data.players);
        this.manager.waitingScreen.roomCodeLabel.innerText = "Room Code: " + data.roomCode;
    }
    handleStartSuccess(data: GameSetupData) {
        this.manager.toGameScreen();
        this.latestData = data;
        this.manager.gameScreen.setCanvasSize(data.boardX, data.boardY);
        this.manager.gameScreen.drawSetupGame(this.latestData);
    }
    handleYourTurn(data: GameSetupData) {
        let gameScreen = this.manager.gameScreen;
        let ctx = gameScreen.ctx;
        let temp = (e : MouseEvent) => {
            const offset = gameScreen.SIZE / 2;
            const rect = gameScreen.canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, gameScreen.canvas.width, gameScreen.canvas.height);
            this.manager.gameScreen.drawSetupGame(this.latestData);
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            let gameX = Math.floor(x / gameScreen.SIZE);
            let gameY = Math.floor(y / gameScreen.SIZE);
            let drawX = gameX * gameScreen.SIZE;
            let drawY = gameY * gameScreen.SIZE;
            this.manager.gameScreen.drawUnitByPos({x: gameX, y: gameY});
            ctx.beginPath();
            let radius = 3;
            ctx.arc(drawX + offset, drawY + offset, radius * gameScreen.SIZE, 0, 2 * Math.PI);
            ctx.stroke();
        };
        let temp2 = (e : MouseEvent) => {
            const rect = gameScreen.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            let gameX = Math.floor(x / gameScreen.SIZE);
            let gameY = Math.floor(y / gameScreen.SIZE);
            emitSubmitStartPos(this.socket, {x: gameX, y: gameY});
        };
        this.manager.gameScreen.canvas.addEventListener('mousemove', temp);
        this.manager.gameScreen.canvas.addEventListener('click', temp2);
        this.mouseMoveSelectStartPos = temp;
        this.clickSelectStartPos = temp2;
    }
    handleSetPosSuccess() {
        this.manager.gameScreen.canvas.removeEventListener('mousemove', this.mouseMoveSelectStartPos);
        this.manager.gameScreen.canvas.removeEventListener('click', this.clickSelectStartPos);
    }
    handleEmitGamestate(gameInstance: GameData, team : number) {
        this.manager.gameScreen.drawGame(gameInstance, team);
    }
    handleBuildSucces(era: EraData) {
        console.log('build success!');
        this.manager.gameScreen.upgradeEra(era);
        let temp = (event) => {
            console.log('attempting to place unit');
            const rect = this.manager.gameScreen.canvas.getBoundingClientRect();
            const x = Math.floor((event.clientX - rect.left) / this.manager.gameScreen.SIZE);
            const y = Math.floor((event.clientY - rect.top) / this.manager.gameScreen.SIZE);
            const posData : PosData = {x:x, y:y};
            emitSpawnUnit(this.socket, posData, this.manager.gameScreen.unitSelect.value);
          }
        this.manager.gameScreen.canvas.addEventListener('click', temp);
        this.unitPlaceFn = temp;
    }
    handleEraUpgradeSuccess(era: EraData) {
        this.manager.gameScreen.upgradeEra(era);
    }
}