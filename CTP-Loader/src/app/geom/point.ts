namespace CTP.Geom {

    export interface ICoord {
        x: number;
        y: number;
    }

    export class Coord {
        constructor(public x: number = 0, public y: number = 0) { }
    }

    export class Point extends PIXI.Point {

        // TEMP
        get X() { return this.x; }
        get Y() { return this.y; }
        set X(x) { this.x = x; }
        set Y(y) { this.y = y; }

        prev: Point;
        next: Point;

        isCorner: boolean = false;

        //constructor(x?: number, y?: number) {
        constructor(x?: number, y?: number, public id?: number|string) {
            super(x, y);
        }

        get magnitudeSq() { return this.x ** 2 + this.y ** 2; }

        get magnitude() { return Math.sqrt(this.x ** 2 + this.y ** 2); }
        set magnitude(magnitude: number) { this.normalize().multiply(magnitude, magnitude); }

        //static fromPoints(p1: IPoint, p2: IPoint): Point {
        //    return new Point(p2.x - p1.x, p2.y - p1.y);
        //}

        static clone(point: ICoord) {
            return new Point(point.x, point.y);
        }

        static add(p1: ICoord, p2: ICoord, out: ICoord = new Point()): ICoord {
            out.x = p1.x + p2.x;
            out.y = p1.y + p2.y;
            return out;
        }

        static subtract(p1: ICoord, p2: ICoord, out: ICoord = new Point()): ICoord {
            out.x = p1.x - p2.x;
            out.y = p1.y - p2.y;
            return out;
        }

        static multiply(p1: ICoord, p2: ICoord, out: ICoord = new Point()): ICoord {
            out.x = p1.x * p2.x;
            out.y = p1.y * p2.y;
            return out;
        }

        static divide(p1: ICoord, p2: ICoord, out: ICoord = new Point()): ICoord {
            out.x = p1.x / p2.x;
            out.y = p1.y / p2.y;
            return out;
        }

        static equals(p1: ICoord, p2: ICoord): boolean {
            return (p1.x === p2.x && p1.y === p2.y);
        }

        static perp(point: ICoord, out: ICoord = new Point()): ICoord {
            out.x = -point.y;
            out.y =  point.x;
            return out;
        }

        static rperp(point: ICoord, out: ICoord = new Point()): ICoord {
            out.x =  point.y;
            out.y = -point.x;
            return out;
        }

        static distance(p1: ICoord, p2: ICoord): number {
            return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        }

        static distanceSq(p1: ICoord, p2: ICoord): number {
            return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
        }

        static normalize(point: Point, out: Point = new Point()): Point {

            var magnitude = point.magnitude;

            if (magnitude) {
                out.x = point.x / magnitude;
                out.y = point.y / magnitude;
            }

            return out;
        }

        static parse(source: {}, xProp: string = "x", yProp: string = "y"): Point {

            var point = new Point();

            if (source[xProp]) point.x = parseInt(source[xProp], 10);
            if (source[yProp]) point.y = parseInt(source[yProp], 10);

            return point;
        }

        isZero() {
            return (this.x === 0 && this.y === 0);
        }

        normalize() {

            if (!this.isZero()) {
                var magnitude = this.magnitude;
                this.x /= magnitude;
                this.y /= magnitude;
            }

            return this;
        }

        add(x: number, y: number) {
            this.x += x;
            this.y += y;
            return this;
        }

        subtract(x: number, y: number) {
            this.x -= x;
            this.y -= y;
            return this;
        }

        multiply(x: number, y: number) {
            this.x *= x;
            this.y *= y;
            return this;
        }

        divide(x: number, y: number) {
            this.x /= x;
            this.y /= y;
            return this;
        }

        dot(point: ICoord) {
            return this.x * point.x + this.y * point.y;
        }

        cross(point: ICoord) {
            return this.x * point.y - this.y * point.x;
        }

        perp() {
            return this.set(-this.y, this.x);
        }

        rperp() {
            return this.set(this.y, -this.x);
        }

        copyFrom(source: ICoord) {
            return this.set(source.x, source.y);
        }

        invert() {
            return this.set(this.y, this.x);
        }


        angleBetween(point1: ICoord, point2: ICoord) {

            var a = (this.x   - point1.x) ** 2 + (this.y   - point1.y) ** 2;
            var b = (this.x   - point2.x) ** 2 + (this.y   - point2.y) ** 2;
            var c = (point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2;

            return Math.acos((a + b - c) / Math.sqrt(4 * a * b));
        }

        distanceSq(point: ICoord) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            return dx * dx + dy * dy;
        }

        distance(point: ICoord) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        perpendicular(point: Point) {
            var projected = this.project(point);
            return this.subtract(projected.x, projected.y);
            //return this.subtract(this.project(point));
        }

        project(point: Point) {
            var percent = this.dot(point) / point.dot(point);
            return point.multiply(percent, percent);
        }

        //identity(coords) {
        //    this.prev = null;
        //    this.next = null;
        //    this.isCorner = false;
            
        //    if (coords) {
        //        this.x = this.y = 0;
        //    }
        //}
    }

    //var p = new Point(8, 12);

    //var c1 = Point.foo<Point>(p);
    //var c2 = Point.foo();
    //var c3 = Point.foo(p);

    //console.log("TEST COORD", c);
}