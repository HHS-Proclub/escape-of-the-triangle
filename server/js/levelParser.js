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

function parseLevel(level, playerCount) {
    let levelNames = readFromFile(path.join(__dirname, "..", "levels", "levels.txt"));
    console.info(`${levelNames.length} levels loaded`);
    console.info(levelNames);
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
    for (let i = 0; i < numBlocks; i++) {
        // Parse block details
        let [ player, uses ] = input[currLine++].split(' ').map(e => Number(e));
        let text = input[currLine++];
        while (input[currLine]) text += '\n' + input[currLine++];
        currLine++;
        let action = input[currLine++];
        while (input[currLine]) action += ' ' + input[currLine++];
        currLine++;

        // Distribute blocks to players
        if (player !== -1) {
            if (playerCount === 3 && player === 3) player = Math.floor(Math.random() * 3);
            else if (playerCount === 2) {
                if (player === 3) player = 0;
                else if (player === 2) player = 1;
            } else if (playerCount === 1) player = 0;
        }

        // Add the block
        blocks.addBlock(uuidv4(), player, text, action, uses, true);
    }

    // Add a reset block
    let resetText = (level > 5 ? "resetLevel();" : "Reset level");
    blocks.addBlock(uuidv4(), Math.floor(Math.random() * playerCount), resetText, "resetLevel();", 1, true);

    const state = {
        board,
        triangle,
        goal,
        blocks
    };
    console.log(state);
    
    console.info(`Loaded level ${levelNames[level]}`);
    return state;
}