import type { GameWaitingData, PlayerWaitingData, GameSetupData } from "./bulider.js";
import type { ResourceType } from "./resource_types.js";

export interface GameData {
  playerData : PlayerSpecificData
  resources : ResourceData
  faction : FactionData
  generalData : GeneralGameData
  friendlyInvisibleUnits : UnitData[]
}

export interface GeneralHeartData {
  pos : PosData
  radius : number
  playerColor : string
}

export interface GeneralGameData {
  units : UnitData[]
  board : BoardData
  hearts : GeneralHeartData[]
}

export interface PlayerSpecificData {
  hearts : PlayerHeartData[]
  numUnits : number
  maxUnits : number
}

export interface PlayerHeartData {
  pos : PosData
  radius : number
  health : number
  totalHealth : number
}

export interface FactionData {
  factionName : string
  resourceUnits : UnitCreationData[]
  militaryUnits : UnitCreationData[]
  eraData : EraData
}

export interface EraData {
  eraName : string
  hasNextEra : boolean
  nextEraCost : ResourceData
  availableResources : ResourceType[]
}

export interface UnitCreationData {
  name : string
  cost : ResourceData
  blurb : string
}

export type ResourceData = Record<ResourceType, number>

export interface UnitData {
  name : string
  pos : PosData
  team : number
  color : string
  playerColor : string
  hp : number
  totalHP : number
  rangedData : UnitRangedAttackData
}

export interface UnitRangedAttackData {
  attacking : boolean
  ranged : boolean
  targetX : number
  targetY : number
  counter : number
  counterTotal : number
}

export interface BoardData {
  width : number
  height : number
}

export interface PosData {
  x : number
  y : number
}

export const DEFAULT_BG_IMAGE_FILE = "rocks.png";

export type RoomPhase = "waiting" | "setup" | "playing" | "gameover";

export type ReconnectData =
  | { phase: "waiting"; waitingData: GameWaitingData; playerData: PlayerWaitingData }
  | { phase: "setup"; setupData: GameSetupData; isYourTurn: boolean }
  | { phase: "playing"; factionData: FactionData; gameData: GameData }
  | { phase: "spectating"; spectatorData: GeneralGameData }
  | { phase: "gameover"; winner: string };