/**
 * This class represents the board.
 * 
 * BOARD SYMBOLS
 * '.' - An empty tile. No restrictions.
 * 'X' - A lava tile. The triangle cannot step on this.
 */

const BORDER_SIZE = 2;

import { drawRoundRect } from "../js/util.js";

export class Board {
    constructor(gridSize, canvas) {
        // Create an empty board
        this.gridSize = gridSize;
        this.board = [...Array(gridSize)].map(e => Array(gridSize).fill('.'));
        // Set the canvas and context
        if (typeof canvas !== "undefined") {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
        }
    }

    setCell(row, col, value) {
        if (row < 0 || row >= this.gridSize) throw("Row index out of bounds!");
        if (col < 0 || col >= this.gridSize) throw("Col index out of bounds!");

        this.board[row][col] = value;
    }

    getCell(row, col) {
        return this.board[row][col];
    }

    getCenter(row, col) {
        let size = this.getCellSize();
        let x1 = col*size;
        let y1 = row*size;
        let x2 = (col+1)*size + BORDER_SIZE;
        let y2 = (row+1)*size + BORDER_SIZE;
        return {
            x: (x1+x2)/2,
            y: (y1+y2)/2
        };
    }

    getCellSize() {
        return (this.canvas.width - BORDER_SIZE) / this.gridSize;
    }

    getInsideCellSize() {
        return this.getCellSize() - BORDER_SIZE;
    }

    render(frame, toggles, toggleTimes) {
        if (canvas.width !== canvas.height) throw("Canvas is not a square!");

        const canvasSize = this.canvas.width;
        const ctx = this.ctx;
        const gridSize = this.gridSize;

        // Clear the grid
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; //"#eaeaea";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Color the cells
        const size = this.getCellSize();
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (this.board[i][j] === '.') {
                    // Do nothing
                } else if (this.board[i][j] === 'X') {
                    ctx.fillStyle = "#333";
                    ctx.fillRect(j*size, i*size, size, size);
                } else if (this.board[i][j] === 'D') {
                        ctx.fillStyle = "#aa0000";
                        ctx.fillRect(j*size, i*size, size, size);
                } else if (this.board[i][j] >= '1' && this.board[i][j] <= '4') {
                    // Growing wall when toggled
                    let color = Number(this.board[i][j])-1;

                    let fillValue, strokeValue;
                    if (color === 0) {
                        fillValue = "0, 224, 0";
                        strokeValue = "0, 100, 0";
                    } else if (color === 1) {
                        fillValue = "44, 117, 255";
                        strokeValue = "17, 50, 110";
                    } else if (color === 2) {
                        fillValue = "172, 0, 230";
                        strokeValue = "70, 0, 90";
                    } else if (color === 3) {
                        fillValue = "223, 206, 2";
                        strokeValue = "90, 93, 0";
                    }

                    let smallSize, offset;
                    if (toggles[color] === 0 || toggleTimes[color] <= 0) {
                        ctx.fillStyle = `rgba(${fillValue}, 1)`;
                        ctx.strokeStyle = `rgba(${strokeValue}, 1)`;
                        ctx.lineWidth = BORDER_SIZE;
                        smallSize = size/1.3;
                        offset = (size-smallSize)/2;
                        drawRoundRect(ctx, j*size+offset, i*size+offset, smallSize, smallSize, smallSize/5, true, true);
                    } else {
                        ctx.fillStyle = `rgba(${fillValue}, 0.5)`;
                        ctx.strokeStyle = `rgba(${strokeValue}, 1)`;
                        ctx.lineWidth = BORDER_SIZE;
                        // Small fill
                        smallSize = size/1.3 * (1 - toggleTimes[color]/toggles[color]);
                        offset = (size-smallSize)/2;
                        drawRoundRect(ctx, j*size+offset, i*size+offset, smallSize, smallSize, smallSize/5, true, false);
                        // Large border
                        smallSize = size/1.3;
                        offset = (size-smallSize)/2;
                        drawRoundRect(ctx, j*size+offset, i*size+offset, smallSize, smallSize, smallSize/5, false, true);
                    }
                    
                } else {
                    throw(`Unknown board character ${this.board[i][j]}!`);
                }
            }
        }
        
        // Grid rows and columns
        ctx.fillStyle = "rgba(0, 100, 0, 1)";
        for (let i = 1; i < gridSize; i++) {
            ctx.fillRect(0, i*size, canvas.width, BORDER_SIZE);
            ctx.fillRect(i*size, 0, BORDER_SIZE, canvas.height);
        }
        ctx.fillStyle = "rgba(0, 240, 0, 1)";
        ctx.fillRect(0, 0, canvas.width, BORDER_SIZE);
        ctx.fillRect(0, gridSize*size, canvas.width, BORDER_SIZE);
        ctx.fillRect(0, 0, BORDER_SIZE, canvas.height);
        ctx.fillRect(gridSize*size, 0, BORDER_SIZE, canvas.height);
    }
}