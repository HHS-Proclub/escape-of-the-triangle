/**
 * This file contains functions used to parse a level from a file.
 */

module.exports = {
    parseLevel
};

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { Board } = require("../modules/Board");
const { Triangle } = require("../modules/Triangle");
const { Goal } = require("../modules/Goal");
const { Blocks } = require("../modules/Blocks");

function readFromFile(filepath) {
    let input = fs.readFileSync(filepath);
    input = input.toString("utf8").trim().split("\n").map(e => e.trim());
    return input;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function parseLevel(level, playerCount) {
    let levelNames = readFromFile(path.join(__dirname, "..", "levels", "levels.txt"));
    // console.info(`${levelNames.length} levels loaded`);
    // console.info(levelNames);
    if (level >= levelNames.length) {
        console.warn(`Level ${level} does not exist, there are only ${levelNames.length} levels!`);
        level = levelNames.length-1;
    }

    // Parse the map, triangle, and goal
    let input = readFromFile(path.join(__dirname, "..", "levels", levelNames[level], "map.txt"));
    // Map
    let gridSize = Number(input[0]);
    let board = new Board(gridSize);
    for (let i = 0; i < gridSize; i++) {
        if (input[i+1].length !== gridSize) throw(`Level ${level} map row ${i} is not the correct length!`);
        for (let j = 0; j < gridSize; j++) {
            board.setCell(i, j, input[i+1][j]);
        }
    }
    input.splice(0, gridSize+1);
    // Triangle
    let nums = input[0].split(' ').map(e => Number(e));
    let triangle = new Triangle(...nums);
    // Goal
    nums = input[1].split(' ').map(e => Number(e));
    let goal = new Goal(...nums);

    // Parse the blocks
    input = readFromFile(path.join(__dirname, "..", "levels", levelNames[level], "blocks.txt"));
    let numBlocks = Number(input[0]);
    let blocks = new Blocks();
    let currLine = 1;
    // Each player gets a random set of blocks
    let randPlayerMap = [];
    let playerNumBlocks = [];
    for (let i = 0; i < playerCount; i++) {
        randPlayerMap.push(i);
        playerNumBlocks.push(0);
    }
    randPlayerMap = shuffleArray(randPlayerMap);
    for (let i = 0; i < numBlocks; i++) {
        // Parse block details
        let [ player, uses ] = input[currLine++].split(' ').map(e => Number(e));
        let text = input[currLine++];
        while (input[currLine]) text += '<br>' + input[currLine++];
        currLine++;
        let action = input[currLine++];
        while (input[currLine]) action += ' ' + input[currLine++];
        currLine++;

        // Distribute blocks to players
        if (player >= 0) {
            if (playerCount === 3 && player === 3) player = Math.floor(Math.random() * 3);
            else if (playerCount === 2) {
                if (player === 3) player = 0;
                else if (player === 2) player = 1;
            } else if (playerCount === 1) player = 0;
        }

        // Add the block
        blocks.addBlock(uuidv4(), (player < 0 ? player : randPlayerMap[player]), text, action, uses, true);
        if (player >= 0) playerNumBlocks[randPlayerMap[player]]++;
    }

    // Add a reset block to the person with the least blocks
    let resetText = (level > 5 ? "resetLevel();" : "Reset level");
    let minBlocks = Math.min(...playerNumBlocks);
    let minChoices = [];
    for (let i = 0; i < playerCount; i++) {
        if (playerNumBlocks[i] === minBlocks) minChoices.push(i);
    }
    blocks.addBlock(uuidv4(), minChoices[Math.floor(Math.random()*minChoices.length)], resetText, "resetLevel();", 1, true);

    // Parse title, flavor text, and tips
    const aboutPath = path.join(__dirname, "..", "levels", levelNames[level], "about.txt");
    let titleText = "";
    let flavorText = "";
    let tipsText = "";
    if (fs.existsSync(aboutPath)) {
        input = readFromFile(aboutPath);
        titleText = input[0];
        currLine = 2;
        flavorText = input[currLine++];
        while (input[currLine] !== "===") flavorText += '<br>' + input[currLine++];
        currLine++;
        tipsText = input[currLine++];
        while (input[currLine] !== "===") tipsText += '<br>' + input[currLine++];
        currLine++;
    }

    const toggles = [0, 0, 0, 0];

    const state = {
        board,
        triangle,
        goal,
        toggles,
        variables: {},
        blocks,
        titleText,
        flavorText,
        tipsText
    };
    // console.log(state);
    
    console.info(`Loaded level ${levelNames[level]}`);
    return state;
}