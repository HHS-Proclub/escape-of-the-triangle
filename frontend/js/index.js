/**
 * Made with help from https://www.youtube.com/watch?v=ppcBIHv_ZPs
 */

import { initInitialScreen } from "./initialScreen.js";
import { initNameScreen } from "./nameScreen.js";
import { initWaitScreen } from "./waitScreen.js";
import { initGameScreen } from "./gameScreen.js";

export { socket, screens, switchScreen };

const socket = io("http://localhost:3000");

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

function switchScreen(newScreen) {
    for (let screen in screens) {
        if (screens[screen] !== newScreen) screens[screen].style.display = "none";
        else screens[screen].style.display = "block";
    }
}
