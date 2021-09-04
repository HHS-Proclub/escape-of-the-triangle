/**
 * Contains code that's related to the gameScreen.
 */

import { screens, switchScreen, socket } from "./index.js";

import { Board } from "../modules/Board.js";
import { Triangle } from "../modules/Triangle.js";
import { Goal } from "../modules/Goal.js";
import { Blocks } from "../modules/Blocks.js";

export { initGameScreen, initLevel, blocks };

// Constants
const CANVAS_SIZE = 600;
const FRAME_RATE = 60;

// Variables
let canvas, ctx;
let board, triangle, goal, blocks;
let lastTime;

/**
 * Initalizes the gameScreen. Called once the page loads.
 */
function initGameScreen() {
    // Get the canvas and 2D context
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvas.height = CANVAS_SIZE;
    // Set the blockList size
    document.getElementById("blockList").style.width = `${CANVAS_SIZE}px`;

    // Create a default state
    board = new Board(3, canvas);
    board.setCell(0, 0, 'X');
    board.setCell(2, 0, 'X');
    board.setCell(0, 2, 'X');
    board.setCell(2, 2, 'X');
    triangle = new Triangle(2, 1, 3, canvas, board);
    goal = new Goal(0, 1, canvas, board);
    blocks = new Blocks();
    blocks.addBlock(1, -1, "moveForward(1);", "moveForward(1);", -1, true);
    blocks.addBlock(2, -1, "turnLeft();", "turnLeft();", -1, true);

    setInterval(() => {
        const currTime = new Date().getTime();
        const dt = (currTime - lastTime) / 1000;
        lastTime = currTime;
        update(dt);
    }, 1000 / FRAME_RATE);

    socket.on("initLevel", state => initLevel(state));
    socket.on("newGameState", state => handleNewGameState(state));
}

/**
 * Initializes a new level, removing any data from previous levels.
 * @param {*} state 
 */
function initLevel(state) {
    console.info("init", state);

    // Update objects
    Object.assign(board, state.board);
    Object.assign(goal, state.goal);
    Object.assign(triangle, state.triangle);
    Object.assign(blocks, state.blocks);
    blocks.initBlocks(socket);

    switchScreen(screens.gameScreen);
}

/**
 * Updates the current level's game state.
 * @param {*} state 
 */
function handleNewGameState(state) {
    console.info("update", state);

    // Update objects
    Object.assign(board, state.board);
    Object.assign(goal, state.goal);
    Object.assign(triangle, state.triangle);
    for (let block of state.blocks.blocks) {
        const currBlock = blocks.blocks.find(e => e.id === block.id);
        if (typeof currBlock !== "undefined") {
            Object.assign(currBlock, block);
        } else blocks.blocks.push(block);
    }
}

/**
 * Main update loop. Called once every frame.
 * @param {*} dt 
 */
function update(dt) {
    // Render objects
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    board.render();
    goal.render(board);
    triangle.render(board);
    blocks.renderBlocks(socket);
}