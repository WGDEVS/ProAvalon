// modified from ref of the rain.js

class SingleM4 {
    constructor(thisRoom) {
        this.thisRoom = thisRoom;
        this.houserule = 'SingleM4';

        this.description = 'M4 only requires a single fail.';
    }
}

module.exports = SingleM4;
