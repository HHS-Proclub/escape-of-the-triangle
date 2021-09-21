/**
 * This file contains the server's admin panel code.
 */

// --- IMPORTS ---
const { app, roomStates } = require("./server");

// Admin website

app.get("/", function(req, res) {
    numPlayers = 0
    for (let room in roomStates) {
        numPlayers += roomStates[room].players.length;
    }
    toEmit = `Number of rooms: ${Object.keys(roomStates).length}<br>`;
    toEmit += `Number of players: ${numPlayers}<br>`;
    for (let room in roomStates) {
        toEmit += `${roomStates[room].code} (Players: ${roomStates[room].players.length}/4) is on level ${roomStates[room].level}<br>`;
    }
    res.send(toEmit);
    // res.sendFile("index.html", { root: path.join(__dirname, "/public") });
});