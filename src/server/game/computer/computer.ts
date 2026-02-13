// import { FOURTH_ERA_NAME, SECOND_ERA_NAME, STARTING_ERA_NAME, THIRD_ERA_NAME } from "../era.js";
// import { PlayerProxy } from "../player.js";
// import { GameUnit } from "../unit/game_unit.js";
// import { SoldierUnit } from "../unit/melee_unit.js";
// import { ArcherUnit } from "../unit/ranged_unit.js";
// import { MERCHANT_GAME_UNIT } from "../unit/resource_unit.js";
// import { Unit } from "../unit/unit.js";

// export abstract class ComputerPlayer extends PlayerProxy {
//     doTurn() : void {
//         switch (this.era.currEra.getName()) {
//             case STARTING_ERA_NAME:
//                 this.firstEra;
//                 return;
//             case SECOND_ERA_NAME:
//                 this.secondEra();
//                 return;
//             case THIRD_ERA_NAME:
//                 this.thirdEra();
//                 return;
//             case FOURTH_ERA_NAME:
//                 this.fourthEra();
//                 return;
//             default:
//                 this.defaultAction();
//                 return;
//         }
//     }

//     abstract firstEra();
//     abstract secondEra();
//     abstract thirdEra();
//     abstract fourthEra();
//     abstract defaultAction();

//     countUnit(unitType : GameUnit) : number {
//         let count = 0;
//         this.board.entities.forEach((unit : Unit) => {
//             if (unit.name == unitType.getName()) {
//                 count++
//             }
//         });
//         return count;
//     }
// }

// export class AIPlayer extends PlayerProxy {
//     private targetMerchantNum : number = 15;
//     private placed : number = 0;
//     doTurn() : void {
//         // return;
//         if (this.resources.canAfford(MERCHANT_GAME_UNIT.getUnitCreationInfo().getCost()) &&
//         this.unitCount < this.targetMerchantNum) {
//             let pos = this.heart.pos.clone();
//             this.NewUnit(MERCHANT_GAME_UNIT.getName(), pos);
//         } else if (this.unitCount >= this.targetMerchantNum) {
//             let pos = this.heart.pos.clone();
//             if (this.placed >= 3) {
//                 if (this.resources.canAfford(ArcherUnit.getUnitCreationInfo().getCost())) {
//                     this.NewUnit(ArcherUnit.getName(), pos);
//                     this.placed = 0;
//                 }
//             } else {
//                 if (this.resources.canAfford(SoldierUnit.getUnitCreationInfo().getCost())) {
//                     this.NewUnit(SoldierUnit.getName(), pos);
//                     this.placed++;
//                 }
//             }
//         }

//         if (this.era.canAffordNextEra(this.resources)) {
//             this.era.advanceToNextEra(this.resources);
//             this.targetMerchantNum = 25;
//         }
//     }

//     countUnit(unitType : new (...args: any[]) => Unit) : number {
//         let count = 0;
//         this.board.entities.forEach((unit : Unit) => {
//             if (unit instanceof unitType) {
//                 count++
//             }
//         });
//         return count;
//     }
// }