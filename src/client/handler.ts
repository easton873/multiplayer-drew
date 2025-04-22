import { Socket } from "socket.io-client";
import { GameSetupData, GameWaitingData } from "../shared/bulider";
import { ClientReceiver } from "../shared/client";
import { ScreenManager } from "./screen/manager";
import { DefaultEventsMap } from "socket.io";

export class FrontendClientHandler extends ClientReceiver {
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
}