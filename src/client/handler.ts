import { Socket } from "socket.io-client";
import { GameSetupData, GameWaitingData } from "../shared/bulider";
import { ClientReceiver } from "../shared/client";
import { ScreenManager } from "./screen/manager";
import { DefaultEventsMap } from "socket.io";
import { emitSubmitStartPos } from "../shared/routes";

export class FrontendClientHandler extends ClientReceiver {
    private mouseMoveSelectStartPos;
    private clickSelectStartPos;
    constructor(socket : Socket<DefaultEventsMap, DefaultEventsMap>, private manager : ScreenManager)  {
        super(socket);
    }
    handleJoinSuccess(data: GameWaitingData) {
        this.manager.toWaitingScreen();
        this.manager.waitingScreen.drawListFirstTime(data.players);
        this.manager.waitingScreen.roomCodeLabel.innerText = "Room Code: " + data.roomCode;
    }
    handleStartSuccess(data: GameSetupData) {
        console.log(data);
        this.manager.toGameScreen();
        this.manager.gameScreen.setCanvasSize(data.boardX, data.boardY);
    }
    handleYourTurn(data: GameSetupData) {
        let gameScreen = this.manager.gameScreen;
        let ctx = gameScreen.ctx;
        let temp = (e : MouseEvent) => {
            const offset = gameScreen.SIZE / 2;
            const rect = gameScreen.canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, gameScreen.canvas.width, gameScreen.canvas.height);
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            let gameX = Math.floor(x / gameScreen.SIZE);
            let gameY = Math.floor(y / gameScreen.SIZE);
            let drawX = gameX * gameScreen.SIZE;
            let drawY = gameY * gameScreen.SIZE;
            ctx.fillRect(drawX, drawY, gameScreen.SIZE, gameScreen.SIZE);
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
        this.clickSelectStartPos = temp;
    }
    handleSetPosSuccess() {
        this.manager.gameScreen.canvas.removeEventListener('mousemove', this.mouseMoveSelectStartPos);
        this.manager.gameScreen.canvas.removeEventListener('click', this.clickSelectStartPos);
    }
}