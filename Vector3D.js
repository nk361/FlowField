import {degreesToRadians, radiansToDegrees} from "./UtilityFunctions.js";
export class Vector3D {
    constructor(x, y = x, z = x) {//direction is assumed to be from point one to point two, start point is assumed to be origin (0, 0, 0)
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vec2) {
        return new Vector3D(this.x + vec2.x, this.y + vec2.y, this.z + vec2.z);
    }

    subtract(vec2) {
        return this.add(new Vector3D(-vec2.x, -vec2.y, -vec2.z));
    }

    multiply(vec2) {//because of the dynamic type system, if you want to multiply by a scalar, use the Vector3D constructor with one parameter
        //return new Vector3D(this.y * vec2.z - this.z * vec2.y, this.z * vec2.x - this.x * vec2.z, this.x * vec2.y - this.y * vec2.x);//this is cross product
        return new Vector3D(this.x * vec2.x, this.y * vec2.y, this.z * vec2.z);//this multiplication seems more like scalar multiplication, but it gives the results I want
    }

    divide(scalar) {//you're just making the magnitude shorter
        return new Vector3D(this.x / scalar, this.y / scalar, this.z / scalar);
    }

    magnitude(center = new Vector3D(0, 0, 0)) {//distance = sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2) + pow(z2 - z1, 2))
        return Math.sqrt(Math.pow(this.x - center.x, 2) + Math.pow(this.y - center.y, 2) + Math.pow(this.z - center.z, 2));
    }

    unitVector(center = new Vector3D(0, 0, 0)) {//optional center to pass in so the magnitude is not from origin to endpoint
        let m = this.magnitude(center);
        return new Vector3D(this.x / m, this.y / m, this.z / m);
    }

    getPlaneQuadrant(x, y) {
        let quadrant = 1;
        if (x < 0)
            if (y >= 0)
                quadrant = 2;
            else
                quadrant = 3;
        else if (y < 0)
            quadrant = 4;
        return quadrant;
    }

    getPlaneAngle(rise, run) {
        return radiansToDegrees(Math.abs(Math.atan(rise / run))) + 90 * (this.getPlaneQuadrant(run, rise) - 1);
    }

    getXPlaneAngle() {
        return this.getPlaneAngle(this.y, this.x);
    }

    getYPlaneAngle() {
        return this.getPlaneAngle(this.y, this.z);
    }

    getZPlaneAngle() {
        return this.getPlaneAngle(this.z, this.x);
    }

    rotateXPlane(xDegrees, center = new Vector3D(0, 0, 0)) {//imagine rotating along a circle facing you. This function has an optional center to pass in so the rotation is not always assumed to be origin or 0, 0, 0
        return new Vector3D(center.x + this.magnitude(center) * Math.cos(degreesToRadians(xDegrees)), center.y + this.magnitude(center) * Math.sin(degreesToRadians(xDegrees)), this.z);
    }

    rotateYPlane(yDegrees, center = new Vector3D(0, 0, 0)) {//imagine rotating along a circle facing left and right. This function has an optional center to pass in so the rotation is not always assumed to be origin or 0, 0, 0
        return new Vector3D(this.x, center.y + this.magnitude(center) * Math.cos(degreesToRadians(yDegrees)), center.z + this.magnitude(center) * Math.sin(degreesToRadians(yDegrees)));
    }

    rotateZPlane(zDegrees, center = new Vector3D(0, 0, 0)) {//imagine rotating along a circle that's lying flat on the floor. This function has an optional center to pass in so the rotation is not always assumed to be origin or 0, 0, 0
        return new Vector3D(center.x + this.magnitude(center) * Math.sin(degreesToRadians(zDegrees)), this.y, center.z + this.magnitude(center) * Math.cos(degreesToRadians(zDegrees)));
    }

    rotateVec(xDegrees = 0, yDegrees = 0, zDegrees = 0, center = new Vector3D(0, 0, 0)) {
        let tempVec = new Vector3D(this.x, this.y, this.z);//to avoid changing the original
        tempVec = tempVec.rotateXPlane(xDegrees, center);
        tempVec = tempVec.rotateYPlane(yDegrees, center);
        tempVec = tempVec.rotateZPlane(zDegrees, center);
        return tempVec;
    }

    toString() {
        return "( " + this.x + ", " + this.y + ", " + this.z + " )";
    }
}

//Vector3D.prototype.toString = () => "( " + this.x + ", " + this.y + ", " + this.z + " )";