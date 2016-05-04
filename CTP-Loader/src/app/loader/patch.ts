//declare namespace ClipperLib {

//    //interface Clipper {
//    //    CleanPolygons(path, distance);
//    //}

//    decalare namespace Clipper {
//        export function CleanPolygons(path, distance);
//    }
//}

declare namespace ClipperLib.Clipper {

    export function CleanPolygon(path, distance): Array<CTP.Geom.Point>;
}

namespace CTP.Loader {

    import Point = Geom.Point;
    import simplify = Geom.simplify;
    import findCorners = Geom.findCorners;

    const module = getModule();

    //const precision = 100;

    let counter = 0;

    export class Shape {

        precision = 100;

        basePoints: Array<Point> = [];
        points: Array<Point> = [];
        simplifiedPoints: Array<Point> = [];

        path;

        //id = _.uniqueId("shape-");
        id = "s-" + counter++;

        simplification = 0.1;

        constructor() {
            
        }

        init() {
            this.createPath();
        }

        simplify(amt) {

            if (amt) {
                this.simplifiedPoints = simplify(this.points, amt);
            } else {
                this.simplifiedPoints = this.points.slice(0);
            }

            //this.simplifiedPoints = simplify(this.points, amt);
            //this.simplification = amt;
        }

        addPoint(x: number, y: number) {

            var point = new Point(x, y, _.uniqueId());
            this.basePoints.push(point);
            this.points.push(point);

            return this;
        }

        createPath() {

            this.path = _.reduce(this.points, (path, point) => {

                path.push(point.x, point.y);
                return path;
            }, []);

            //this.path = JSON.stringify(this.path);

            //console.log("\n" + this.id);
            //console.log(JSON.stringify(this.path));
        }

        _createPath() {

            //console.log("\nCLIPPER CLEAN 1", this.points.length);
            this.path = ClipperLib.Clipper.CleanPolygon(this.points, 0.1);
            this.path = _.reduce(this.path, (path, pt: Point, i) => {

                path.push(new Point(pt.X, pt.Y));
                return path;
            }, []);
            //console.log("CLIPPER CLEAN 2", this.path.length);
        }

        scaleUp() {
            
        }
    }


    export class Layer {

        stitches: Array<Stitch> = [];

        // TEMP
        _stitches: Array<Stitch> = [];

        points: Array<Point> = [];

        _shapes: Array<Shape> = [];

        shapes: Array<Point[]> = [];
        polyShapes: Array<Point[]> = [];
        
        p1: any[];
        p2: any[];
        p3: any[];

        cornerIndexes: Array<number[]> = [];

        constructor() {

        }

        init() {

            this.createPoints();
            this.createShapes();
            this.createPSLG();
        }

        createPSLG() {

            var p1 = this.p1;
            var p2 = this.p2;
            var p3 = this.p3;

            //simplify(this.shapes, 0.1, true);

            var rShapes = _.cloneDeep(this.shapes);

            _.forEach(rShapes, (shape) => {
                //console.log("\nSHAPE 1", shape.length);
                shape = simplify(shape, 4, true);
                //console.log("SHAPE 2", shape.length);

                //this.cornerIndexes.push(findCorners(shape, _.cloneDeep(shape), 4));
                //this.cornerIndexes.push(findCorners(shape, simplify(_.cloneDeep(shape), 4, true), 4));
            });

            //console.log("CORNER INDEXES\n", this.cornerIndexes);

            //this.cornerIndexes = findCorners()

            var shapePoints = _.reduce(rShapes, (shapes, points, i) => {
            //var shapePoints = _.reduce(this.shapes, (shapes, points, i) => {

                var values = _.reduce(points, (res, point) => {
                    res.push([point.x, point.y]);
                    return res;
                }, []);

                shapes.push(values);

                return shapes;
            }, []);

            p1 = _.cloneDeep(shapePoints);
            p2 = [];

            _.forEach(p1, (shape) => {
                //console.log("SHAPPP\n", shape);
                p2.push(PSLG.poly(shape));
            });

            p3 = _.cloneDeep(p2);

            _.forEach(p3, (shape) => {
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

        }

        createShapes() {

            var moved = false;
            var shape = [];

            

            this.shapes = _.reduce(this.stitches, (shapes, stitch, i, stitches) => {

                var next = stitches[i + 1];
                var flag = stitch.flags;

                if (stitch.flags === StitchType.Trim) {

                    //shape.push(new Point(stitch.x, stitch.y));

                    if (next) {
                        moved = true;
                        //shape = [];
                        //shapes.push(shape);
                        //shape.push(new Point(stitch.x, stitch.y));
                    } else {
                        //shape.push(new Point(stitch.x, stitch.y));
                    }

                    //shape.push(new Point(stitch.x, stitch.y));

                    return shapes;
                }

                if (moved) {
                    //shape.push(new Point(stitch.x, stitch.y));
                    moved = false;
                    shape = [];
                    shapes.push(shape);
                } else {
                    //shape.push(new Point(stitch.x, stitch.y));
                }

                shape.push(new Point(stitch.x, stitch.y));
                
                return shapes;
            }, [shape]);

            var _shape;
            this._shapes = _.reduce(this.shapes, (shapes, shape) => {

                if (shape.length) {
                    _shape = _.reduce(shape, (res, point) => {
                        return res.addPoint(point.x, point.y);
                    }, new Shape());
                    shapes.push(_shape);
                }

                return shapes;
            }, []);

            _.forEach(this._shapes, (shape) => {
                shape.init();
            });

            _.forEach(this.shapes, (shape) => {
                simplify(shape, 0.1, true);
            });

            //console.log("SHAPES\n", this.shapes);
        }

        createPoints() {

            for (let stitch of this.stitches) {

                if (stitch.flags === StitchType.Jump ||
                    stitch.flags === StitchType.Trim ||
                    stitch.flags === StitchType.Stop) {

                    //context.stroke();
                    ////const color = pattern.colors[stitch.color];
                    //context.beginPath();
                    //context.strokeStyle = "black";
                    //context.moveTo(stitch.x, stitch.y);

                    //var point = new Point(stitch.x, stitch.y);
                    //this.points.push(point);

                    //continue;

                } else {
                    //var point = new Point(stitch.x, stitch.y);
                    //this.points.push(point);
                }

                var point = new Point(stitch.x, stitch.y);
                this.points.push(point);
            }

            //this.points = simplify(this.points, 5, false);
        }

        addStitch(stitch: Stitch) {
            this.stitches.push(stitch);
            return this;
        }
    }

    export class Patch {

        // TEST
        //pattern: Pattern;
        width: number = 0;
        height: number = 0;

        layers: Array<Layer> = [];

        currentLayer: Layer;

        constructor() {
            
        }

        addLayer() {

            var layer = new Layer();
            this.layers.push(layer);

            //this.currentLayer = layer;
            this.currentLayer = _.last(this.layers);

            return this;
        }
    }
}