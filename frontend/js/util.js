/**
 * This files contains some utility functions.
 */

export { drawRegularPolygon, getAbsoluteHeight };

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

// https://stackoverflow.com/questions/10787782/full-height-of-a-html-element-div-including-border-padding-and-margin
function getAbsoluteHeight(el) {
    // Get the DOM Node if you pass in a string
    el = (typeof el === 'string') ? document.querySelector(el) : el; 
  
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
                 parseFloat(styles['marginBottom']);
  
    return Math.ceil(el.offsetHeight + margin);
}