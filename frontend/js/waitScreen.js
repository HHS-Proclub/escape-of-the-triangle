/**
 * Contains code that's related to the waitScreen.
 */

import { screens, switchScreen, socket } from "./index.js";
import { blocks, initLevel, setPlayer } from "./gameScreen.js";

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
    
    document.getElementById("lobbyGameCode").innerHTML = `Game Code: ${state.code}`;
    document.getElementById("lobbyPlayerCount").innerHTML = `Players: ${state.players.length}/4`;
    const lobbyPlayerList = document.getElementById("lobbyPlayerList");
    lobbyPlayerList.innerHTML = "";
    for (let player of state.players) {
        // https://stackoverflow.com/questions/18749591/encode-html-entities-in-javascript
        var safeName = player.name.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#' + i.charCodeAt(0) + ';';
        });
        if (socket.id !== player.id) {
            lobbyPlayerList.innerHTML += `${safeName}<br>`;
        } else {
            lobbyPlayerList.innerHTML += `<u>${safeName}</u><br>`;
        }
    }
    // Update player ID
    const player = state.players.findIndex(e => socket.id === e.id);
    setPlayer(player);
    // Only the host (first player) can start the game
    if (player === 0) {
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