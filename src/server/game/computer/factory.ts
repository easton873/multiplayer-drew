import { Board } from "../board.js";
import { PlayerProxy } from "../player.js";
import { Pos } from "../pos.js";
import { ResourceData } from "../../../shared/types.js";
import { BasicComputer } from "./basic.js";
import { NoOpComputer } from "./nop.js";
import { RandomComputer } from "./random.js";
import { SimpleComputer } from "./simple.js";
import { WaveComputer } from "./wave.js";
import { WinnerComputerPlayer } from "./winner.js";

const WINNER_KEY = "Winner";
const BASIC_KEY = "Basic";
const SIMPLE_KEY = "Simple";
const WAVE_KEY = "Wave";
const NOP_KEY = "NoOp";
const RANDOM_KEY = "Random";

export function CreateComputer(difficulty : string, team: number, pos: Pos, board: Board, id: string, name: string, color: string, startingResources?: ResourceData) : PlayerProxy {
    switch (difficulty) {
        case WINNER_KEY:
            return new WinnerComputerPlayer(team, pos, board, id, name, color, startingResources);
        case BASIC_KEY:
            return new BasicComputer(team, pos, board, id, name, color, startingResources);
        case SIMPLE_KEY:
            return new SimpleComputer(team, pos, board, id, name, color, startingResources);
        case WAVE_KEY:
            return new WaveComputer(team, pos, board, id, name, color, startingResources);
        case NOP_KEY:
            return new NoOpComputer(team, pos, board, id, name, color, startingResources);
        case RANDOM_KEY:
            return new RandomComputer(team, pos, board, id, name, color, startingResources);
        default:
            return new BasicComputer(team, pos, board, id, name, color, startingResources);
    }
}

export const ComputerDifficulties : string[] = [
    BASIC_KEY,
    WINNER_KEY,
    SIMPLE_KEY,
    WAVE_KEY,
    NOP_KEY,
    RANDOM_KEY,
];