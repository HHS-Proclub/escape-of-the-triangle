/**
 * Contains the main functions used in the game.
 */

module.exports = {
    loadLevel,
    useBlock,
    update
};

const { v4: uuidv4 } = require("uuid");
const { parseLevel } = require("./levelParser");

const { Board } = require("../modules/Board");
const { Triangle } = require("../modules/Triangle");
const { Goal } = require("../modules/Goal");
const { Blocks } = require("../modules/Blocks");

DISABLE_TIME = 500;

function loadLevel(state, level) {
    Object.assign(state, parseLevel(level, state.players.length));
}

function useBlock(state, id, player) {
    const block = state.blocks.blocks.find(e => e.id === id);
    console.log(block, player);
    if (typeof block === "undefined") return;
    else if (!block.canUse) return;
    else if (block.player !== -1 && block.player !== player) return;
    else if (block.uses > 0) block.uses--;

    // Use this block
    console.info(`Client used "${block.text}"`);
    activeState = state;
    eval(block.action);

    return block;
}

function update(state, dt) {
    return "ok";
}

// GAME FUNCTIONS

let activeState;

function moveForward(steps) {
    const state = activeState;
    const ci = [0, 1, 0, -1];
    const cj = [1, 0, -1, 0];
    for (let x = 0; x < steps; x++) {
        state.triangle.i += ci[state.triangle.d];
        state.triangle.j += cj[state.triangle.d];
    }
}

function turnLeft() {
    const state = activeState;
    state.triangle.d--;
    if (state.triangle.d === -1) state.triangle.d = 3;
}

function turnRight() {
    const state = activeState;
    state.triangle.d++;
    if (state.triangle.d === 4) state.triangle.d = 0;
}