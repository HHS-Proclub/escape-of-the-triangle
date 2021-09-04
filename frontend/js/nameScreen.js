/**
 * Contains code that's related to the nameScreen.
 */

import { screens, switchScreen, socket } from "./index.js";

export { initNameScreen };

/**
 * Initalizes the nameScreen. Called once the page loads.
 */
function initNameScreen() {
    document.getElementById("infoConfirmButton").onclick = sendPlayerInfo;
    
    socket.on("infoRequest", code => handleInfoRequest(code));
    socket.on("errorDisconnected", () => {
        alert("This room is no longer available. Try joining another one.");
        switchScreen(screens.initialScreen);
    });
    socket.on("errorInvalidUsername", msg => {
        alert(msg);
    });
}

function handleInfoRequest(code) {
    switchScreen(screens.nameScreen);
}

function sendPlayerInfo() {
    const name = document.getElementById("usernameInput").value;
    socket.emit("playerInfo", name);
}