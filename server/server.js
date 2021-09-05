/**
 * This file contains the main server code.
 */

// --- GLOBAL VARIABLES ---

const roomStates = {};
const clientToRoom = {};

// Allow all origins (CORS)
require("./app");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

module.exports = {
    roomStates,
    clientToRoom,
    getEmitState,
    io
};

// --- IMPORTS ---

const { initInitialScreen } = require("./js/initialScreen");
const { initNameScreen } = require("./js/nameScreen");
const { initWaitScreen } = require("./js/waitScreen");
const { initGameScreen } = require("./js/gameScreen");

// --- SOCKET HANDLING ---

// Initial client connection
io.on("connection", client => {
    console.info(`Client ${client.id} connected!`);

    initInitialScreen(client);
    initNameScreen(client);
    initWaitScreen(client);
    initGameScreen(client);

    // Handle client disconnect
    client.on("disconnect", () => handleDisconnect(client));
});

function handleDisconnect(client) {
    console.info(`Client ${client.id} disconnected!`);

    if (!(client.id in clientToRoom)) return;

    const state = roomStates[clientToRoom[client.id]];
    state.clients.splice(client.playerNum, 1);
    state.players.splice(client.playerNum, 1);
    if (state.players.length === 0) {
        console.info(`Cleaning up room ${clientToRoom[client.id]}`);

        // Clean up the room
        if ("level" in state) {
            clearInterval(state.intervalId);
        }
        delete roomStates[clientToRoom[client.id]];
    } else {
        const emitState = getEmitState(state);
        client.to(clientToRoom[client.id]).emit("updateLobby", emitState);
    }

    delete clientToRoom[client.id];

    console.log(roomStates);
    console.log(clientToRoom);
}

function getEmitState(state) {
    const emitState = {
        code: state.code,
        players: state.players,
        level: state.level,
        status: state.status,
        board: state.board,
        triangle: state.triangle,
        goal: state.goal,
        blocks: state.blocks
    };
    for (let i = 0; i < state.players.length; i++) {
        emitState.players[i].id = state.clients[i].id;
    }
    return emitState;
}

// Listen for connections
http.listen(3000, function() {
    console.info("Listening on *:3000");
});