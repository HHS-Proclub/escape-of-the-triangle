/**
 * Contains code that's related to the initialScreen.
 */

const { roomStates, clientToRoom, getEmitState, io } = require("../server");

const { makeid } = require("./util");

module.exports = {
    initInitialScreen
};

function initInitialScreen(client) {
    client.on("newRoom", () => handleNewRoom(client));
    client.on("joinRoom", code => handleJoinRoom(code, client));
}

function handleNewRoom(client) {
    if (client.id in clientToRoom) return;  // Already in a room
    // Generate unique room code
    if (Object.keys(roomStates).length === 1000000) {
        client.emit("errorInvalidRoom", "Could not create a new room!");
        return;
    }
    
    let code;
    do {
        code = makeid(6);
    } while (code in roomStates);

    // Update client to code mapping and generate default room state
    clientToRoom[client.id] = code;
    const state = { code, clients: [client], players: [] };
    state.players[0] = {
        name: "Anonymous",
        ready: false
    };
    roomStates[code] = state;

    // Send room code to client
    client.join(code);
    client.emit("infoRequest", code);

    console.info(`Client ${client.id} made new room with code ${code}`);
}

function handleJoinRoom(code, client) {
    if (client.id in clientToRoom) return;  // Already in a room
    if (!(code in roomStates)) {
        client.emit("errorInvalidRoom", "Invalid room code!");
        return;
    }
    const state = roomStates[code];
    if (state.players.length === 4) {
        client.emit("errorInvalidRoom", "This room is full!");
        return;
    }

    // Update client to code mapping and generate default room state
    clientToRoom[client.id] = code;
    state.clients.push(client);
    state.players[state.players.length] = {
        name: "Anonymous",
        ready: false
    };
    roomStates[code] = state;

    // Send room code to client
    client.join(code);
    client.emit("infoRequest", code);

    console.info(`Client ${client.id} is joining room ${code}`);
}