import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { Pos } from "../src/server/game/pos.js";
import { Unit } from "../src/server/game/unit/unit.js";
import { SoldierUnit } from "../src/server/game/unit/melee_unit.js";
import { UnitProxy, unwrapUnit } from "../src/server/game/unit/unit_proxy.js";
import { Heart } from "../src/server/game/heart.js";

describe('UnitProxy', () => {
    let board: Board;
    let player: Player;

    beforeEach(() => {
        board = new Board(10, 10);
        player = new Player(0, new Pos(0, 0), board, "0", "", "");
    });

    it('property delegation: proxy.hp === child.hp', () => {
        let child = SoldierUnit.construct(player, new Pos(3, 3));
        let proxy = new UnitProxy(child);
        assert.strictEqual(proxy.hp, child.hp);
        assert.strictEqual(proxy.name, child.name);
        assert.strictEqual(proxy.pos, child.pos);
        assert.strictEqual(proxy.team, child.team);
        assert.strictEqual(proxy.owner, child.owner);
        assert.strictEqual(proxy.color, child.color);
    });

    it('property delegation: modify proxy.hp -> child changes', () => {
        let child = SoldierUnit.construct(player, new Pos(3, 3));
        let proxy = new UnitProxy(child);
        proxy.hp = 999;
        assert.strictEqual(child.hp, 999);
        child.hp = 42;
        assert.strictEqual(proxy.hp, 42);
    });

    it('wrap: board.entities contains proxy, observer counts correct', () => {
        let child = SoldierUnit.construct(player, new Pos(3, 3));
        board.addEntity(child);
        player.addUnit(child);
        // board has heart + child = 2 entities
        assert.strictEqual(board.entities.length, 2);
        // child observers: [Board, Player]
        assert.strictEqual(child.TESTObservers.length, 2);

        let proxy = new UnitProxy(child);
        proxy.wrap(board);

        // board should now have proxy instead of child
        assert.strictEqual(board.entities.indexOf(proxy) !== -1, true);
        assert.strictEqual(board.entities.indexOf(child), -1);
        assert.strictEqual(board.entities.length, 2);

        // child observers: [Player, UnitProxy] (Board removed, proxy added)
        assert.strictEqual(child.TESTObservers.length, 2);
        // proxy observers: [Board]
        assert.strictEqual(proxy.TESTObservers.length, 1);
    });

    it('unwrap: board.entities contains child, observers restored', () => {
        let child = SoldierUnit.construct(player, new Pos(3, 3));
        board.addEntity(child);
        player.addUnit(child);

        let proxy = new UnitProxy(child);
        proxy.wrap(board);
        proxy.unwrap(board);

        // board should have child back
        assert.strictEqual(board.entities.indexOf(child) !== -1, true);
        assert.strictEqual(board.entities.indexOf(proxy), -1);
        assert.strictEqual(board.entities.length, 2);

        // child observers: [Player, Board]
        assert.strictEqual(child.TESTObservers.length, 2);
        // proxy should have no observers
        assert.strictEqual(proxy.TESTObservers.length, 0);
    });

    it('death: kill wrapped unit -> proxy removed from board, Player.unitCount decremented', () => {
        let child = SoldierUnit.construct(player, new Pos(3, 3));
        board.addEntity(child);
        player.addUnit(child);
        assert.strictEqual(player.unitCount, 1);

        let proxy = new UnitProxy(child);
        proxy.wrap(board);

        // Kill the child
        child.hp = 1;
        child.takeDamage(1);
        board.processDeaths();

        // Proxy (and by extension child) should be removed from the board
        assert.strictEqual(board.entities.indexOf(proxy), -1);
        assert.strictEqual(board.entities.length, 1); // only heart remains
        assert.strictEqual(player.unitCount, 0);
    });

    it('stacking: proxyA wraps proxyB wraps unit, property chain works', () => {
        let child = SoldierUnit.construct(player, new Pos(3, 3));
        board.addEntity(child);
        player.addUnit(child);

        let proxyB = new UnitProxy(child);
        proxyB.wrap(board);

        let proxyA = new UnitProxy(proxyB);
        proxyA.wrap(board);

        // Properties chain through
        assert.strictEqual(proxyA.hp, child.hp);
        proxyA.hp = 77;
        assert.strictEqual(child.hp, 77);

        // Board has proxyA
        assert.strictEqual(board.entities.indexOf(proxyA) !== -1, true);
        assert.strictEqual(board.entities.indexOf(proxyB), -1);
        assert.strictEqual(board.entities.indexOf(child), -1);
    });

    it('stacking: death chain through multiple proxies', () => {
        let child = SoldierUnit.construct(player, new Pos(3, 3));
        board.addEntity(child);
        player.addUnit(child);
        assert.strictEqual(player.unitCount, 1);

        let proxyB = new UnitProxy(child);
        proxyB.wrap(board);

        let proxyA = new UnitProxy(proxyB);
        proxyA.wrap(board);

        // Kill the child
        child.hp = 1;
        child.takeDamage(1);
        board.processDeaths();

        assert.strictEqual(board.entities.indexOf(proxyA), -1);
        assert.strictEqual(board.entities.length, 1); // only heart
        assert.strictEqual(player.unitCount, 0);
    });

    it('middle unwrap: stack 3, unwrap middle, chain reconnects', () => {
        let child = SoldierUnit.construct(player, new Pos(3, 3));
        board.addEntity(child);
        player.addUnit(child);

        let proxyC = new UnitProxy(child);
        proxyC.wrap(board);

        let proxyB = new UnitProxy(proxyC);
        proxyB.wrap(board);

        let proxyA = new UnitProxy(proxyB);
        proxyA.wrap(board);

        // Unwrap middle (proxyB)
        proxyB.unwrap(board);

        // proxyA should now wrap proxyC
        assert.strictEqual(proxyA.getChild(), proxyC);
        assert.strictEqual(proxyC.parentProxy, proxyA);

        // Properties still chain through
        assert.strictEqual(proxyA.hp, child.hp);

        // Board still has proxyA
        assert.strictEqual(board.entities.indexOf(proxyA) !== -1, true);
    });

    it('middle unwrap: death still works after reconnect', () => {
        let child = SoldierUnit.construct(player, new Pos(3, 3));
        board.addEntity(child);
        player.addUnit(child);

        let proxyC = new UnitProxy(child);
        proxyC.wrap(board);

        let proxyB = new UnitProxy(proxyC);
        proxyB.wrap(board);

        let proxyA = new UnitProxy(proxyB);
        proxyA.wrap(board);

        // Unwrap middle
        proxyB.unwrap(board);

        // Kill the child
        child.hp = 1;
        child.takeDamage(1);
        board.processDeaths();

        assert.strictEqual(board.entities.indexOf(proxyA), -1);
        assert.strictEqual(board.entities.length, 1);
        assert.strictEqual(player.unitCount, 0);
    });

    it('unwrapUnit: returns innermost unit through multiple layers', () => {
        let child = SoldierUnit.construct(player, new Pos(3, 3));
        let proxyB = new UnitProxy(child);
        let proxyA = new UnitProxy(proxyB);

        assert.strictEqual(unwrapUnit(proxyA), child);
        assert.strictEqual(unwrapUnit(proxyB), child);
        assert.strictEqual(unwrapUnit(child), child);
    });

    it('unwrapUnit: works with instanceof checks', () => {
        let heart = player.heart;
        let proxy = new UnitProxy(heart);
        assert.strictEqual(unwrapUnit(proxy) instanceof Heart, true);
    });
});
