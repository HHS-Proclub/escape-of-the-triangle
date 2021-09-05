/**
 * This class represents the board.
 * 
 * BOARD SYMBOLS
 * '.' - An empty tile. No restrictions.
 * 'X' - A lava tile. The triangle cannot step on this.
 */

const BORDER_SIZE = 2;

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

    render() {
        if (canvas.width !== canvas.height) throw("Canvas is not a square!");

        const canvasSize = this.canvas.width;
        const ctx = this.ctx;
        const gridSize = this.gridSize;

        // Clear the grid
        ctx.fillStyle = "rgba(0, 30, 0, 0.5)"; //"#eaeaea";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Color the cells
        const size = this.getCellSize();
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                switch (this.board[i][j]) {
                    case '.':
                        break;
                    case 'X':
                        ctx.fillStyle = "#41424c";
                        ctx.fillRect(j*size, i*size, size, size);
                        break;
                    case 'D':
                        ctx.fillStyle = "#aa0000";
                        ctx.fillRect(j*size, i*size, size, size);
                        break;
                    default:
                        throw(`Unknown board character ${this.board[i][j]}!`);
                }
            }
        }
        
        // Grid rows and columns
        ctx.fillStyle = "#000000";
        for (let i = 0; i < gridSize+1; i++) {
            ctx.fillRect(0, i*size, canvas.width, BORDER_SIZE);
            ctx.fillRect(i*size, 0, BORDER_SIZE, canvas.height);
        }
    }
}