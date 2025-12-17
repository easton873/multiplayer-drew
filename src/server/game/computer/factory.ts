import { Board } from "../board.js";
import { PlayerProxy } from "../player.js";
import { Pos } from "../pos.js";
import { ComputerPlayer, WinnerComputerPlayer } from "./basics.js";

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

export function CreateComputer(difficulty : string, team: number, pos: Pos, board: Board, id: string, name: string, color: string) : PlayerProxy {
    switch (difficulty) {
        case WINNER_KEY:
            return new WinnerComputerPlayer(team, pos, board, id, name, color);
        case BASIC_KEY:
            return new ComputerPlayer(team, pos, board, id, name, color);
        default:
            return new ComputerPlayer(team, pos, board, id, name, color);
    }
}

export const ComputerDifficulties : string[] = [
    WINNER_KEY,
    BASIC_KEY,
];