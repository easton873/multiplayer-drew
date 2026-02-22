import { emitAddComputer, emitBoardUpdate, emitEditComputer, emitRemoveComputer, emitUpdateSetupPlayer } from "../../shared/routes";
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

    public waitingPlayerControls = document.getElementById("playerControlsDiv") as HTMLDivElement;

    private editModal = document.getElementById("editComputerModal") as HTMLDivElement;
    private editName = document.getElementById("editComputerName") as HTMLInputElement;
    private editTeam = document.getElementById("editComputerTeam") as HTMLInputElement;
    private editColor = document.getElementById("editComputerColor") as HTMLInputElement;
    private editDifficulty = document.getElementById("editComputerDifficulty") as HTMLSelectElement;
    private editSave = document.getElementById("editComputerSave") as HTMLButtonElement;
    private editRemove = document.getElementById("editComputerRemove") as HTMLButtonElement;
    private editCancel = document.getElementById("editComputerCancel") as HTMLButtonElement;

    private isLeader = false;
    private difficulties: string[] = [];

    constructor(private socket : Socket<DefaultEventsMap, DefaultEventsMap>) {
      this.widthInput.value = "100";
      this.heightInput.value = "100";

      this.addComputerButton.onclick = () => {
        emitAddComputer(this.socket, {
          name: "",
          team: null,
          color: "#000000",
          difficulty: this.difficulties[0] || "",
        });
      };

      this.editCancel.onclick = () => {
        this.editModal.classList.add("hidden");
      };
    }

    drawPlayerControls(p : PlayerWaitingData) {
      this.isLeader = p.leader;
      if (!p.leader) {
        this.startButton.classList.add("hidden");
        this.widthInput.parentElement?.parentElement?.classList.add("hidden");
        this.addComputerDiv.classList.add("hidden");
      }

      this.waitingPlayerControls.innerHTML = '';

      const nameInput = document.createElement('input');
      nameInput.type = "text";
      nameInput.className = "pixel-input";
      nameInput.value = p.name;

      const colorSelect = document.createElement('input');
      colorSelect.type = "color";
      colorSelect.value = p.color;

      const teamInput = document.createElement('input');
      teamInput.type = "number";
      teamInput.className = "pixel-input";
      teamInput.placeholder = "Team";

      const submitBtn = document.createElement('button');
      submitBtn.className = "pixel-btn player-submit-btn hidden";
      submitBtn.innerText = "✓";

      const markDirty = () => submitBtn.classList.remove("hidden");

      nameInput.oninput = () => { p.name = nameInput.value; markDirty(); };
      colorSelect.oninput = () => { p.color = colorSelect.value; markDirty(); };
      teamInput.onkeyup = () => {
        let team = null;
        if (teamInput.value !== "") {
          team = parseInt(teamInput.value);
          if (Number.isNaN(team)) team = null;
        }
        p.team = team;
        markDirty();
      };

      submitBtn.onclick = () => {
        emitUpdateSetupPlayer(this.socket, p);
        submitBtn.classList.add("hidden");
      };

      this.widthInput.onchange = () => { this.boardUpdate(); };
      this.heightInput.onchange = () => { this.boardUpdate(); };

      const span = document.createElement('span');
      span.className = "player-controls-row";
      span.appendChild(nameInput);
      span.appendChild(colorSelect);
      span.appendChild(teamInput);
      span.appendChild(submitBtn);

      this.waitingPlayerControls.appendChild(span);
    }

    fillComputerSelect(difficulties : string[]) {
      this.difficulties = difficulties;
      removeOptions(this.editDifficulty);
      difficulties.forEach((difficulty : string) => {
        const editOption = document.createElement('option');
        editOption.value = difficulty;
        editOption.text = difficulty;
        this.editDifficulty.add(editOption);
      });
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

        if (p.isComputer && this.isLeader) {
          const editBtn = document.createElement('button');
          editBtn.className = "player-card__edit-btn";
          editBtn.title = "Edit computer";
          editBtn.innerText = "✏";
          editBtn.onclick = () => this.openEditModal(p);
          li.appendChild(editBtn);
        }

        this.playerList.appendChild(li);
      })
    }

    private openEditModal(p : PlayerWaitingData) {
      this.editName.value = p.name;
      this.editTeam.value = p.team != null ? String(p.team) : "";
      this.editColor.value = p.color;
      if (p.difficulty) {
        this.editDifficulty.value = p.difficulty;
      }

      this.editSave.onclick = () => {
        const team = parseInt(this.editTeam.value);
        if (Number.isNaN(team)) return;
        emitEditComputer(this.socket, {
          id: p.id,
          name: this.editName.value,
          team,
          color: this.editColor.value,
          difficulty: this.editDifficulty.value,
        });
        this.editModal.classList.add("hidden");
      };

      this.editRemove.onclick = () => {
        emitRemoveComputer(this.socket, p.id);
        this.editModal.classList.add("hidden");
      };

      this.editModal.classList.remove("hidden");
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