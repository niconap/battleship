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

module.exports = { Ship };