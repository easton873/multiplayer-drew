import { PlayerWaitingData } from "../../shared/bulider";

export class WaitingScreen {
    public div = document.getElementById("waitingScreen") as HTMLDivElement;
    public playerList = document.getElementById("playerList") as HTMLUListElement;
    public roomCodeLabel = document.getElementById("roomCodeLabel") as HTMLLabelElement;
    public startButton = document.getElementById("waitingStartButton") as HTMLButtonElement;

    drawListFirstTime(data : PlayerWaitingData[]) {
      this.playerList.innerHTML = '';
      data.forEach((p : PlayerWaitingData) => {
        const li = document.createElement('li');
        li.textContent = p.name;
        this.playerList.appendChild(li);
      })
    }
}