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

  // Check if any of the spots the ship will occupy aren't occupied
  // by another ship
  this.checkBoard = function(x, y, or, length) {
    return this.ships.some(ship => {
      if (ship.or == "v") {
        if (or == "v" && ship.x == x ) {
          let found = ship.y.some(coord => y.indexOf(coord) >= 0);
          return found;
        } else if (or == "h") {
          let foundX = x.includes(ship.x);
          let foundY = ship.y.includes(y);
          if (foundX && foundY) {
            return true; 
          } else {
            return false;
          }
        }
      } else if (ship.or == "h") {
        if (or == "v") {
          let foundX = ship.x.includes(x);
          let foundY = y.includes(ship.y);
          if (foundX && foundY) {
            return true; 
          } else {
            return false;
          }
        } else if (or == "h" && ship.y == y) {
          let found = ship.x.some(coord => x.indexOf(coord) >= 0);
          return found;
        }
      }
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

  // Render the gameboard
  this.render = function(name) {
    let container = document.getElementById(name);
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

function gameloop() {
  let playerBoard = new Gameboard();
  let computerBoard = new Gameboard();
  let player = new Player(false, computerBoard);
  let computer = new Player(true, playerBoard);

  // Randomly place 5 ships for the computer 
  let shipLengths = [2, 3, 3, 4, 5];
  let orientations = ["v", "h"];

  // Fisher-Yates algorithm (randomizes array)
  for (var i = shipLengths.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shipLengths[i];
    shipLengths[i] = shipLengths[j];
    shipLengths[j] = temp;
  }

  // Create arrays of possible coordinates
  shipLengths.forEach(element => {
    let spots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let orientation = orientations[(Math.random() >= 0.5) ? 1 : 0];
    let x = [];
    let y = [];
    if (orientation == "v") {
      x = spots;
      y = spots.slice(0, 11 - element);
    } else if (orientation == "h") {
      y = spots;
      x = spots.slice(0, 11 - element);
    }
  })
}

module.exports = { Ship, Gameboard, Player };