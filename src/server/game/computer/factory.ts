import { Board } from "../board.js";
import { PlayerProxy } from "../player.js";
import { Pos } from "../pos.js";
import { ComputerPlayer, WinnerComputerPlayer } from "./basics.js";
import { SimpleComputer } from "./simple.js";
import { WaveComputer } from "./wave.js";

// export const ComputerLookup = buildComputerMap();

// export const ComputerNames = computerNames();

// const computers = [
//     ComputerPlayer,
//     WinnerComputerPlayer,
// ];

// function buildComputerMap() {
//     let result = new Map
//     computers.forEach((guy) => {
//         result.set(guy.NAME, guy);
//     });
//     return result;
// }

// function computerNames() {
//     let result = [];
//     computers.forEach((guy) => {
//         result.push(guy.NAME);
//     });
//     return result;
// }

const WINNER_KEY = "Winner";
const BASIC_KEY = "Basic";
const SIMPLE_KEY = "Simple";
const WAVE_KEY = "Wave";

export function CreateComputer(difficulty : string, team: number, pos: Pos, board: Board, id: string, name: string, color: string) : PlayerProxy {
    switch (difficulty) {
        case WINNER_KEY:
            return new WinnerComputerPlayer(team, pos, board, id, name, color);
        case BASIC_KEY:
            return new ComputerPlayer(team, pos, board, id, name, color);
        case SIMPLE_KEY:
            return new SimpleComputer(team, pos, board, id, name, color);
        case WAVE_KEY:
            return new WaveComputer(team, pos, board, id, name, color);
        default:
            return new ComputerPlayer(team, pos, board, id, name, color);
    }
}

export const ComputerDifficulties : string[] = [
    WINNER_KEY,
    BASIC_KEY,
    SIMPLE_KEY,
    WAVE_KEY,
];