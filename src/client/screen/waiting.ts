import { emitAddComputer, emitBackgroundUpdate, emitBoardUpdate, emitEditComputer, emitRemoveComputer, emitResourceUpdate, emitUpdateSetupPlayer } from "../../shared/routes";
import { GameWaitingData, PlayerWaitingData } from "../../shared/bulider";
import { ResourceData } from "../../shared/types";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io";
import { removeOptions } from "../../client/main";

const COMPUTER_NAMES = [
  "Greg", "Fred", "Bob", "George", "Carol", "Alice", "Dave", "Eve", "Frank", "Helen", "Susan", "Jack",
  "Sally", "Sam", "Jim", "Jimbo", "Dwight", "Dan", "Joe", "Simbad", "Silas", "Tom", "Clancy", "Ares",
  "Will", "Wesley", "James", "Brent", "Carly", "Willy", "O'Reily", "Dummy", "Carl", "Bad", "Stupido"
];

function randomComputerName(): string {
    return COMPUTER_NAMES[Math.floor(Math.random() * COMPUTER_NAMES.length)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function randomColor(): string {
    const h = Math.floor(Math.random() * 360);
    const [r, g, b] = hslToRgb(h, 0.8, 0.5);
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export class WaitingScreen {
    public div = document.getElementById("waitingScreen") as HTMLDivElement;
    public playerList = document.getElementById("playerList") as HTMLUListElement;
    public roomCodeLabel = document.getElementById("roomCodeLabel") as HTMLLabelElement;
    public startButton = document.getElementById("waitingStartButton") as HTMLButtonElement;
    public widthInput = document.getElementById("widthInput") as HTMLInputElement;
    public heightInput = document.getElementById("heightInput") as HTMLInputElement;
    public widthLabel = document.getElementById("widthLabel") as HTMLLabelElement;
    public heightLabel = document.getElementById("heightLabel") as HTMLLabelElement;
    public startingResourcesDiv = document.getElementById("startingResourcesDiv") as HTMLDivElement;
    public goldInput = document.getElementById("goldInput") as HTMLInputElement;
    public woodInput = document.getElementById("woodInput") as HTMLInputElement;
    public stoneInput = document.getElementById("stoneInput") as HTMLInputElement;
    public addComputerDiv = document.getElementById("addComputerDiv") as HTMLDivElement;
    public addComputerButton = document.getElementById("addComputerButton") as HTMLButtonElement;
    private addDifficulty = document.getElementById("addComputerDifficulty") as HTMLSelectElement;
    private addTeam = document.getElementById("addComputerTeam") as HTMLInputElement;
    private addColor = document.getElementById("addComputerColor") as HTMLInputElement;
    private addCustomColor = document.getElementById("addComputerCustomColor") as HTMLInputElement;
    public backgroundDiv = document.getElementById("backgroundDiv") as HTMLDivElement;
    private backgroundSelect = document.getElementById("backgroundSelect") as HTMLSelectElement;
    private backgroundPreview = document.getElementById("backgroundPreview") as HTMLImageElement;
    private gameInfoDiv = document.getElementById("gameInfoDiv") as HTMLDivElement;
    private gameInfoBoard = document.getElementById("gameInfoBoard") as HTMLSpanElement;
    private gameInfoResources = document.getElementById("gameInfoResources") as HTMLSpanElement;
    private gameInfoBgPreview = document.getElementById("gameInfoBgPreview") as HTMLImageElement;

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
      this.goldInput.value = "50";
      this.woodInput.value = "0";
      this.stoneInput.value = "0";

      this.goldInput.onchange = () => { this.resourceUpdate(); };
      this.woodInput.onchange = () => { this.resourceUpdate(); };
      this.stoneInput.onchange = () => { this.resourceUpdate(); };

      this.addColor.value = randomColor();
      this.addCustomColor.onchange = () => {
        this.addColor.classList.toggle("hidden", !this.addCustomColor.checked);
      };

      this.addComputerButton.onclick = () => {
        const teamRaw = parseInt(this.addTeam.value);
        emitAddComputer(this.socket, {
          name: randomComputerName(),
          team: Number.isNaN(teamRaw) ? null : teamRaw,
          color: this.addCustomColor.checked ? this.addColor.value : randomColor(),
          difficulty: this.addDifficulty.value || this.difficulties[0] || "",
        });
      };

      this.editCancel.onclick = () => {
        this.editModal.classList.add("hidden");
      };
    }

    drawPlayerControls(p : PlayerWaitingData) {
      this.isLeader = p.leader;
      if (p.leader) {
        this.gameInfoDiv.classList.add("hidden");
      } else {
        this.startButton.classList.add("hidden");
        this.widthInput.parentElement?.parentElement?.classList.add("hidden");
        this.startingResourcesDiv.classList.add("hidden");
        this.addComputerDiv.classList.add("hidden");
        this.backgroundDiv.classList.add("hidden");
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
      const prevAdd = this.addDifficulty.value;
      removeOptions(this.editDifficulty);
      removeOptions(this.addDifficulty);
      difficulties.forEach((difficulty : string) => {
        const editOption = document.createElement('option');
        editOption.value = difficulty;
        editOption.text = difficulty;
        this.editDifficulty.add(editOption);
        const addOption = document.createElement('option');
        addOption.value = difficulty;
        addOption.text = difficulty;
        this.addDifficulty.add(addOption);
      });
      if (prevAdd) this.addDifficulty.value = prevAdd;
    }

    fillBackgroundSelect(backgrounds: string[], current: string) {
      this.backgroundSelect.innerHTML = '';
      backgrounds.forEach((filename: string) => {
        const option = document.createElement('option');
        option.value = filename;
        option.text = filename.replace(/\.[^.]+$/, '').replace(/([a-z])(\d)/g, '$1 $2').replace(/\b\w/g, c => c.toUpperCase());
        this.backgroundSelect.add(option);
      });
      this.backgroundSelect.value = current;
      this.backgroundPreview.src = '/backgrounds/' + current;
      this.backgroundPreview.style.display = 'block';
      this.backgroundSelect.onchange = () => {
        const filename = this.backgroundSelect.value;
        this.backgroundPreview.src = '/backgrounds/' + filename;
        emitBackgroundUpdate(this.socket, filename);
      };
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

        const typeSpan = document.createElement('span');
        typeSpan.className = "player-card__type";
        typeSpan.innerText = p.isComputer ? (p.difficulty ?? "Computer") : "Human";

        const li = document.createElement('li');
        li.className = "player-card";
        li.style.borderLeftColor = p.color;
        li.appendChild(nameSpan);
        li.appendChild(colorSwatch);
        li.appendChild(teamSpan);
        li.appendChild(typeSpan);

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
        const teamRaw = parseInt(this.editTeam.value);
        const team = Number.isNaN(teamRaw) ? null : teamRaw;
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

    resourceUpdate() {
      const gold = Math.max(0, parseInt(this.goldInput.value) || 0);
      const wood = Math.max(0, parseInt(this.woodInput.value) || 0);
      const stone = Math.max(0, parseInt(this.stoneInput.value) || 0);
      emitResourceUpdate(this.socket, { gold, wood, stone });
    }

    updateResourceInputs(r: ResourceData) {
      this.goldInput.value = String(r.gold);
      this.woodInput.value = String(r.wood);
      this.stoneInput.value = String(r.stone);
    }

    updateGameInfo(data: GameWaitingData) {
      this.gameInfoBoard.textContent = `Board: ${data.board.boardX} × ${data.board.boardY}`;
      const r = data.startingResources;
      this.gameInfoResources.textContent = `💰 Gold: ${r.gold}\n🪵 Wood: ${r.wood}\n🪨 Stone: ${r.stone}`;
      if (data.background) {
        this.gameInfoBgPreview.src = '/backgrounds/' + data.background;
      }
    }
}