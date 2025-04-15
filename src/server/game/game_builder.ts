import { Board } from "./board.js";
import { Game } from "./game.js";
import { Player, PlayerBuilder } from "./player.js";

export class GameBuilder {
    constructor(){}

    BuildGame(boardX, boardY : number, playerBuilders : PlayerBuilder[]) : Game {
        let board : Board = new Board(boardX, boardY);
        let players : Player[] = [];
        playerBuilders.forEach((pb : PlayerBuilder) => {
            players.push(new Player(pb.pos, board));
        })
        return new Game(players, board);
    }
}