import { Board } from "./board";
import { Game } from "./game";
import { Player, PlayerBuilder } from "./player";

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