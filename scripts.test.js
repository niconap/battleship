let { Ship, Gameboard } = require("./scripts");

test('correctly creates a hit array', () => {
    let ship = new Ship(5);
    expect(ship.hitArray).toStrictEqual([
        false, false, false, false, false
    ]);
    ship = new Ship(3);
    expect(ship.hitArray).toStrictEqual([
        false, false, false
    ]);
});

test('correctly hits the right spots in a ship', () => {
    let ship = new Ship(5);
    ship.hit(3);
    expect(ship.hitArray).toStrictEqual([
        false, false, false, true, false
    ]);
    ship.hit(0);
    expect(ship.hitArray).toStrictEqual([
        true, false, false, true, false
    ])
});

test('correctly calculates whether or not a ship has been sunk', () => {
    let ship = new Ship(5);
    ship.isSunk();
    expect(ship.sunk).toBe(false);
    for (let i = 0; i < ship.length; i++) {
        ship.hit(i);
    }
    expect(ship.sunk).toBe(true);
});

test.skip('correctly adds ships to the ship array', () => {
    let gameboard = new Gameboard();
    gameboard.placeShip(5, 4, "v", 5);
    expect(gameboard.ships[0]).toEqual({
        ship: new Ship(5),
        x: 5,
        y: [4, 5, 6, 7, 8],
        or: "v"
    });
    gameboard.placeShip(2, 3, "h", 3);
    expect(gameboard.ships[1]).toEqual({
        ship: new Ship(3),
        x: [2, 3, 4],
        y: 3,
        or: "h"
    });
});

test('correctly handles an attack that hits a ship', () => {
    let gameboard = new Gameboard();
    gameboard.placeShip(5, 4, "v", 5);
    gameboard.receiveAttack(5, 5);
    expect(gameboard.ships[0].ship.hitArray).toEqual([
        false, true, false, false, false
    ])
    gameboard.placeShip(3, 3, "h", 3);
    gameboard.receiveAttack(4, 3);
    expect(gameboard.ships[1].ship.hitArray).toEqual([
        false, true, false
    ]);
});

test('correctly registers missed attacks', () => {
    let gameboard = new Gameboard();
    gameboard.placeShip(5, 4, "v", 5);
    gameboard.receiveAttack(6, 4);
    expect(gameboard.missedAttacks).toStrictEqual([
        {
            x: 6,
            y: 4
        }
    ]);
})