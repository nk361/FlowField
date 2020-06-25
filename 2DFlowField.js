import {degreesToRadians, radiansToDegrees} from "./UtilityFunctions.js";
import {Vector3D} from "./Vector3D.js";

let c = document.getElementById("canvas1");
let ctx = c.getContext("2d");

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

function oneDLerp(startVal, endVal, zeroToOneBetween) {
    return (endVal - startVal) * zeroToOneBetween + startVal;
}

function threeDLerp(startVector, endVector, zeroToOneBetween) {
    return new Vector3D(
        oneDLerp(startVector.x, endVector.x, zeroToOneBetween),
        oneDLerp(startVector.y, endVector.y, zeroToOneBetween),
        oneDLerp(startVector.z, endVector.z, zeroToOneBetween)
    );
}

function pickedVectorLerp(vectors, zeroToOneBetween) {//get the current vector out of a linear gradient between an unknown amount of vectors{

    let currentColorIndex = Math.floor(zeroToOneBetween / (1 / (vectors.length - 1)));
    if(currentColorIndex === vectors.length - 1)//float inaccuracies often caused an index out of bounds in the last return
        return vectors[vectors.length - 1];
    let currentZeroToOneBetween = (zeroToOneBetween - ((1 / vectors.length) * currentColorIndex)) * vectors.length;
    return threeDLerp(vectors[currentColorIndex], vectors[currentColorIndex + 1], currentZeroToOneBetween);
}

let green = new Vector3D(46, 204, 113);
let yellow = new Vector3D(241, 196, 15);
let orange = new Vector3D(243, 156, 18);
let red = new Vector3D(231, 76, 60);
let colors = [green, yellow, orange, red];

let arrowLength = 100 / 5;
function drawArrow(x, y, length, angle, gradientPosition) {
    //ctx.fillStyle = "rgb(" + 100 * Math.random() + ", " + 100 * Math.random() + ", " + 100 * Math.random() + ")";
    //ctx.fillRect(x, y, arrowLength, arrowLength);

    let currentColor = pickedVectorLerp(colors, gradientPosition);
    ctx.strokeStyle = "rgb(" + currentColor.x + ", " + currentColor.y + ", " + currentColor.z + ")";

    ctx.beginPath();
    ctx.moveTo((x + length / 2) + (length / 2 * Math.cos(degreesToRadians(180 + angle))), (y + length / 2) + (length / 2 * Math.sin(degreesToRadians(180 + angle))));//left at 0 degrees
    ctx.lineTo((x + length / 2) + (length / 2 * Math.cos(degreesToRadians(angle))), (y + length / 2) + (length / 2 * Math.sin(degreesToRadians(angle))));//right at 0 degrees
    ctx.stroke();

    ctx.fillStyle = "rgb(" + currentColor.x + ", " + currentColor.y + ", " + currentColor.z + ")";
    ctx.beginPath();
    ctx.moveTo((x + length / 2) + (length / 2 * Math.cos(degreesToRadians(angle))), (y + length / 2) + (length / 2 * Math.sin(degreesToRadians(angle))));//arrow tip
    ctx.lineTo((x + length / 2) + (length / 4) * Math.cos(degreesToRadians(angle - 30)), (y + length / 2) + (length / 4) * Math.sin(degreesToRadians(angle - 30)));//top corner at 0 degrees
    ctx.lineTo((x + length / 2) + (length / 4) * Math.cos(degreesToRadians(angle + 30)), (y + length / 2) + (length / 4) * Math.sin(degreesToRadians(angle + 30)));//bottom corner at 0 degrees
    ctx.fill();
}

function clamp(value, max, min = 0) {//Purely to deal with float inaccuracies that literally gave values less than min possible or greater than max possible
    if(value > max)
        return max;
    if(value < min)
        return min;
    return value;
}

function scaleBetweenZeroAndOne(value, max, min = 0) {
    return 1 / (Math.round(max) - Math.round(min)) * (Math.round(clamp(value, max, min)) - Math.round(min));
}

let spaceBetween = arrowLength / 4;
let rows = Math.floor(ctx.canvas.height / (arrowLength) + spaceBetween) + 1;
let cols = Math.floor(ctx.canvas.width / (arrowLength) + spaceBetween) + 1;

let vectors = [];

for(let col = 0; col < cols; col++) {
    vectors.push([]);
    for (let row = 0; row < rows; row++) {
        //vectors[col].push(new Vector3D(Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100));//currently only uses the x and y
        //console.log("col: " + col + " row: " + row);
        if(col === 0 && row === 0)
            vectors[col].push(new Vector3D(1, 1, 0));//currently only uses the x and y
        else if(col === 0)
            vectors[col].push(new Vector3D(vectors[0][row - 1].x + 1, vectors[0][row - 1].y, vectors[0][row - 1].z));//currently only uses the x and y
        else if(row === 0)
            vectors[col].push(new Vector3D(vectors[col - 1][0].x, vectors[col - 1][0].y + 1, vectors[col - 1][0].z));//currently only uses the x and y
        else
            vectors[col].push(new Vector3D((vectors[col][row - 1].x + vectors[col - 1][row].x) / 2, (vectors[col][row - 1].y + vectors[col - 1][row].y) / 2, vectors[col - 1][row - 1].z));//currently only uses the x and y
    }
}

let min = vectors[0][0].magnitude();//using default center of 0, 0, 0
let max = vectors[0][0].magnitude();//using default center of 0, 0, 0
for(let col = 0; col < cols; col++) {
    for(let row = 1; row < rows; row++) {//skip first one{
        let currentMagnitude = vectors[col][row].magnitude();//using default center of 0, 0, 0
        if (currentMagnitude < min)
            min = currentMagnitude;
        else if (currentMagnitude > max)
            max = currentMagnitude;
    }
}

for(let col = 0; col < cols; col++) {
    for(let row = 0; row < rows; row++) {
        let currentX = (arrowLength + spaceBetween) * col;
        let currentY = (arrowLength + spaceBetween) * row;
        drawArrow(currentX, currentY, arrowLength, vectors[col][row].getXPlaneAngle(), scaleBetweenZeroAndOne(vectors[col][row].magnitude(), max, min));
    }
}