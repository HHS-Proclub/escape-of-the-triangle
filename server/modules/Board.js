/**
 * This class represents the board.
 * 
 * BOARD SYMBOLS
 * '.' - An empty tile. No restrictions.
 * 'X' - A lava tile. The triangle cannot step on this.
 */

class Board {
    constructor(gridSize) {
        // Create an empty board
        this.gridSize = gridSize;
        this.board = [...Array(gridSize)].map(e => Array(gridSize).fill('.'));
    }

    setCell(row, col, value) {
        if (row < 0 || row >= this.gridSize) throw("Row index out of bounds!");
        if (col < 0 || col >= this.gridSize) throw("Col index out of bounds!");

        this.board[row][col] = value;
    }
}

module.exports = { Board };