let { Ship } = require("./scripts");

test('correctly creates a hit array', () => {
    let ship = new Ship(5);
    expect(ship.hitArray).toStrictEqual([
        false, false, false, false, false
    ]);
});

test('correctly hits the right spots in a ship', () => {
    let ship = new Ship(5);
    ship.hit(3)
    expect(ship.hitArray).toStrictEqual([
        false, false, false, true, false
    ]);
});

test('correctly calculates whether or not a ship has been sunk', () => {
    let ship = new Ship(5);
    expect(ship.isSunk()).toBe(false);
    for (let i = 0; i < ship.length; i++) {
        ship.hit(i);
    }
    expect(ship.isSunk()).toBe(true);
});