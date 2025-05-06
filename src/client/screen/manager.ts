import { Socket } from "socket.io-client";
import { GameScreen } from "./game";
import { JoinScreen } from "./join";
import { WaitingScreen } from "./waiting";
import { DefaultEventsMap } from "socket.io";

export class ScreenManager {
    public joinScreen : JoinScreen
    public waitingScreen : WaitingScreen
    public gameScreen : GameScreen
    constructor(socket : Socket<DefaultEventsMap, DefaultEventsMap>) {
        this.joinScreen = new JoinScreen();
        this.waitingScreen = new WaitingScreen(socket);
        this.gameScreen = new GameScreen();

        this.gameScreen.div.style.display = "none";
        this.waitingScreen.div.style.display = "none";
        this.joinScreen.div.style.display = "flex";
    }

    toWaitingScreen() {
        this.waitingScreen.div.style.display = "flex";
        this.joinScreen.div.style.display = "none";
      }
      
      toGameScreen() {
        this.gameScreen.div.style.display = "inline";
        this.waitingScreen.div.style.display = "none";
      }
}