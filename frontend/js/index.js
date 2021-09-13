/**
 * Made with help from https://www.youtube.com/watch?v=ppcBIHv_ZPs
 */

import { initInitialScreen } from "./initialScreen.js";
import { initNameScreen } from "./nameScreen.js";
import { initWaitScreen } from "./waitScreen.js";
import { initGameScreen } from "./gameScreen.js";

export { socket, screens, switchScreen };

// CHANGE THIS
// const socket = io("http://localhost:3000");
const socket = io("https://escapeofthetriangle.herokuapp.com/");

// Measure ping
setInterval(function() {
    let time = Date.now();
    socket.emit('ping', time);
}, 10000);
socket.on('pong', function(time) {
    let latency = (Date.now() - time) / 2;
    console.log(`Ping: ${latency}ms`);
});

const screens = {
    initialScreen: document.getElementById("initialScreen"),
    nameScreen: document.getElementById("nameScreen"),
    waitScreen: document.getElementById("waitScreen"),
    gameScreen: document.getElementById("gameScreen")
};

window.onload = () => {
    initInitialScreen();
    initNameScreen();
    initWaitScreen();
    initGameScreen();
    console.info("All screens initialized!");
};

// https://stackoverflow.com/questions/5241981/disable-mouse-double-click-using-javascript-or-jquery
document.addEventListener( 'dblclick', function(event) {  
    event.preventDefault();  
    event.stopPropagation(); 
  },  true
);

function switchScreen(newScreen) {
    for (let screen in screens) {
        if (screens[screen] !== newScreen) screens[screen].style.display = "none";
        else screens[screen].style.display = "block";
    }
}
