/**
 * This class represents the goal on the board.
 */

const GOAL_SIZE = 0.65;

export class Goal {
    constructor(i, j, canvas, board) {
        // Initial position of goal
        this.i = i;
        this.j = j;
        // Setup variables
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.board = board;
    }

    render() {
        const goalSize = this.board.getInsideCellSize() * GOAL_SIZE;

        let { x, y } = this.board.getCenter(this.i, this.j);
        
        this.ctx.fillStyle = "#0000ff";
        this.ctx.fillRect(x - goalSize/2, y - goalSize/2, goalSize, goalSize);
    }
}