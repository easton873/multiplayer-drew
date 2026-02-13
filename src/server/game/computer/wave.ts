import { Board } from "../board.js";
import { Pos } from "../pos.js";
import { GameUnit } from "../unit/game_unit.js";
import { GorillaWarfareUnit } from "../unit/gorilla_warfare.js";
import { GoblinUnit, QuickAttackerUnit, SabotagerUnit, SoldierUnit } from "../unit/melee_unit.js";
import { BallisticMissileUnit, UnitMissile, UnitMissileUnit } from "../unit/missile.js";
import { ArcherUnit, FireballThrowerUnit } from "../unit/ranged_unit.js";
import { Summoner, SummonerUnit } from "../unit/summoner.js";
import { BaseComputerPlayer } from "./basics.js";

const SECOND : number = 30;

export class WaveComputer extends BaseComputerPlayer {
    public currIdx = 0;
    public waves : Wave[] = [
        new Wave(
            [
                new WaveUnit(SoldierUnit, 10),
            ], 
            SECOND * 10, 1
        ),
        new Wave(
            [
                new WaveUnit(SoldierUnit, 25),
                new WaveUnit(ArcherUnit, 10),
            ], 
            SECOND * 35, 3
        ),
        new Wave(
            [
                new WaveUnit(QuickAttackerUnit, 10),
                new WaveUnit(GoblinUnit, 25),
            ], 
            SECOND * 35, 3
        ),
        new Wave(
            [
                new WaveUnit(SabotagerUnit, 100),
            ], 
            SECOND * 35, 3
        ),
        new Wave(
            [
                new WaveUnit(GorillaWarfareUnit, 5),
                new WaveUnit(ArcherUnit, 25),
            ], 
            SECOND * 35, 3
        ),
        new Wave(
            [
                new WaveUnit(FireballThrowerUnit, 20),
                new WaveUnit(new SummonerUnit(), 10),
            ], 
            SECOND * 35, 3
        ),
        new Wave(
            [
                new WaveUnit(GorillaWarfareUnit, 15),
                new WaveUnit(UnitMissileUnit, 10),
            ], 
            SECOND * 35, 1
        ),
        new Wave(
            [
                new WaveUnit(FireballThrowerUnit, 100),
                new WaveUnit(BallisticMissileUnit, 30),
            ], 
            SECOND * 35, 1
        ),
    ];
    constructor(team: number, pos: Pos, board: Board, id: string, name: string, color: string) {
        super(team, new Pos(board.width / 2, board.height / 2), board, id, name, color);
    }
    firstEra() {
        this.wave(this.waves[this.currIdx]);
    }
    secontEra() {}
    thirdEra() {}
    fourthEra() { }
    fifthEra() {}
    sixthEra() {}

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
    public state : WaveState;
    constructor(public units : WaveUnit[], 
        public timeToNextWave : number,
        public rateOfPlacement : number){
            this.state = new CounterState(this.timeToNextWave);
        }
    
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