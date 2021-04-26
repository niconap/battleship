function Ship(length) {
    this.length = length;
    this.hitArray = createHitArray(this.length);
    this.sunk = false;
    
    // Create an array that has falses in it (which represent spots
    // that haven't been hit) based on the length of the ship
    function createHitArray(length) {
        let array = [];
        for (i = 0; i < length; i++) {
            array.push(false);
        }
        return array;
    }

    // Turn one of the array values into 'true', which represents that
    // that spot has been hit
    this.hit = function(spot) {
        this.hitArray[spot] = true;
    }

    // See whether or not the ship has been sunk based on the hitArray
    this.isSunk = function() {
        return this.hitArray.every(element => {
            if (element) {
                return true;
            } else {
                return false;
            }
        });
    }
}

function Gameboard() {
    // Stores all the ships, their coordinates and orientations
    this.ships = [];

    // Stores all the coordinates of missed spots
    this.missedAttacks = [];

    // Make an object with a Ship(), coordinates and orientation
    this.placeShip = function(x, y, or, length) {
        if (or == "v") {
            let yco = y;
            y = [];
            for (let i = yco; i < yco + length; i++) {
                y.push(i);
            }
        } else if (or == "h") {
            let xco = x;
            x = [];
            for (let i = xco; i < xco + length; i++) {
                x.push(i);
            }
        }
        this.ships.push({
            ship: new Ship(length),
            x,
            y,
            or
        })
    }

    // Handle attacks by determining if a ship has been hit or not and
    // telling the ship that has been hit where it's been hit
    this.receiveAttack = function(x, y) {
        this.ships.forEach(element => {
            if (element.x == x || element.y == y) {
                if (element.or == "v") {
                    if (element.y.includes(y)) {
                        element.ship.hit(element.y.indexOf(y));
                    }
                } else if (element.or == "h") {
                    if (element.x.includes(x)) {
                        element.ship.hit(element.x.indexOf(x));
                    }
                }
            }
        })
    }
}

module.exports = { Ship, Gameboard };