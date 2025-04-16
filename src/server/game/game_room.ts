import { GameSetupData, PlayerSetupData } from "../../shared/bulider.js";

export class GameRoom implements GameSetupData {
    public players : PlayerSetupData[] = [];
    constructor(public roomCode : string){}

    addPlayer(name : string) {
        this.players.push({ready: false, name: name});
    }
}

export function randomRoomID(length: number) : string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      code += alphabet[randomIndex];
    }
    return code;
  }