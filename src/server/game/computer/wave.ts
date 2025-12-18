import { Board } from "../board.js";
import { Pos } from "../pos.js";
import { GameUnit } from "../unit/game_unit.js";
import { SoldierUnit } from "../unit/melee_unit.js";
import { BaseComputerPlayer } from "./basics.js";

export class WaveComputer extends BaseComputerPlayer {
    private currCounter = 0;
    private currUnitsToPlace = 0;
    public currIdx = 0;
    public waves : Wave[] = [
        new Wave([new WaveUnit(SoldierUnit, 100)], 30 * 10, 3),
    ];
    constructor(team: number, pos: Pos, board: Board, id: string, name: string, color: string) {
        super(team, new Pos(board.width / 2, board.height / 2), board, id, name, color);
    }
    firstEra() {
        this.wave(this.waves[this.currIdx]);
    }
    secontEra() {
        throw new Error("Method not implemented.");
    }
    thirdEra() {
        throw new Error("Method not implemented.");
    }
    fourthEra() {
        throw new Error("Method not implemented.");
    }
    fifthEra() {
        throw new Error("Method not implemented.");
    }
    sixthEra() {
        throw new Error("Method not implemented.");
    }

    wavePlace(gameUnit : GameUnit, pos : Pos, num : number) {
        for (let i = 0; i < num; i++) {
            this.addUnitToBoard(gameUnit, pos.clone());
        }
    }

    wave(wave : Wave) {
        wave.tick(this);
    }
}

class Wave {
    public state : WaveState = new CounterState(0);
    constructor(public units : WaveUnit[], 
        public timeToNextWave : number,
        public rateOfPlacement : number){}
    
    tick(computer : WaveComputer) {
        this.state.tick(computer, this);
    }
}

class WaveUnit {
    constructor(public gameUnit : GameUnit, public num : number){}
}

interface WaveState {
    getNextState(wave : Wave) : WaveState
    tick(computer : WaveComputer, wave : Wave)
}

class CounterState implements WaveState {
    constructor(private counter : number){}
    getNextState(wave : Wave): WaveState {
        return new PlacingState(wave.units, wave.rateOfPlacement);
    }
    tick(computer : WaveComputer, wave : Wave) {
        this.counter--;
        if (this.counter <= 0) {
            wave.state = this.getNextState(wave);
        }
    }
}

class PlacingState implements WaveState {
    private unitsLeft : number = 0;
    private currIdx : number = 0;
    constructor(private units : WaveUnit[], private rateOfPlacement : number) {
        this.currIdx = 0;
        this.setWaveUnit();
    }
    getNextState(wave : Wave): WaveState {
        return new CompleteState();
    }
    tick(computer : WaveComputer, wave : Wave) {
        if (this.currIdx >= this.units.length) {
            wave.state = this.getNextState(wave);
            return;
        }
        let currUnit = this.units[this.currIdx];
        let unitsToPlace : number = this.rateOfPlacement;
        this.unitsLeft -= unitsToPlace
        if (this.unitsLeft <= 0) {
            unitsToPlace += this.unitsLeft;
        }
        computer.wavePlace(currUnit.gameUnit, computer.heart.pos.clone(), unitsToPlace);
        if (this.unitsLeft <= 0) {
            this.currIdx++;
            this.setWaveUnit();
            return;
        }
    }

    setWaveUnit() {
        if (this.currIdx < this.units.length) {
            let curr : WaveUnit = this.units[this.currIdx];
            this.unitsLeft = curr.num;
        }
    }
}

class CompleteState implements WaveState {
    getNextState(wave: Wave): WaveState {
        return new CounterState(wave.timeToNextWave);
    }
    tick(computer: WaveComputer, wave: Wave) {
        computer.currIdx++;
        if (computer.currIdx >= computer.waves.length) {
            computer.currIdx = 0;
        }
        wave.state = this.getNextState(wave);
    }
}