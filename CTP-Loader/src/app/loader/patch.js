//declare namespace ClipperLib {
var CTP;
(function (CTP) {
    var Loader;
    (function (Loader) {
        var Point = CTP.Geom.Point;
        var simplify = CTP.Geom.simplify;
        var module = Loader.getModule();
        //const precision = 100;
        var counter = 0;
        var Shape = (function () {
            function Shape() {
                this.precision = 100;
                this.basePoints = [];
                this.points = [];
                this.simplifiedPoints = [];
                //id = _.uniqueId("shape-");
                this.id = "s-" + counter++;
                this.simplification = 0.1;
            }
            Shape.prototype.init = function () {
                this.createPath();
            };
            Shape.prototype.simplify = function (amt) {
                if (amt) {
                    this.simplifiedPoints = simplify(this.points, amt);
                }
                else {
                    this.simplifiedPoints = this.points.slice(0);
                }
                //this.simplifiedPoints = simplify(this.points, amt);
                //this.simplification = amt;
            };
            Shape.prototype.addPoint = function (x, y) {
                var point = new Point(x, y, _.uniqueId());
                this.basePoints.push(point);
                this.points.push(point);
                return this;
            };
            Shape.prototype.createPath = function () {
                this.path = _.reduce(this.points, function (path, point) {
                    path.push(point.x, point.y);
                    return path;
                }, []);
                //this.path = JSON.stringify(this.path);
                //console.log("\n" + this.id);
                //console.log(JSON.stringify(this.path));
            };
            Shape.prototype._createPath = function () {
                //console.log("\nCLIPPER CLEAN 1", this.points.length);
                this.path = ClipperLib.Clipper.CleanPolygon(this.points, 0.1);
                this.path = _.reduce(this.path, function (path, pt, i) {
                    path.push(new Point(pt.X, pt.Y));
                    return path;
                }, []);
                //console.log("CLIPPER CLEAN 2", this.path.length);
            };
            Shape.prototype.scaleUp = function () {
            };
            return Shape;
        }());
        Loader.Shape = Shape;
        var Layer = (function () {
            function Layer() {
                this.stitches = [];
                // TEMP
                this._stitches = [];
                this.points = [];
                this._shapes = [];
                this.shapes = [];
                this.polyShapes = [];
                this.cornerIndexes = [];
            }
            Layer.prototype.init = function () {
                this.createPoints();
                this.createShapes();
                this.createPSLG();
            };
            Layer.prototype.createPSLG = function () {
                var p1 = this.p1;
                var p2 = this.p2;
                var p3 = this.p3;
                //simplify(this.shapes, 0.1, true);
                var rShapes = _.cloneDeep(this.shapes);
                _.forEach(rShapes, function (shape) {
                    //console.log("\nSHAPE 1", shape.length);
                    shape = simplify(shape, 4, true);
                    //console.log("SHAPE 2", shape.length);
                    //this.cornerIndexes.push(findCorners(shape, _.cloneDeep(shape), 4));
                    //this.cornerIndexes.push(findCorners(shape, simplify(_.cloneDeep(shape), 4, true), 4));
                });
                //console.log("CORNER INDEXES\n", this.cornerIndexes);
                //this.cornerIndexes = findCorners()
                var shapePoints = _.reduce(rShapes, function (shapes, points, i) {
                    //var shapePoints = _.reduce(this.shapes, (shapes, points, i) => {
                    var values = _.reduce(points, function (res, point) {
                        res.push([point.x, point.y]);
                        return res;
                    }, []);
                    shapes.push(values);
                    return shapes;
                }, []);
                p1 = _.cloneDeep(shapePoints);
                p2 = [];
                _.forEach(p1, function (shape) {
                    //console.log("SHAPPP\n", shape);
                    p2.push(PSLG.poly(shape));
                });
                p3 = _.cloneDeep(p2);
                _.forEach(p3, function (shape) {
                    PSLG.clean(shape.points, shape.edges);
                });
                //polyPoints = PSLG.poly(polyPoints);
                this.p1 = p1;
                this.p2 = p2;
                this.p3 = p3;
                this.p3 = this.p2;
                //console.log("SHAPE POINTS\n", shapePoints);
                //console.log("POLY POINTS\n", p2);
                //console.log("CLEAN POINTS\n", p3);
            };
            Layer.prototype.createShapes = function () {
                var moved = false;
                var shape = [];
                this.shapes = _.reduce(this.stitches, function (shapes, stitch, i, stitches) {
                    var next = stitches[i + 1];
                    var flag = stitch.flags;
                    if (stitch.flags === Loader.StitchType.Trim) {
                        //shape.push(new Point(stitch.x, stitch.y));
                        if (next) {
                            moved = true;
                        }
                        else {
                        }
                        //shape.push(new Point(stitch.x, stitch.y));
                        return shapes;
                    }
                    if (moved) {
                        //shape.push(new Point(stitch.x, stitch.y));
                        moved = false;
                        shape = [];
                        shapes.push(shape);
                    }
                    else {
                    }
                    shape.push(new Point(stitch.x, stitch.y));
                    return shapes;
                }, [shape]);
                var _shape;
                this._shapes = _.reduce(this.shapes, function (shapes, shape) {
                    if (shape.length) {
                        _shape = _.reduce(shape, function (res, point) {
                            return res.addPoint(point.x, point.y);
                        }, new Shape());
                        shapes.push(_shape);
                    }
                    return shapes;
                }, []);
                _.forEach(this._shapes, function (shape) {
                    shape.init();
                });
                _.forEach(this.shapes, function (shape) {
                    simplify(shape, 0.1, true);
                });
                //console.log("SHAPES\n", this.shapes);
            };
            Layer.prototype.createPoints = function () {
                for (var _i = 0, _a = this.stitches; _i < _a.length; _i++) {
                    var stitch = _a[_i];
                    if (stitch.flags === Loader.StitchType.Jump ||
                        stitch.flags === Loader.StitchType.Trim ||
                        stitch.flags === Loader.StitchType.Stop) {
                    }
                    else {
                    }
                    var point = new Point(stitch.x, stitch.y);
                    this.points.push(point);
                }
                //this.points = simplify(this.points, 5, false);
            };
            Layer.prototype.addStitch = function (stitch) {
                this.stitches.push(stitch);
                return this;
            };
            return Layer;
        }());
        Loader.Layer = Layer;
        var Patch = (function () {
            function Patch() {
                // TEST
                //pattern: Pattern;
                this.width = 0;
                this.height = 0;
                this.layers = [];
            }
            Patch.prototype.addLayer = function () {
                var layer = new Layer();
                this.layers.push(layer);
                //this.currentLayer = layer;
                this.currentLayer = _.last(this.layers);
                return this;
            };
            return Patch;
        }());
        Loader.Patch = Patch;
    })(Loader = CTP.Loader || (CTP.Loader = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=patch.js.map