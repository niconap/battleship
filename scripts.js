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
    container.innerHTML = "";
    let x = 0;
    let y = 0;
    for (let i = 0; i < 100; i++){
      let box = document.createElement("div");
      box.classList.add("tile");
      let isShip = false;
      let attackX = x;
      let attackY = y;

      // Check if the x and y are occupied by a ship, if yes: give the
      // tile a ship class
      if (this.ships.length > 0) {
        this.ships.forEach(ship => {
          if (ship.or == "v") {
            if (ship.x == x) {
              if (ship.y.indexOf(y) >= 0) {
                box.classList.add("ship");
                isShip = true;
                if (name == "playerboard") {
                  let index = 0;
                  ship.ship.hitArray.forEach(element => {
                    if (element && ship.y[index] == y) {
                      box.classList.add("hit");
                    }
                    index++;
                  })
                }
              } else {
                return;
              }
            } else {
              return;
            }
          } else if (ship.or == "h") {
            if (ship.y == y) {
              if (ship.x.indexOf(x) >= 0) {
                box.classList.add("ship");
                isShip = true;
                if (name == "playerboard") {
                  let index = 0;
                  ship.ship.hitArray.forEach(element => {
                    if (element && ship.x[index] == x) {
                      box.classList.add("hit");
                    }
                    index++;
                  })
                }
              } else {
                return;
              }
            } else {
              return;
            }
          }
        });
      }

      // Check if the tile has been missed and if it's been hit
      if (name == "playerboard") {
        this.missedAttacks.forEach(coord => {
          if (coord.x == x && coord.y == y) {
            box.classList.add("miss");
          }
        })
        box.setAttribute('ondrop', `drop(event, ${x}, ${y})`);
        box.setAttribute('ondragover', `allowDrop(event)`);
      }

      // Add an eventlistener that only fires once
      let clicked = false;
      if (name == "computerboard") {
        box.addEventListener('click', () => {
          if (current && started && !clicked) {
            player.attack(attackX, attackY);
            box.classList.add("hit");
            clicked = true;
            current = false;
            checkSunk();
            gameloop();
          }
        })
      }
      
      let obj = this;
      function checkSunk() {
        if (obj.allSunk() && obj.ships.length > 0) {
          let boards = document.getElementById("container");
          let menuwrapper = document.getElementById("menuwrapper");
          let restart = document.createElement('button');
          restart.addEventListener('click', () => {
            boards.innerHTML = "<div class=\"duo\"><h1>Your board</h1><div class=\"board\" id=\"playerboard\"></div></div><div class=\"duo\"><h1>Computer's board</h1><div class=\"board\" id=\"computerboard\"></div></div>";
            initialize();
            menuwrapper.removeChild(restart);
          });
          restart.id = "restart";
          restart.innerHTML = "Restart";
          if (current) {
          menuwrapper.innerHTML = "<h2>The computer has won!</h2>";
          } else {
            menuwrapper.innerHTML = "<h2>You have won!</h2>"
          }
          menuwrapper.appendChild(restart);
          gameover = true;
          return true;
        }
      }
      container.appendChild(box);
      
      // Change the x and y to match the next box
      if (x != 9) {
        x++;
      } else {
        x = 0;
        y++
      }

    }
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
      playerBoard.render("playerboard");
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
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      if (!this.checkHit(x, y)) {
        this.attack(x, y);
      } else {
        this.createCoords();
        return;
      }
    }

    // Possible lengths and orientations
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
      let possibleX = [];
      let possibleY = [];
      let x;
      let y;
      let orientation = orientations[(Math.random() >= 0.5) ? 1 : 0];

      function createShipCoords() {
        if (orientation == "v") {
          possibleX = spots;
          possibleY = spots.slice(0, 11 - element);
        } else if (orientation == "h") {
          possibleY = spots;
          possibleX = spots.slice(0, 11 - element);
        }
        x = possibleX[Math.floor(Math.random() * possibleX.length)];
        y = possibleY[Math.floor(Math.random() * possibleY.length)];
        
        let backupX = x;
        let backupY = y;

        // Creates an array for one of the two coordinates
        if (orientation == "v") {
          let yco = y;
          y = [];
          for (let i = yco; i < yco + element; i++) {
            y.push(i);
          }
        } else if (orientation == "h") {
          let xco = x;
          x = [];
          for (let i = xco; i < xco + element; i++) {
            x.push(i);
          }
        }

        if (computerBoard.checkBoard(x, y, orientation, element)) {
          createShipCoords();
          return;
        } else {
          computerBoard.placeShip(backupX, backupY, orientation, element);
        }
      }
      createShipCoords();
    })
  } else {
    this.attack = function(x, y) {
      target.receiveAttack(x, y);
    }
  }
}

// Initialization
let computerBoard;
let playerBoard;
let player;
let current;
let started;
let computer;
let gameover;

function initialize() {
  started = false;
  gameover = false;
  playerBoard = new Gameboard();
  computerBoard = new Gameboard();
  let menuwrapper = document.getElementById("menuwrapper");
  menuwrapper.innerHTML = "";
  let choices = document.createElement("div");
  choices.id = "choices";
  choices.innerHTML = "<div class=\"template\" id=\"ship5\" draggable=\"true\" ondragstart=\"drag(event, 5)\"></div><div class=\"template\" id=\"ship4\" draggable=\"true\" ondragstart=\"drag(event, 4)\"></div><div class=\"template\" id=\"ship31\" draggable=\"true\" ondragstart=\"drag(event, 3)\"></div><div class=\"template\" id=\"ship32\" draggable=\"true\" ondragstart=\"drag(event, 3)\"></div><div class=\"template\" id=\"ship2\" draggable=\"true\" ondragstart=\"drag(event, 2)\"></div>";
  menuwrapper.appendChild(choices);
  let menu = document.createElement("div");
  menu.id = "menu";
  menu.innerHTML = "<input type=\"radio\" id=\"vertical\" name=\"orientation\" value=\"v\" checked=\"checked\"><label for=\"vertical\">Vertical</label><input type=\"radio\" id=\"horizontal\" name=\"orientation\" value=\"h\"><label for=\"horizontal\">Horizontal</label><button id=\"start\" onclick=\"startButton()\">Start</button>";
  menuwrapper.appendChild(menu);
  player = new Player(false, computerBoard);
  computer = new Player(true, playerBoard);
  playerBoard.render("playerboard");
  computerBoard.render("computerboard");
}

function gameloop() {
  if (!gameover) {
    if (current) {
      return;
    } else {
      setTimeout(() => {
        computer.createCoords();
        current = true;
      }, 600)
    }
  }
}

function drag(e, length) {
  e.dataTransfer.setData("number", length);
  let vertical = document.getElementById("vertical");
  let horizontal = document.getElementById("horizontal");
  let orientation;
  if (vertical.checked) {
    orientation = "v";
  } else if (horizontal.checked) {
    orientation = "h";
  }
  e.dataTransfer.setData("orientation", orientation)
  e.dataTransfer.setData("id", e.target.id);
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e, x, y) {
  e.preventDefault();
  let orientation = e.dataTransfer.getData("orientation");
  let data = e.dataTransfer.getData("number");
  let xco = x;
  let yco = y;

  if (orientation == "v") {
    y = [];
    for (let i = yco; i < yco + parseInt(data); i++) {
      y.push(i);
    }
  } else if (orientation == "h") {
    x = [];
    for (let i = xco; i < xco + parseInt(data); i++) {
      x.push(i);
    }
  }

  if (!playerBoard.checkBoard(x, y, orientation, data) && checkPossibleCoords(xco, yco, orientation, data)) {;
    playerBoard.placeShip(xco, yco, orientation, parseInt(data));
    playerBoard.render("playerboard");
    let template = document.getElementById(e.dataTransfer.getData("id"));
    let container = document.getElementById("choices");
    container.removeChild(template);
  }
}

function startButton() {
  if (document.querySelectorAll(".template").length < 1) {
    started = true;
    let menu = document.getElementById("menu");
    let choices = document.getElementById("choices");
    let container = document.getElementById("menuwrapper");
    container.removeChild(menu);
    container.removeChild(choices);
  }
}

function checkPossibleCoords(x, y, or, length) {
  let spots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];        
  let possibleX = [];
  let possibleY = [];
  if (or == "v") {
    possibleX = spots;
    possibleY = spots.slice(0, 11 - length);
    if (possibleY.indexOf(y) < 0) {
      return false;
    } else {
      return true;
    }
  } else if (or == "h") {
    possibleY = spots;
    possibleX = spots.slice(0, 11 - length);
    if (possibleX.indexOf(x) < 0) {
      return false;
    } else {
      return true;
    }
  }
}

initialize();
gameloop();

module.exports = { Ship, Gameboard, Player };