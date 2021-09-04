/**
 * This class represents a list of blocks.
 */

class Blocks {
    constructor() {
        this.blocks = [];
    }

    addBlock(id, player, text, action, uses, canUse) {
        let block = {id, player, text, action, uses, canUse};
        this.blocks.push(block);
    }
}

module.exports = { Blocks };