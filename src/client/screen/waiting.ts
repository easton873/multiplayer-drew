import { emitUpdateSetupPlayer } from "../../shared/routes";
import { PlayerWaitingData } from "../../shared/bulider";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io";

export class WaitingScreen {
    public div = document.getElementById("waitingScreen") as HTMLDivElement;
    public playerList = document.getElementById("playerList") as HTMLUListElement;
    public roomCodeLabel = document.getElementById("roomCodeLabel") as HTMLLabelElement;
    public startButton = document.getElementById("waitingStartButton") as HTMLButtonElement;
    public widthInput = document.getElementById("widthInput") as HTMLInputElement;
    public heightInput = document.getElementById("heightInput") as HTMLInputElement;

    public waitingPlayerControls = document.getElementById("playerControlsDiv") as HTMLDivElement;

    constructor(private socket : Socket<DefaultEventsMap, DefaultEventsMap>) {}

    drawPlayerControls(p : PlayerWaitingData) {
      this.waitingPlayerControls.innerHTML = '';
      const playerNameLabel = document.createElement('label');
      playerNameLabel.innerText = p.name;
      // <input id="colorInput" type="color">
      const colorSelect = document.createElement('input');
      colorSelect.type = "color";
      colorSelect.value = p.color;
      colorSelect.onchange = () => {
        p.color = colorSelect.value;
        emitUpdateSetupPlayer(this.socket, p);
      }

      const teamInput = document.createElement('input');
      teamInput.type = "number";
      teamInput.onkeyup = () => {
        let team = null;
        if (teamInput.value != "") {
          team = parseInt(teamInput.value);
          if (Number.isNaN(team)) {
            team = null;
          }
        }
        p.team = team;
        emitUpdateSetupPlayer(this.socket, p);
      };

      const span = document.createElement('span');
      span.appendChild(playerNameLabel);
      span.appendChild(colorSelect);
      span.appendChild(teamInput);

      this.waitingPlayerControls.appendChild(span);
    }

    drawPlayerList(data : PlayerWaitingData[]) {
      this.playerList.innerHTML = '';
      data.forEach((p : PlayerWaitingData) => {
        const playerNameLabel = document.createElement('label');
        playerNameLabel.innerText = p.name;
        // <input id="colorInput" type="color">
        const colorSelect = document.createElement('input');
        colorSelect.type = "color";
        colorSelect.value = p.color;
        colorSelect.disabled = true;

        const teamLabel = document.createElement('label');
        teamLabel.innerText = p.team ? p.team.toString() : "";

        const span = document.createElement('span');
        span.appendChild(playerNameLabel);
        span.appendChild(colorSelect);
        span.appendChild(teamLabel);

        const li = document.createElement('li');
        li.appendChild(span);
        this.playerList.appendChild(li);
      })
    }
}