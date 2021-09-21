/**
 * Contains code that's related to the gameScreen.
 */

const { roomStates, clientToRoom, getEmitState, io } = require("../server");

const { loadLevel, useBlock, update } = require("./game");

module.exports = {
    initGameScreen,
    broadcastGameState,
    broadcastLevelFailed
};

// Constants
const FRAME_RATE = 1;

function initGameScreen(client) {
    client.on("lobbyStart", level => handleLobbyStart(level, client));
    client.on("blockUsed", id => handleBlockUsed(id, client));
}

function handleLobbyStart(level, client) {
    if (!(client.id in clientToRoom)) {
        client.emit("errorDisconnected");
        return;
    }
    if (level === "") level = "0";
    if (isNaN(level)) {
        client.emit("errorInvalidLevel");
        return;
    }
    const state = roomStates[clientToRoom[client.id]];
    if ("level" in state) return;  // Game already started

    // Setup game state
    state.level = Math.max(0, Number(level));
    state.lastTime = new Date().getTime();
    state.status = "ok";

    // Setup the game
    loadLevel(state, state.level);
    broadcastInitLevel(state);
    // startGameLoop(state);
}

/*
function startGameLoop(state) {
    state.intervalId = setInterval(() => {
        const currTime = new Date().getTime();
        const dt = (currTime - state.lastTime) / 1000;
        state.lastTime = currTime;
        
        const result = update(state, dt);
        console.log(`${state.code}: update ${dt} = ${result}`);
        switch (result) {
            case "ok":
                break;
            case "stop":
                console.log("Game stopped!");
                clearInterval(intervalId);
                break;
            default:
                throw(`Unknown result ${result} got from update()!`);
        }
    }, 1000 / FRAME_RATE);
}
*/

function broadcastGameState(state) {
    io.to(state.code).emit("newGameState", getEmitState(state));
}

function broadcastInitLevel(state) {
    io.to(state.code).emit("initLevel", getEmitState(state));
}

function broadcastLevelComplete(state) {
    io.to(state.code).emit("levelComplete");
    setTimeout(() => {
        state.level++;
        // Setup the game
        loadLevel(state, state.level);
        broadcastInitLevel(state);
    }, 1500);
}

function broadcastLevelFailed(state) {
    io.to(state.code).emit("levelFailed");
    setTimeout(() => {
        // Setup the game
        loadLevel(state, state.level);
        broadcastInitLevel(state);
    }, 1500);
}

function handleBlockUsed(id, client) {
    if (!(client.id in clientToRoom)) {
        client.emit("errorDisconnected");
        return;
    }

    const state = roomStates[clientToRoom[client.id]];
    // Use the block
    const block = useBlock(state, id);
    if (typeof block === "undefined") return;
    // Disable block for a bit
    block.canUse = false;
    if (block.uses !== 0) {
        setTimeout(() => {
            block.canUse = true;
            broadcastGameState(state);
        }, DISABLE_TIME);
    }

    // Broadcast new state
    broadcastGameState(state);

    // Check status
    if (state.status === "pass") {
        broadcastLevelComplete(state);
    } else if (state.status === "fail") {
        broadcastLevelFailed(state);
    }
}