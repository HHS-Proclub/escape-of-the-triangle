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
    state.status = "ok";
}

function useBlock(state, id, player) {
    if (state.status !== "ok") return;

    const block = state.blocks.blocks.find(e => e.id === id);
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
    for (let x = 0; x < steps && state.status === "ok"; x++) {
        let ni = state.triangle.i + ci[state.triangle.d];
        let nj = state.triangle.j + cj[state.triangle.d];
        // In bounds?
        if (ni < 0 || ni >= state.board.gridSize || nj < 0 || nj >= state.board.gridSize) return;
        // Valid cell?
        let c = state.board.getCell(ni, nj);
        if (c === 'X') return;
        else if (c === 'D') {
            state.triangle.i = ni;
            state.triangle.j = nj;
            state.status = "fail";
            return;
        }

        // Move the triangle
        state.triangle.i = ni;
        state.triangle.j = nj;

        // Reached goal?
        if (state.goal.i === ni && state.goal.j === nj) {
            state.status = "pass";
            return;
        }
    }
}

function turnLeft() {
    const state = activeState;
    if (state.status !== "ok") return;
    state.triangle.d--;
    if (state.triangle.d === -1) state.triangle.d = 3;
}

function turnRight() {
    const state = activeState;
    if (state.status !== "ok") return;
    state.triangle.d++;
    if (state.triangle.d === 4) state.triangle.d = 0;
}

function resetLevel() {
    const state = activeState;
    state.status = "fail";
}