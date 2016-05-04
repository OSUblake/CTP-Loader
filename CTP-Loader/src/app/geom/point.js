var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CTP;
(function (CTP) {
    var Geom;
    (function (Geom) {
        var Coord = (function () {
            function Coord(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.x = x;
                this.y = y;
            }
            return Coord;
        }());
        Geom.Coord = Coord;
        var Point = (function (_super) {
            __extends(Point, _super);
            //constructor(x?: number, y?: number) {
            function Point(x, y, id) {
                _super.call(this, x, y);
                this.id = id;
                this.isCorner = false;
            }
            Object.defineProperty(Point.prototype, "X", {
                // TEMP
                get: function () { return this.x; },
                set: function (x) { this.x = x; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Point.prototype, "Y", {
                get: function () { return this.y; },
                set: function (y) { this.y = y; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Point.prototype, "magnitudeSq", {
                get: function () { return Math.pow(this.x, 2) + Math.pow(this.y, 2); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Point.prototype, "magnitude", {
                get: function () { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)); },
                set: function (magnitude) { this.normalize().multiply(magnitude, magnitude); },
                enumerable: true,
                configurable: true
            });
            //static fromPoints(p1: IPoint, p2: IPoint): Point {
            //    return new Point(p2.x - p1.x, p2.y - p1.y);
            //}
            Point.clone = function (point) {
                return new Point(point.x, point.y);
            };
            Point.add = function (p1, p2, out) {
                if (out === void 0) { out = new Point(); }
                out.x = p1.x + p2.x;
                out.y = p1.y + p2.y;
                return out;
            };
            Point.subtract = function (p1, p2, out) {
                if (out === void 0) { out = new Point(); }
                out.x = p1.x - p2.x;
                out.y = p1.y - p2.y;
                return out;
            };
            Point.multiply = function (p1, p2, out) {
                if (out === void 0) { out = new Point(); }
                out.x = p1.x * p2.x;
                out.y = p1.y * p2.y;
                return out;
            };
            Point.divide = function (p1, p2, out) {
                if (out === void 0) { out = new Point(); }
                out.x = p1.x / p2.x;
                out.y = p1.y / p2.y;
                return out;
            };
            Point.equals = function (p1, p2) {
                return (p1.x === p2.x && p1.y === p2.y);
            };
            Point.perp = function (point, out) {
                if (out === void 0) { out = new Point(); }
                out.x = -point.y;
                out.y = point.x;
                return out;
            };
            Point.rperp = function (point, out) {
                if (out === void 0) { out = new Point(); }
                out.x = point.y;
                out.y = -point.x;
                return out;
            };
            Point.distance = function (p1, p2) {
                return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
            };
            Point.distanceSq = function (p1, p2) {
                return Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2);
            };
            Point.normalize = function (point, out) {
                if (out === void 0) { out = new Point(); }
                var magnitude = point.magnitude;
                if (magnitude) {
                    out.x = point.x / magnitude;
                    out.y = point.y / magnitude;
                }
                return out;
            };
            Point.parse = function (source, xProp, yProp) {
                if (xProp === void 0) { xProp = "x"; }
                if (yProp === void 0) { yProp = "y"; }
                var point = new Point();
                if (source[xProp])
                    point.x = parseInt(source[xProp], 10);
                if (source[yProp])
                    point.y = parseInt(source[yProp], 10);
                return point;
            };
            Point.prototype.isZero = function () {
                return (this.x === 0 && this.y === 0);
            };
            Point.prototype.normalize = function () {
                if (!this.isZero()) {
                    var magnitude = this.magnitude;
                    this.x /= magnitude;
                    this.y /= magnitude;
                }
                return this;
            };
            Point.prototype.add = function (x, y) {
                this.x += x;
                this.y += y;
                return this;
            };
            Point.prototype.subtract = function (x, y) {
                this.x -= x;
                this.y -= y;
                return this;
            };
            Point.prototype.multiply = function (x, y) {
                this.x *= x;
                this.y *= y;
                return this;
            };
            Point.prototype.divide = function (x, y) {
                this.x /= x;
                this.y /= y;
                return this;
            };
            Point.prototype.dot = function (point) {
                return this.x * point.x + this.y * point.y;
            };
            Point.prototype.cross = function (point) {
                return this.x * point.y - this.y * point.x;
            };
            Point.prototype.perp = function () {
                return this.set(-this.y, this.x);
            };
            Point.prototype.rperp = function () {
                return this.set(this.y, -this.x);
            };
            Point.prototype.copyFrom = function (source) {
                return this.set(source.x, source.y);
            };
            Point.prototype.invert = function () {
                return this.set(this.y, this.x);
            };
            Point.prototype.angleBetween = function (point1, point2) {
                var a = Math.pow((this.x - point1.x), 2) + Math.pow((this.y - point1.y), 2);
                var b = Math.pow((this.x - point2.x), 2) + Math.pow((this.y - point2.y), 2);
                var c = Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2);
                return Math.acos((a + b - c) / Math.sqrt(4 * a * b));
            };
            Point.prototype.distanceSq = function (point) {
                var dx = this.x - point.x;
                var dy = this.y - point.y;
                return dx * dx + dy * dy;
            };
            Point.prototype.distance = function (point) {
                var dx = this.x - point.x;
                var dy = this.y - point.y;
                return Math.sqrt(dx * dx + dy * dy);
            };
            Point.prototype.perpendicular = function (point) {
                var projected = this.project(point);
                return this.subtract(projected.x, projected.y);
                //return this.subtract(this.project(point));
            };
            Point.prototype.project = function (point) {
                var percent = this.dot(point) / point.dot(point);
                return point.multiply(percent, percent);
            };
            return Point;
        }(PIXI.Point));
        Geom.Point = Point;
    })(Geom = CTP.Geom || (CTP.Geom = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=point.js.map