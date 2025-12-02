import { Socket } from "socket.io-client";
import { GameSetupData, GameWaitingData, PlayerSetupData, PlayerWaitingData } from "../shared/bulider";
import { ClientReceiver } from "../shared/client";
import { ScreenManager } from "./screen/manager";
import { DefaultEventsMap } from "socket.io";
import { emitDeleteUnits, emitSpawnUnit, emitSubmitStartPos } from "../shared/routes";
import { EraData, GameData, PosData } from "../shared/types";
import { isDelete } from "./main";

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
        this.manager.waitingScreen.drawPlayerList(data.players);
    }
    handlePlayerWaitingInfo(data: PlayerWaitingData) {
        console.log(data);
        this.manager.waitingScreen.drawPlayerControls(data);
    }
    handleWaitingRoomUpdate(data: GameWaitingData) {
        console.log(data);
        this.manager.waitingScreen.drawPlayerList(data.players);
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
            this.manager.gameScreen.drawUnitByPos({x: gameX, y: gameY}, data.currPlayer.color);
            this.manager.gameScreen.drawCircle(gameX, gameY, 3, data.currPlayer.color);
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
            const rect = this.manager.gameScreen.canvas.getBoundingClientRect();
            const x = Math.floor((event.clientX - rect.left) / this.manager.gameScreen.SIZE);
            const y = Math.floor((event.clientY - rect.top) / this.manager.gameScreen.SIZE);
            const posData : PosData = {x:x, y:y};
            if (isDelete) {
                emitDeleteUnits(this.socket, posData);
            } else {
                console.log('attempting to place unit');
                emitSpawnUnit(this.socket, posData, this.manager.gameScreen.getUnitSelect().name);
            }
          }
        this.manager.gameScreen.canvas.addEventListener('click', temp);
        this.unitPlaceFn = temp;
    }
    handleEraUpgradeSuccess(era: EraData) {
        this.manager.gameScreen.upgradeEra(era);
    }
}