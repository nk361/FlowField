import {Vector3D} from "./Vector3D.js";

let c = document.getElementById("canvas1");
let ctx = c.getContext("2d");

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

function oneDLerp(startVal, endVal, zeroToOneBetween)
{
    return (endVal - startVal) * zeroToOneBetween + startVal;
}

function threeDLerp(startVector, endVector, zeroToOneBetween)
{
    return new Vector3D(
        oneDLerp(startVector.x, endVector.x, zeroToOneBetween),
        oneDLerp(startVector.y, endVector.y, zeroToOneBetween),
        oneDLerp(startVector.z, endVector.z, zeroToOneBetween)
    );
}

function pickedVectorLerp(vectors, zeroToOneBetween)//get the current vector out of a linear gradient between an unknown amount of vectors
{
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

function drawArrow(x, y, length, gradientPosition)
{
    let currentColor = pickedVectorLerp(colors, gradientPosition);
    ctx.strokeStyle = "rgb(" + currentColor.x + ", " + currentColor.y + ", " + currentColor.z + ")";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - length);
    ctx.stroke();

    ctx.fillStyle = "rgb(" + currentColor.x + ", " + currentColor.y + ", " + currentColor.z + ")";
    ctx.beginPath();
    ctx.moveTo(x, y - length);
    ctx.lineTo(x + length / 8, y - length + length / 4);
    ctx.lineTo(x - length / 8, y - length + length / 4);
    ctx.fill();
}

let arrowLength = 20;
let spaceBetween = arrowLength / 4;
let rows = (ctx.canvas.height - (arrowLength + spaceBetween)) / ((arrowLength + spaceBetween) * 2);//19;
let cols = (ctx.canvas.width - (arrowLength + spaceBetween)) / ((arrowLength + spaceBetween) * 2);//39;
let amountOfArrows = rows * cols;
for(let col = 0; col < cols; col++)
{
    for(let row = 0; row < rows; row++)
    {
        let currentX = arrowLength + spaceBetween + (arrowLength + spaceBetween) * 2 * col;
        let currentY = arrowLength + spaceBetween + (arrowLength + spaceBetween) * 2 * row;
        drawArrow(currentX, currentY, arrowLength, 1 / amountOfArrows * col * row);
    }
}