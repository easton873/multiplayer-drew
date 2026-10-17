import { emitAddComputer, emitBackgroundUpdate, emitBoardUpdate, emitEditComputer, emitRemoveComputer, emitResourceUpdate, emitUpdateSetupPlayer } from "../../shared/routes";
import { CHOOSE_FOR_ME_FACTION, EraLoadData, FactionLoadData, GameWaitingData, PlayerWaitingData, UnitLoadData } from "../../shared/bulider";
import { ResourceData } from "../../shared/types";
import { GOLD_RESOURCE, RESOURCE_TYPES, ResourceType } from "../../shared/resource_types";
import { RESOURCE_EMOJI, resourceLabel } from "../resources";
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

// A faction's picture lives at /units/<faction>/<faction>.png
function factionImageSrc(faction: string): string {
    const folder = faction.toLowerCase();
    return `/units/${folder}/${folder}.png`;
}

// A unit's picture lives at /units/<faction>/<unit>.png, with emoji and spaces stripped from the name
function unitImageSrc(faction: string, unitName: string): string {
    const normalized = unitName.replace(/[^\x20-\x7E]/g, '').toLowerCase().replace(/\s/g, '');
    return `/units/${faction.toLowerCase()}/${normalized}.png`;
}

function resourceText(r: ResourceData | undefined): string {
    const parts = RESOURCE_TYPES.filter(t => (r?.[t] ?? 0) > 0).map(t => `${RESOURCE_EMOJI[t]} ${r![t]}`);
    return parts.length > 0 ? parts.join("  ") : "Free";
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
    const e = document.createElement(tag);
    e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
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
    private startingResourcesInputs = document.getElementById("startingResourcesInputs") as HTMLDivElement;
    private resourceInputs = {} as Record<ResourceType, HTMLInputElement>;
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
    private factions: string[] = [];
    private factionData = new Map<string, FactionLoadData>();

    constructor(private socket : Socket<DefaultEventsMap, DefaultEventsMap>) {
      this.widthInput.value = "100";
      this.heightInput.value = "100";

      for (const type of RESOURCE_TYPES) {
        const group = document.createElement("div");
        group.className = "form-group";

        const label = document.createElement("label");
        label.htmlFor = `${type}Input`;
        label.className = "pixel-label";
        label.textContent = `${RESOURCE_EMOJI[type]} ${resourceLabel(type)}`;

        const input = document.createElement("input");
        input.type = "number";
        input.id = `${type}Input`;
        input.className = "pixel-input";
        input.min = "0";
        input.autocomplete = "off";
        input.value = type === GOLD_RESOURCE ? "50" : "0";
        input.onchange = () => { this.resourceUpdate(); };

        group.append(label, input);
        this.startingResourcesInputs.appendChild(group);
        this.resourceInputs[type] = input;
      }

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
      this.waitingPlayerControls.appendChild(this.buildFactionPicker(p, markDirty));
    }

    private buildFactionPicker(p : PlayerWaitingData, markDirty : () => void) : HTMLDivElement {
      const choices = this.factions;
      let index = Math.max(0, choices.indexOf(p.faction));

      const image = document.createElement('img');
      image.className = "faction-picker__image";
      const placeholder = document.createElement('div');
      placeholder.className = "faction-picker__image faction-picker__placeholder";
      placeholder.innerText = "?";
      const name = document.createElement('div');
      name.className = "faction-picker__name";

      const imageBox = document.createElement('div');
      imageBox.className = "faction-picker__image-box";
      imageBox.append(image, placeholder);

      const render = () => {
        const faction = choices[index];
        name.innerText = faction;
        const isReal = faction !== CHOOSE_FOR_ME_FACTION;
        image.classList.toggle("hidden", !isReal);
        placeholder.classList.toggle("hidden", isReal);
        if (isReal) {
          image.src = factionImageSrc(faction);
        }
      };

      const select = (newIndex : number) => {
        index = newIndex;
        p.faction = choices[index];
        render();
        markDirty();
      };

      const step = (delta : number) => select((index + delta + choices.length) % choices.length);

      const makeArrow = (label : string, delta : number) => {
        const btn = document.createElement('button');
        btn.className = "pixel-btn faction-picker__arrow";
        btn.innerText = label;
        btn.onclick = () => step(delta);
        return btn;
      };

      const row = document.createElement('div');
      row.className = "faction-picker__row";
      row.append(makeArrow("◀", -1), imageBox, makeArrow("▶", 1));

      const previewBtn = document.createElement('button');
      previewBtn.className = "pixel-btn faction-picker__preview-btn";
      previewBtn.innerText = "Faction Selection";
      previewBtn.onclick = () => this.openFactionModal(index, select);

      const controls = document.createElement('div');
      controls.className = "faction-picker__controls";
      controls.append(row, previewBtn);

      const picker = document.createElement('div');
      picker.className = "faction-picker";
      picker.append(controls, name);
      render();
      return picker;
    }

    setFactions(factions : FactionLoadData[]) {
      this.factionData = new Map(factions.map(f => [f.name, f]));
      this.factions = [CHOOSE_FOR_ME_FACTION, ...factions.map(f => f.name).filter(f => f !== CHOOSE_FOR_ME_FACTION)];
    }

    // Big preview of every faction; the check applies the faction being viewed, the X leaves the selection alone
    private openFactionModal(startIndex : number, onSelect : (index : number) => void) {
      const choices = this.factions;
      let index = startIndex;

      const overlay = el('div', "modal-overlay");
      const panel = el('div', "pixel-panel faction-modal");

      const makeArrow = (label : string, delta : number) => {
        const btn = el('button', "pixel-btn faction-picker__arrow", label);
        btn.onclick = () => { index = (index + delta + choices.length) % choices.length; render(); };
        return btn;
      };
      const title = el('h3', "faction-modal__title");
      const header = el('div', "faction-modal__header");
      header.append(makeArrow("◀", -1), title, makeArrow("▶", 1));

      const body = el('div', "faction-modal__body");

      const close = () => overlay.remove();
      const accept = el('button', "pixel-btn faction-modal__accept", "✓");
      accept.title = "Select this faction";
      accept.onclick = () => { onSelect(index); close(); };
      const cancel = el('button', "pixel-btn faction-modal__cancel", "✕");
      cancel.title = "Cancel";
      cancel.onclick = close;
      const footer = el('div', "faction-modal__footer");
      footer.append(accept, cancel);

      const render = () => {
        const name = choices[index];
        title.textContent = name;
        body.replaceChildren();
        body.scrollTop = 0;

        const data = this.factionData.get(name);
        if (name === CHOOSE_FOR_ME_FACTION || !data) {
          body.append(el('div', "faction-picker__image faction-picker__placeholder faction-modal__image", "?"));
          body.append(el('p', "faction-modal__note", "A random faction is picked for you when the game starts."));
          return;
        }

        const image = el('img', "faction-picker__image faction-modal__image");
        image.src = factionImageSrc(name);
        body.append(image);

        body.append(el('h4', "faction-modal__section", "Eras"));
        const eras = el('div', "faction-modal__eras");
        data.eras.forEach((era, i) => eras.append(this.buildEraRow(era, i)));
        body.append(eras);

        body.append(el('h4', "faction-modal__section", "Units"));
        const units = el('div', "faction-modal__units");
        data.units.filter(u => u.cost).sort((a, b) => (a.era ?? 0) - (b.era ?? 0))
          .forEach(u => units.append(this.buildUnitRow(name, u, data.eras)));
        body.append(units);
      };

      overlay.onclick = (e) => { if (e.target === overlay) close(); };
      panel.append(header, body, footer);
      overlay.append(panel);
      this.div.append(overlay);
      render();
    }

    private buildEraRow(era : EraLoadData, i : number) : HTMLDivElement {
      const row = el('div', "faction-modal__era");
      row.append(
        el('div', "faction-modal__era-name", `${i + 1}. ${era.name}`),
        el('div', "faction-modal__era-line", `Cost: ${i === 0 ? "Starting era" : resourceText(era.cost)}`),
        el('div', "faction-modal__era-line", `Resources: ${era.availableResources.map(t => `${RESOURCE_EMOJI[t]} ${resourceLabel(t)}`).join("  ")}`),
        el('div', "faction-modal__era-line", `Heart makes: ${resourceText(era.heartResources)}`),
      );
      return row;
    }

    private buildUnitRow(faction : string, unit : UnitLoadData, eras : EraLoadData[]) : HTMLDivElement {
      const row = el('div', "faction-modal__unit");
      const img = el('img', "faction-modal__unit-image");
      img.src = unitImageSrc(faction, unit.name);
      img.onerror = () => { img.style.visibility = "hidden"; };
      const info = el('div', "faction-modal__unit-info");
      const eraIndex = unit.era ?? 0;
      info.append(
        el('div', "faction-modal__unit-name", unit.name.replace(/[^\x20-\x7E]/g, '')),
        el('div', "faction-modal__era-line", `Cost: ${resourceText(unit.cost)}`),
        el('div', "faction-modal__era-line", `Era ${eraIndex + 1}: ${eras[eraIndex]?.name ?? ""}`),
      );
      row.append(img, info, el('div', "faction-modal__unit-blurb", unit.blurb ?? ""));
      return row;
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

        const factionSpan = document.createElement('span');
        factionSpan.className = "player-card__faction";
        if (p.faction === CHOOSE_FOR_ME_FACTION) {
          const unknown = document.createElement('span');
          unknown.className = "player-card__faction-icon player-card__faction-unknown";
          unknown.innerText = "?";
          factionSpan.appendChild(unknown);
        } else {
          const icon = document.createElement('img');
          icon.className = "player-card__faction-icon";
          icon.src = factionImageSrc(p.faction);
          factionSpan.appendChild(icon);
        }
        factionSpan.appendChild(document.createTextNode(p.faction));

        const typeSpan = document.createElement('span');
        typeSpan.className = "player-card__type";
        typeSpan.innerText = p.isComputer ? (p.difficulty ?? "Computer") : "Human";

        const li = document.createElement('li');
        li.className = "player-card";
        li.style.borderLeftColor = p.color;
        li.appendChild(nameSpan);
        li.appendChild(colorSwatch);
        li.appendChild(teamSpan);
        li.appendChild(factionSpan);
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
      const resources = {} as ResourceData;
      for (const type of RESOURCE_TYPES) {
        resources[type] = Math.max(0, parseInt(this.resourceInputs[type].value) || 0);
      }
      emitResourceUpdate(this.socket, resources);
    }

    updateResourceInputs(r: ResourceData) {
      for (const type of RESOURCE_TYPES) {
        this.resourceInputs[type].value = String(r[type]);
      }
    }

    updateGameInfo(data: GameWaitingData) {
      this.gameInfoBoard.textContent = `Board: ${data.board.boardX} × ${data.board.boardY}`;
      const r = data.startingResources;
      this.gameInfoResources.textContent = RESOURCE_TYPES
        .map(type => `${RESOURCE_EMOJI[type]} ${resourceLabel(type)}: ${r[type]}`)
        .join("\n");
      if (data.background) {
        this.gameInfoBgPreview.src = '/backgrounds/' + data.background;
      }
    }
}