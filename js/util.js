/**
* This files contains some utility functions.
*/

export { drawRegularPolygon, drawRoundRect, drawRotatedRect, getAbsoluteHeight };

// https://stackoverflow.com/questions/4839993/how-to-draw-polygons-on-an-html5-canvas
function drawRegularPolygon(numSides, size, x, y, angle, style, ctx) {
    var numberOfSides = numSides,
    Xcenter = x,
    Ycenter = y;
    
    ctx.beginPath();
    ctx.moveTo (Xcenter +  size * Math.cos(angle), Ycenter +  size *  Math.sin(angle));          
    
    for (var i = 1; i <= numberOfSides;i += 1) {
        ctx.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides + angle), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides + angle));
    }
    
    if (style === "fill") ctx.fill();
    else if (style === "stroke") ctx.stroke();
    else if (style === "both") {
        ctx.fill();
        ctx.stroke();
    } else throw(`Unknown style type ${style}!`);
}

// https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas
/**
* Draws a rounded rectangle using the current state of the canvas.
* If you omit the last three params, it will draw a rectangle
* outline with a 5 pixel border radius
* @param {CanvasRenderingContext2D} ctx
* @param {Number} x The top left x coordinate
* @param {Number} y The top left y coordinate
* @param {Number} width The width of the rectangle
* @param {Number} height The height of the rectangle
* @param {Number} [radius = 5] The corner radius; It can also be an object 
*                 to specify different radii for corners
* @param {Number} [radius.tl = 0] Top left
* @param {Number} [radius.tr = 0] Top right
* @param {Number} [radius.br = 0] Bottom right
* @param {Number} [radius.bl = 0] Bottom left
* @param {Boolean} [fill = false] Whether to fill the rectangle.
* @param {Boolean} [stroke = true] Whether to stroke the rectangle.
*/
function drawRoundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

// https://stackoverflow.com/questions/17125632/html5-canvas-rotate-object-without-moving-coordinates
function drawRotatedRect(ctx,x,y,width,height,degrees){

    // first save the untranslated/unrotated context
    ctx.save();

    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate( x+width/2, y+height/2 );
    // rotate the rect
    ctx.rotate(degrees*Math.PI/180);

    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn
    ctx.rect( -width/2, -height/2, width,height);
    
    ctx.fill();

    // restore the context to its untranslated/unrotated state
    ctx.restore();

}

// https://stackoverflow.com/questions/10787782/full-height-of-a-html-element-div-including-border-padding-and-margin
function getAbsoluteHeight(el) {
    // Get the DOM Node if you pass in a string
    el = (typeof el === 'string') ? document.querySelector(el) : el; 
    
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
    parseFloat(styles['marginBottom']);
    
    return Math.ceil(el.offsetHeight + margin);
}