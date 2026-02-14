import { Socket } from "socket.io-client";
import { GameScreen } from "./game";
import { JoinScreen } from "./join";
import { WaitingScreen } from "./waiting";
import { DefaultEventsMap } from "socket.io";
import { GameOverScreen } from "./game_over";

export class ScreenManager {
    public joinScreen : JoinScreen
    public waitingScreen : WaitingScreen
    public gameScreen : GameScreen
    public gameOverScreen : GameOverScreen
    constructor(socket : Socket<DefaultEventsMap, DefaultEventsMap>) {
      this.joinScreen = new JoinScreen();
      this.waitingScreen = new WaitingScreen(socket);
      this.gameScreen = new GameScreen(socket);
      this.gameOverScreen = new GameOverScreen(this);

      this.hideAll();
      this.joinScreen.div.style.display = "flex";
    }

    toWaitingScreen() {
      this.hideAll();
      this.waitingScreen.div.style.display = "flex";
    }
      
    toGameScreen() {
      this.hideAll();
      this.gameScreen.div.style.display = "flex";
      this.gameScreen.controls.style.display = "none";
    }

    toGameOverScreen() {
      this.hideAll();
      this.gameOverScreen.div.style.display = "flex";
    }

    hideAll() {
      this.joinScreen.div.style.display = "none";
      this.waitingScreen.div.style.display = "none";
      this.gameScreen.div.style.display = "none";
      this.gameOverScreen.div.style.display = "none";
    }
}