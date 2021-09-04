/**
 * Contains code that's related to the nameScreen.
 */

const { roomStates, clientToRoom, getEmitState, io } = require("../server");

module.exports = {
    initNameScreen
};

function initNameScreen(client) {
    client.on("playerInfo", name => handlePlayerInfo(name, client));
}

function handlePlayerInfo(name, client) {
    if (!(client.id in clientToRoom)) {
        client.emit("errorDisconnected");
        return;
    }
    if (name.length === 0) {
        client.emit("errorInvalidUsername", "Username cannot be empty!");
        return;
    }
    if (name.length >= 32) {
        client.emit("errorInvalidUsername", "Username cannot be longer than 32 characters!");
        return;
    }
    const state = roomStates[clientToRoom[client.id]];
    const matchPlayer = state.players.find(e => e.name === name);
    if (typeof matchPlayer !== "undefined") {
        client.emit("errorInvalidUsername", "Username already taken!");
        return;
    }

    // Update player info
    state.players[client.player].name = name;
    state.players[client.player].ready = true;

    // Broadcast lobby info
    const emitState = getEmitState(state);
    client.emit("joinLobby", emitState);
    client.to(clientToRoom[client.id]).emit("updateLobby", emitState);

    console.info(`Client ${client.id}'s username is ${name}`);
}