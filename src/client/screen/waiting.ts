import { emitAddComputer, emitBoardUpdate, emitUpdateSetupPlayer } from "../../shared/routes";
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
    public widthLabel = document.getElementById("widthLabel") as HTMLLabelElement;
    public heightLabel = document.getElementById("heightLabel") as HTMLLabelElement;
    public addComputerDiv = document.getElementById("addComputerDiv") as HTMLDivElement;
    public addComputerButton = document.getElementById("addComputerButton") as HTMLButtonElement;
    public addComputerName = document.getElementById("addComputerName") as HTMLInputElement;
    public addComputerTeam = document.getElementById("addComputerTeam") as HTMLInputElement;
    public addComputerColor = document.getElementById("addComputerColor") as HTMLInputElement;

    public waitingPlayerControls = document.getElementById("playerControlsDiv") as HTMLDivElement;

    constructor(private socket : Socket<DefaultEventsMap, DefaultEventsMap>) {
      this.widthInput.value = "100";
      this.heightInput.value = "100";

      this.addComputerButton.onclick = () => {
        let team = parseInt(this.addComputerTeam.value);
        if (Number.isNaN(team)) {
          return;
        }
        emitAddComputer(this.socket, {
          name: this.addComputerName.value,
          team:  team,
          color: this.addComputerColor.value,
          difficulty: "",
        });
      };
    }

    drawPlayerControls(p : PlayerWaitingData) {
      if (!p.leader) {
        this.startButton.style.display = "none";
        this.widthInput.style.display = "none";
        this.heightInput.style.display = "none";
        this.addComputerDiv.style.display = "none";
      }

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
      };

      this.widthInput.onchange = () => {this.boardUpdate()};
      this.heightInput.onchange = () => {this.boardUpdate()};

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

    boardUpdate() {
      let width = parseInt(this.widthInput.value);
      if (isNaN(width)) {
        return;
      }
      let height = parseInt(this.heightInput.value);
      if (isNaN(height)) {
        return;
      }
      emitBoardUpdate(this.socket, {width: width, height: height});
    }
}