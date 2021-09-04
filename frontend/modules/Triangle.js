/**
 * This class represents the triangle on the board.
 */

import { Board } from "./Board.js";
import { drawRegularPolygon } from "./util.js";

const TRIANGLE_SIZE = 0.45;
const OFFSET_AMOUNT = 0.2;

export class Triangle {

    /**
     * Creates a new Triangle.
     * @param {number} i 
     * @param {number} j 
     * @param {number} d 
     * @param {HTMLCanvasElement} canvas 
     * @param {Board} board 
     */
    constructor(i, j, d, canvas, board) {
        // Initial position of triangle
        this.i = i;
        this.j = j;
        this.d = d;
        this.drawI = i;
        this.drawJ = j;
        this.drawD = d;
        // Setup variables
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.board = board;
    }

    /**
     * Renders the triangle.
     */
    render() {
        this.drawI = this.i;
        this.drawJ = this.j;
        this.drawD = this.d;
        let { x, y } = this.board.getCenter(this.drawI, this.drawJ);

        const triangleSize = this.board.getInsideCellSize() * TRIANGLE_SIZE;
        const offsetAmount = triangleSize * OFFSET_AMOUNT;

        let d = this.drawD;
        x -= Math.cos(d * Math.PI / 2) * offsetAmount;
        y -= Math.sin(d * Math.PI / 2) * offsetAmount;
        
        this.ctx.fillStyle = "#00ff00";
        drawRegularPolygon(3, triangleSize, x, y, d * Math.PI / 2, "both", this.ctx);
    }
}