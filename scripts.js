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
        this.isSunk();
    }

    // See whether or not the ship has been sunk based on the hitArray
    this.isSunk = function() {
        this.sunk = this.hitArray.every(element => {
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
                    } else {
                        this.miss(x, y);
                        console.log("hi");
                    }
                } else if (element.or == "h") {
                    if (element.x.includes(x)) {
                        element.ship.hit(element.x.indexOf(x));
                    } else {
                        this.miss(x, y);
                    }
                }
            } else {
                this.miss(x, y);
            }
        })
    }

    // If an attack misses, register it by putting its coordinates
    // in missedAttacks
    this.miss = function(x, y) {
        this.missedAttacks.push({x, y});
    }

    // Check if all ships have been sunk by going through the ships
    // array
    this.allSunk = function() {
        return this.ships.every(element => {
            if (element.ship.sunk) {
                return true;
            } else {
                return false;
            }
        })
    }
}

function Player(computer,target) {
    // See whether or not the player is a computer
    this.computer = computer;

    if (this.computer) {
        this.alreadyHit = [];

        // Send an attack to the gameboard by receiving coordinates
        this.attack = function(x, y) {
            target.receiveAttack(x, y);
            this.alreadyHit.push({ x, y });
        }

        // Check if coordinates are in the alreadyHit array
        this.checkHit = function(x, y) {
            return this.alreadyHit.some(element => {
                return element.x == x && element.y == y;
            });
        }

        // Creates two random coordinates to hit, but checks that the
        // coordinates are not in alreadyHit
        this.createCoords = function() {
            let x = Math.floor(Math.random() * 9);
            let y = Math.floor(Math.random() * 9);
            if (!this.checkHit(x, y)) {
                this.attack(x, y);
            } else {
                this.createCoords();
                return;
            }
        }
    } else {
        this.attack = function(x, y) {
            target.receiveAttack(x, y);
        }
    }
}

module.exports = { Ship, Gameboard, Player };