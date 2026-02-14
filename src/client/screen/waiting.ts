import { emitAddComputer, emitBoardUpdate, emitUpdateSetupPlayer } from "../../shared/routes";
import { PlayerWaitingData } from "../../shared/bulider";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io";
import { removeOptions } from "../../client/main";

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
    public addComputerDifficulty = document.getElementById("addComputerDifficulty") as HTMLSelectElement;

    public waitingPlayerControls = document.getElementById("playerControlsDiv") as HTMLDivElement;

    constructor(private socket : Socket<DefaultEventsMap, DefaultEventsMap>) {
      this.widthInput.value = "100";
      this.heightInput.value = "100";

      this.addComputerButton.onclick = () => {
        let team = parseInt(this.addComputerTeam.value);
        if (Number.isNaN(team)) {
          return;
        }
        console.log(this.addComputerDifficulty.value == "");
        emitAddComputer(this.socket, {
          name: this.addComputerName.value,
          team:  team,
          color: this.addComputerColor.value,
          difficulty: this.addComputerDifficulty.value,
        });
      };
    }

    drawPlayerControls(p : PlayerWaitingData) {
      if (!p.leader) {
        this.startButton.classList.add("hidden");
        this.widthInput.parentElement?.parentElement?.classList.add("hidden");
        this.addComputerDiv.classList.add("hidden");
      }

      this.waitingPlayerControls.innerHTML = '';
      const playerNameLabel = document.createElement('label');
      playerNameLabel.innerText = p.name;
      playerNameLabel.className = "pixel-label";

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
      teamInput.className = "pixel-input";
      teamInput.placeholder = "Team";
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
      span.className = "player-controls-row";
      span.appendChild(playerNameLabel);
      span.appendChild(colorSelect);
      span.appendChild(teamInput);

      this.waitingPlayerControls.appendChild(span);
    }

    fillComputerSelect(difficulties : string[]) {
      let temp = this.addComputerDifficulty.value;
      removeOptions(this.addComputerDifficulty);
      difficulties.forEach((difficulty : string) => {
        const optionElement = document.createElement('option');
        optionElement.value = difficulty
        optionElement.text = difficulty;
        this.addComputerDifficulty.add(optionElement);
      });
      if (temp) this.addComputerDifficulty.value = temp;
    }

    drawPlayerList(data : PlayerWaitingData[]) {
      this.playerList.innerHTML = '';
      data.forEach((p : PlayerWaitingData) => {
        const nameSpan = document.createElement('span');
        nameSpan.className = "player-card__name";
        nameSpan.innerText = p.name;

        const colorSwatch = document.createElement('div');
        colorSwatch.className = "player-card__color-swatch";
        colorSwatch.style.backgroundColor = p.color;

        const teamSpan = document.createElement('span');
        teamSpan.className = "player-card__team";
        teamSpan.innerText = p.team ? `Team ${p.team}` : "";

        const li = document.createElement('li');
        li.className = "player-card";
        li.style.borderLeftColor = p.color;
        li.appendChild(nameSpan);
        li.appendChild(colorSwatch);
        li.appendChild(teamSpan);
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