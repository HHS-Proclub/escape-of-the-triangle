/**
 * Contains code that's related to the gameScreen.
 */

import { screens, switchScreen, socket } from "./index.js";
import { getAbsoluteHeight } from "./util.js";

import { Board } from "../modules/Board.js";
import { Triangle } from "../modules/Triangle.js";
import { Goal } from "../modules/Goal.js";
import { Blocks } from "../modules/Blocks.js";

export { initGameScreen, initLevel, blocks, setPlayer };

// Constants
const CANVAS_SIZE = 550;
const FRAME_RATE = 60;

// Variables
let canvas, ctx;
let board, triangle, goal, blocks;
let lastTime, player, frame;
let toggles = [0, 0, 0, 0], toggleTimes = [0, 0, 0, 0];

function calcWidthLimit() {
    let widthLimit;
    if (window.screen.width <= 1025) widthLimit = window.screen.width - 10;
    else widthLimit = window.screen.width * 2 / 3 - 10;
    return widthLimit;
}

function calcHeightLimit() {
    let heightLimit = window.screen.height - 70;
    return heightLimit;
}

function calcCanvasSize() {
    return Math.min(CANVAS_SIZE, Math.min(calcWidthLimit(), calcHeightLimit()));
}

/**
 * Initalizes the gameScreen. Called once the page loads.
 */
function initGameScreen() {
    // Get the canvas and 2D context
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    const fullDiv = document.getElementById("fullScreenDiv");
    setTimeout(() => {
        fullDiv.style.transition = "opacity 2s";
        fullDiv.style.opacity = "0";
    }, 50);

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
    player = -1;
    frame = 0;

    setInterval(() => {
        const currTime = new Date().getTime();
        const dt = (currTime - lastTime) / 1000;
        lastTime = currTime;
        frame++;
        update(dt);
    }, 1000 / FRAME_RATE);

    socket.on("initLevel", state => initLevel(state));
    socket.on("newGameState", state => handleNewGameState(state));
    socket.on("levelComplete", state => handleLevelComplete(state));
    socket.on("levelFailed", state => handleLevelFailed(state));
}

/**
 * Initializes a new level, removing any data from previous levels.
 * @param {*} state 
 */
function initLevel(state) {
    console.info("init", state);
    
    // Fade screen in and out
    const fullDiv = document.getElementById("fullScreenDiv");
    setTimeout(() => {
        fullDiv.style.transition = "opacity 0.3s";
        fullDiv.style.opacity = "1"
    }, 50);
    setTimeout(() => {
        blocks.blocks = [];
        handleNewGameState(state);
        blocks.initBlocks(player);
        // Update screen elements
        switchScreen(screens.gameScreen);
        setTimeout(() => fullDiv.style.opacity = "0", 300);
    }, 500)
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
    toggles = toggles.map((v, i) => {
        if (typeof state.toggles === "undefined") return v;
        else {
            if (v === 0) toggleTimes[i] = state.toggles[i];
            return state.toggles[i];
        }
    });
    for (let block of state.blocks.blocks) {
        let currBlock = blocks.blocks.find(e => e.id === block.id);
        if (typeof currBlock !== "undefined") {
            Object.assign(currBlock, block);
        } else {
            currBlock = block;
            blocks.blocks.push(block);
        }
        // Force disable block if wall color is currently toggled
        if (currBlock.action.includes("toggleWall(")) {
            const color = Number(currBlock.action["toggleWall(".length]);
            if (toggles[color] !== 0) currBlock.canUse = false;
        }
    }

    // Update right side UI
    document.getElementById("levelNumberText").innerHTML = `Level ${state.level}`;
    if (state.titleText === "") document.getElementById("levelTitleText").style.display = "none";
    else {
        document.getElementById("levelTitleText").style.display = "block";
        document.getElementById("levelTitleText").innerHTML = `<b>${state.titleText}</b>`;
    }
    if (state.flavorText === "") document.getElementById("flavorText").style.display = "none";
    else {
        document.getElementById("flavorText").style.display = "block";
        document.getElementById("flavorText").innerHTML = state.flavorText;
    }
    
    if (state.tipsText === "") {
        document.getElementById("tipsTitle").style.display = "none";
        document.getElementById("tipsText").style.display = "none";
    } else {
        document.getElementById("tipsTitle").style.display = "block";
        document.getElementById("tipsText").style.display = "block";
        document.getElementById("tipsText").innerHTML = state.tipsText;
    }

    // Blocks
    let numPlayers = state.players.length;
    const blockDivs = document.getElementById("blockDiv").children;
    for (let div of blockDivs) div.innerHTML = "";
    blockDivs[0].innerHTML = `<div><b>All</b></div>`;
    for (let i = 0; i < numPlayers; i++) {
        // https://stackoverflow.com/questions/18749591/encode-html-entities-in-javascript
        var safeName = state.players[i].name.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#' + i.charCodeAt(0) + ';';
        });
        blockDivs[i+1].innerHTML += `<div><b>${safeName}</b></div>`;
    }
    for (let block of blocks.blocks) {
        if (block.player < -1) continue;
        const blockText = `
        <div class="infoBlock d-flex align-items-center justify-content-between">
            <div class="infoBlockText">${block.text}</div>
            <div class="infoBlockUses">${block.uses === -1 ? '∞' : block.uses}</div>
        </div>
        `;
        blockDivs[block.player+1].innerHTML += blockText;
    }

    // Variables
    document.getElementById("variableDiv").innerHTML = "";
    if (Object.keys(state.variables).length === 0) {
        document.getElementById("variableTitle").style.display = "none";
        document.getElementById("variableDiv").style.display = "none";
    } else {
        document.getElementById("variableTitle").style.display = "block";
        document.getElementById("variableDiv").style.display = "block";
        for (let variable in state.variables) {
            const varText = `<div>${variable} = ${state.variables[variable]}</div>`;
            document.getElementById("variableDiv").innerHTML += varText;
        }
    }

    // Bottom info
    document.getElementById("gameCodeText").innerHTML = `<b>Game Code: ${state.code}</b>`;
    document.getElementById("gamePlayerCount").innerHTML = `<b>Players: ${state.players.length}/4</b>`;
}

/**
 * Plays a level complete animation.
 * @param {*} state 
 */
function handleLevelComplete(state) {
    console.info("Level complete!");
    
    document.body.style.transition = "";
    document.body.style.backgroundColor = "#003000";
    setTimeout(() => {
        document.body.style.transition = "background-color 2s";
        document.body.style.backgroundColor = "#000000";
    }, 50);
}

function handleLevelFailed(state) {
    console.log("Level failed...");

    document.body.style.transition = "";
    document.body.style.backgroundColor = "#300000";
    setTimeout(() => {
        document.body.style.transition = "background-color 2s";
        document.body.style.backgroundColor = "#000000";
    }, 50);
}

/**
 * Main update loop. Called once every frame.
 * @param {*} dt 
 */
function update(dt) {
    toggleTimes = toggleTimes.map(e => e-dt);

    // Dynamically resize stuff
    const canvasSize = calcCanvasSize();
    
    canvas.width = canvas.height = canvasSize;

    if (blocks.blocks.length >= 5) {
        document.getElementById("blockList").classList.add("smallBlocks");
    } else {
        document.getElementById("blockList").classList.remove("smallBlocks");
    }

    // Set the right div sizes
    document.getElementById("blockList").style.width = `${canvasSize}px`;
    document.getElementById("rightGameScreen").style.width = `300px`;

    const rightHeight = canvasSize + getAbsoluteHeight(document.getElementById("blockList"));
    document.getElementById("rightGameScreen").style.height = `${rightHeight}px`;

    // Render objects
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    board.render(frame, toggles, toggleTimes);
    goal.render(frame);
    triangle.render(frame);
    blocks.renderBlocks(socket);
}

function setPlayer(p) {
    player = p;
}