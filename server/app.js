/**
 * This file contains the server's admin panel code.
 */

// --- IMPORTS ---
const app = require("express")();

// Admin website

app.get("/", function(req, res) {
    res.sendFile("index.html", { root: path.join(__dirname, "/public") });
});