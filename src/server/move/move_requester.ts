import { Unit } from "../unit/unit";
import { Pos } from "../pos";
import { MoveRequestHandler } from "./move_request_handler";

export abstract class MoveRequester {
    board : MoveRequestHandler;
    abstract sendMoveRequest(entity : Unit, pos : Pos);
}