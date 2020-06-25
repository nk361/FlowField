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
    if(zeroToOneBetween === 1)//when the value is 1, the last return line throws an index out of bounds as it should
        return vectors[vectors.length - 1];

    let currentColorIndex = Math.floor(zeroToOneBetween / (1 / (vectors.length - 1)));
    let currentZeroToOneBetween = (zeroToOneBetween - ((1 / vectors.length) * currentColorIndex)) * vectors.length;
    return threeDLerp(vectors[currentColorIndex], vectors[currentColorIndex + 1], currentZeroToOneBetween);
}

let green = new Vector3D(46, 204, 113);
let yellow = new Vector3D(241, 196, 15);
let orange = new Vector3D(243, 156, 18);
let red = new Vector3D(231, 76, 60);
let colors = [green, yellow, orange, red];

let arrowLength = 100 / 5;//20;
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

function scaleBetweenZeroAndOne(value, max, min = 0) {
    return 1 / (max - min) * (value - min);
}

let spaceBetween = arrowLength / 4;
let rows = Math.floor(ctx.canvas.height / (arrowLength) + spaceBetween) + 1;//19;
let cols = Math.floor(ctx.canvas.width / (arrowLength) + spaceBetween) + 1;//39;
let amountOfArrows = rows * cols;

let vectors = [];

for(let i = 0; i < amountOfArrows; i++)
{
    vectors.push(new Vector3D(Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100));
}

let min = vectors[0].magnitude();//using default center of 0, 0, 0
let max = vectors[0].magnitude();//using default center of 0, 0, 0
for(let i = 1; i < amountOfArrows; i++) {//skip first one{
    let currentMagnitude = vectors[i].magnitude();//using default center of 0, 0, 0
    if(currentMagnitude < min)
        min = currentMagnitude;
    else if(currentMagnitude > max)
        max = currentMagnitude;
}

for(let col = 0; col < cols; col++) {
    for(let row = 0; row < rows; row++) {
        let currentX = (arrowLength + spaceBetween) * col;
        let currentY = (arrowLength + spaceBetween) * row;
        drawArrow(currentX, currentY, arrowLength, vectors[col * rows + row].getXPlaneAngle(), scaleBetweenZeroAndOne(vectors[col * rows + row].magnitude(), max, min));
    }
}