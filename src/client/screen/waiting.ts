import { emitUpdateSetupPlayer } from "../../shared/routes";
import { PlayerWaitingData } from "../../shared/bulider";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io";

export class WaitingScreen {
    public div = document.getElementById("waitingScreen") as HTMLDivElement;
    public playerList = document.getElementById("playerList") as HTMLDivElement;
    public roomCodeLabel = document.getElementById("roomCodeLabel") as HTMLSpanElement;
    public startButton = document.getElementById("waitingStartButton") as HTMLButtonElement;
    public widthInput = document.getElementById("widthInput") as HTMLInputElement;
    public heightInput = document.getElementById("heightInput") as HTMLInputElement;

    public waitingPlayerControls = document.getElementById("playerControlsDiv") as HTMLDivElement;

    constructor(private socket : Socket<DefaultEventsMap, DefaultEventsMap>) {}

    drawPlayerControls(p : PlayerWaitingData) {
      this.waitingPlayerControls.innerHTML = '';
      
      const playerItem = document.createElement('div');
      playerItem.className = 'player-item';
      
      // Player color indicator
      const playerColor = document.createElement('div');
      playerColor.className = 'player-color';
      playerColor.style.backgroundColor = p.color;
      
      // Player info section
      const playerInfo = document.createElement('div');
      playerInfo.className = 'player-info';
      
      const playerName = document.createElement('div');
      playerName.className = 'player-name';
      playerName.innerText = p.name;
      
      // Team selection section
      const teamSelection = document.createElement('div');
      teamSelection.className = 'team-selection';
      
      const teamLabel = document.createElement('span');
      teamLabel.className = 'team-label';
      teamLabel.innerText = 'Team:';
      
      const teamInput = document.createElement('input');
      teamInput.className = 'team-input';
      teamInput.type = "number";
      teamInput.placeholder = "0";
      teamInput.min = "0";
      teamInput.max = "10";
      if (p.team !== null) {
        teamInput.value = p.team.toString();
      }
      
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
      
      // Color picker
      const colorSelect = document.createElement('input');
      colorSelect.type = "color";
      colorSelect.value = p.color;
      colorSelect.style.width = "30px";
      colorSelect.style.height = "30px";
      colorSelect.style.border = "2px solid #ffffff";
      colorSelect.style.borderRadius = "50%";
      colorSelect.style.cursor = "pointer";
      
      colorSelect.onchange = () => {
        p.color = colorSelect.value;
        playerColor.style.backgroundColor = p.color;
        emitUpdateSetupPlayer(this.socket, p);
      };
      
      // Assemble the player item
      teamSelection.appendChild(teamLabel);
      teamSelection.appendChild(teamInput);
      
      playerInfo.appendChild(playerName);
      playerInfo.appendChild(teamSelection);
      
      playerItem.appendChild(playerColor);
      playerItem.appendChild(playerInfo);
      playerItem.appendChild(colorSelect);
      
      this.waitingPlayerControls.appendChild(playerItem);
    }

    drawPlayerList(data : PlayerWaitingData[]) {
      this.playerList.innerHTML = '';
      data.forEach((p : PlayerWaitingData) => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        
        // Player color indicator
        const playerColor = document.createElement('div');
        playerColor.className = 'player-color';
        playerColor.style.backgroundColor = p.color;
        
        // Player info section
        const playerInfo = document.createElement('div');
        playerInfo.className = 'player-info';
        
        const playerName = document.createElement('div');
        playerName.className = 'player-name';
        playerName.innerText = p.name;
        
        // Team display
        const teamDisplay = document.createElement('div');
        teamDisplay.className = 'team-selection';
        
        const teamLabel = document.createElement('span');
        teamLabel.className = 'team-label';
        teamLabel.innerText = 'Team:';
        
        const teamValue = document.createElement('span');
        teamValue.style.color = '#ffd700';
        teamValue.style.fontWeight = '700';
        teamValue.style.fontSize = '14px';
        teamValue.innerText = p.team ? p.team.toString() : "None";
        
        teamDisplay.appendChild(teamLabel);
        teamDisplay.appendChild(teamValue);
        
        playerInfo.appendChild(playerName);
        playerInfo.appendChild(teamDisplay);
        
        playerItem.appendChild(playerColor);
        playerItem.appendChild(playerInfo);
        
        this.playerList.appendChild(playerItem);
      });
    }
}