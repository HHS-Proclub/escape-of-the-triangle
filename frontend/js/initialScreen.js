/**
 * Contains code that's related to the initialScreen.
 */

import { screens, switchScreen, socket } from "./index.js";

export { initInitialScreen };

/**
 * Initalizes the initialScreen. Called once the page loads.
 */
function initInitialScreen() {
    document.getElementById("newRoomButton").onclick = newRoom;
    document.getElementById("joinRoomButton").onclick = joinRoom;

    socket.on("errorInvalidRoom", msg => {
        alert(msg);
    });
}

/**
 * Starts a new room.
 */
function newRoom() {
    socket.emit("newRoom");
}

/**
 * Joins an existing room using a room code.
 */
function joinRoom() {
    const code = document.getElementById("roomCodeInput").value;
    socket.emit("joinRoom", code);
}