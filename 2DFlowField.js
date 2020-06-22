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

function degreesToRadians(angle)
{
    return angle * Math.PI / 180;
}

let green = new Vector3D(46, 204, 113);
let yellow = new Vector3D(241, 196, 15);
let orange = new Vector3D(243, 156, 18);
let red = new Vector3D(231, 76, 60);
let colors = [green, yellow, orange, red];

let arrowLength = 100 / 7;//20;
function drawArrow(x, y, length, angle, gradientPosition)
{
    //so I have a box here per arrow and I need to figure out where the start and end point are to get the desired angle look
    //from the center of the box, either calculate using trig and the angle or draw two lines from center with the angle
    //I think using trig from the center to find the start and end is the ideal way to go

    //ctx.fillStyle = "rgb(" + 100 * Math.random() + ", " + 100 * Math.random() + ", " + 100 * Math.random() + ")";
    //ctx.fillRect(x, y, arrowLength, arrowLength);

    let currentColor = pickedVectorLerp(colors, gradientPosition);
    ctx.strokeStyle = "rgb(" + currentColor.x + ", " + currentColor.y + ", " + currentColor.z + ")";

    //ctx.beginPath();
    //ctx.ellipse(x + arrowLength / 2, y + arrowLength / 2, arrowLength / 2, arrowLength / 2, 1, 0, 359);
    //ctx.fill();

    ctx.beginPath();
    //So I think the problem is that the length should change based on the angle, it will be longer in corners and shorter when straight across
    //while will be the hypotenuse of my trig triangles

    //ASA triangle, get third angle then use law of sines
    //let secondAngle =
    //let thirdAngle = 180 - 90 - angle;
    //let hypotenuseLength = ((arrowLength / 2) / Math.sin(thirdAngle)) * Math.sin(90);
    //TODO so I think the hypotenuse length thing only works if the angle is used to form a triangle, which it doesn't if it passes a corner, in that case it needs flipped over the corner
    //TODO I think I can maybe use one section of the square to get the length info, then change the signs or add certain amounts to get the results in any quadrant of the square
    //I think the ranges are of 90 degrees total, but starting at one corner, going to the next corner. So that would be -45 to 45 for one area
    //TODO I was just thinking that I probably don't actually want diagonal arrows to be longer than others, especially since length can give the illusion of a stronger flow
    //TODO so instead I was thinking, I will need to deal more with circles, having a fixed length, diameter, getting the two end points on the circle, which should be easier
    //console.log(hypotenuseLength);//I  think this only works with one 90 degree area

    //left at 0 degrees
    ctx.moveTo((x + length / 2) + (length / 2 * Math.cos(degreesToRadians(180 + angle))), (y + length / 2) + (length / 2 * Math.sin(degreesToRadians(180 + angle))));
    //right at 0 degrees
    ctx.lineTo((x + length / 2) + (length / 2 * Math.cos(degreesToRadians(angle))), (y + length / 2) + (length / 2 * Math.sin(degreesToRadians(angle))));
    ctx.stroke();

    ctx.fillStyle = "rgb(" + currentColor.x + ", " + currentColor.y + ", " + currentColor.z + ")";
    ctx.beginPath();
    ctx.moveTo((x + length / 2) + (length / 2 * Math.cos(degreesToRadians(angle))), (y + length / 2) + (length / 2 * Math.sin(degreesToRadians(angle))));
    //ctx.lineTo((x + length / 2 + length / 8) + ((length / 2 - length / 4) * Math.cos(degreesToRadians(angle))), (y + length / 2 + length / 4) + ((length / 2 - length / 4) * Math.sin(degreesToRadians(angle))));

    let hypotenuse = Math.sqrt(Math.pow((length / 4), 2) + Math.pow((length / 8), 2));

    ctx.lineTo((x + length / 2) + (length / 4) * Math.cos(degreesToRadians(angle + 30)), (y + length / 2) + (length / 4) * Math.sin(degreesToRadians(angle + 30)));
    ctx.lineTo((x + length / 2) + (length / 4) * Math.cos(degreesToRadians(angle - 30)), (y + length / 2) + (length / 4) * Math.sin(degreesToRadians(angle - 30)));

    //ctx.lineTo(x + length - length / 4, y + length / 2 - length / 8);
    //ctx.lineTo(x + length - length / 4, y + length / 2 + length / 8);

    //ctx.lineTo(x + length / 8, y - length + length / 4);
    //ctx.lineTo(x - length / 8, y - length + length / 4);
    ctx.fill();

    /*let currentColor = pickedVectorLerp(colors, gradientPosition);
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
    ctx.fill();*/
}

let spaceBetween = arrowLength / 4;
let rows = ctx.canvas.height / (arrowLength + spaceBetween) + 1;//19;
let cols = ctx.canvas.width / (arrowLength + spaceBetween) + 1;//39;
let amountOfArrows = rows * cols;
for(let col = 0; col < cols; col++)
{
    for(let row = 0; row < rows; row++)
    {
        let currentX = (arrowLength + spaceBetween) * col;
        let currentY = (arrowLength + spaceBetween) * row;
        drawArrow(currentX, currentY, arrowLength, (row * col) % 360,1 / amountOfArrows * row * col);
        //break;
    }
}