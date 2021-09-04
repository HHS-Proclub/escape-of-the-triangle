/**
 * Contains code that's related to the waitScreen.
 */

import { screens, switchScreen, socket } from "./index.js";
import { blocks, initLevel } from "./gameScreen.js";

export { initWaitScreen };

/**
 * Initalizes the waitScreen. Called once the page loads.
 */
function initWaitScreen() {
    document.getElementById("lobbyStartButton").onclick = lobbyStart;

    socket.on("joinLobby", state => handleJoinLobby(state));
    socket.on("updateLobby", state => handleUpdateLobby(state));
    socket.on("errorInvalidLevel", msg => {
        alert("Invalid starting level (must be a whole number)!");
    });
}

function handleJoinLobby(state) {
    switchScreen(screens.waitScreen);
    if ("level" in state) {
        switchScreen(screens.gameScreen);
        initLevel(state);
    }
    handleUpdateLobby(state);
}

function handleUpdateLobby(state) {
    console.info("lobby", state);
    
    document.getElementById("lobbyGameCode").textContent = `Game Code: ${state.code}`;
    document.getElementById("lobbyPlayerCount").textContent = `Players: ${state.players.length}/4`;
    const playerList = document.getElementById("lobbyPlayerList");
    playerList.innerHTML = "";
    for (let player of state.players) {
        playerList.innerHTML += `<p><b>${player.name}</b></p>`;
    }
    // Update player ID
    blocks.player = state.players.findIndex(e => socket.id === e.id);
    // Only the host can start the game
    if (blocks.player === 0) {
        document.getElementById("lobbyStartButton").textContent = "Start Game";
        document.getElementById("lobbyStartButton").disabled = false;
    } else {
        document.getElementById("lobbyStartButton").textContent = "Start Game (Host Only)";
        document.getElementById("lobbyStartButton").disabled = true;
    }
}

function lobbyStart() {
    const level = document.getElementById("startingLevelInput").value;
    socket.emit("lobbyStart", level);
}