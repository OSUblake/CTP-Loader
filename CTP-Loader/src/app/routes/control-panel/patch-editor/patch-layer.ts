

//declare namespace EasyStar {
//    class js {
//        new(): js;
//        setGrid(grid: number[][]): void;
//        setAcceptableTiles(tiles: number[]): void;
//        findPath(startX: number, startY: number, endX: number, endY: number, callback: (path: Position[]) => void): void;
//        calculate(): void;
//        setIterationsPerCalculation(iterations: number): void;
//        avoidAdditionalPoint(x: number, y: number): void;
//        stopAvoidingAdditionalPoint(x: number, y: number): void;
//        stopAvoidingAllAdditionalPoints(): void;
//        enableDiagonals(): void;
//        disableDiagonals(): void;
//        setTileCost(tileType: number, multiplicativeCost: number): void;
//    }

//    interface Position {
//        x: number;
//        y: number;
//    }
//}

namespace CTP.routes.controlPanel {

    import Point = Geom.Point;
    import findCorners = Geom.findCorners;
    import simplify = Geom.simplify;
    import simplifyPath = Geom.simplifyPath;

    import StitchType = Loader.StitchType;

    const module = getModule();

    declare var PF;
    declare var EasyStar;




    function lineIntersection(p1, p2, p3, p4, point) {

        var s1x = p2.x - p1.x;
        var s1y = p2.y - p1.y;

        var s2x = p4.x - p3.x;
        var s2y = p4.y - p3.y;

        var s = (-s1y * (p1.x - p3.x) + s1x * (p1.y - p3.y)) / (-s2x * s1y + s1x * s2y);
        var t = ( s1x * (p1.y - p3.y) - s2y * (p1.x - p3.x)) / (-s2x * s1y + s1x * s2y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            // Collision
            if (point) {
                point.x = p1.x + (t * s2x);
                point.y = p1.y + (t * s2y);
                return 1;
            }
        }

        return 0;
    }

    class PathNode {

        //x;
        //y;
        //parent;

        //cost; // f
        //f;
        //g;
        //h;

        //constructor(
        //    public parent,
        //    public x,
        //    public y,
        //    public costSoFar,
        //    public simpleDistToTarget) {
            
        //}

        f = 0;
        g = 0;
        h = 0;
        d = 0;

        constructor(
            public parent,
            public x,
            public y) { }

        //bestGuessDistance() {
        //    return this.costSoFar + this.simpleDistToTarget;
        //}
    }

    class PathFinder {

        start;
        end;
        points;

        open;
        closed;

        constructor() {
            
        }

        find(start, end, points) {

            var clones = _.cloneDeep(points);

            this.start = start;
            this.end = end;
            this.points = points;

            this.open = [];
            this.closed = [];

            var sx = start.x;
            var sy = start.y;

            points = _.reduce(points, (res, point: Point, i) => {

                var pn = new PathNode(null, point.x, point.y);
                pn.d = (sx - pn.x) ** 2 + (sy - pn.y) ** 2;
                res.push(pn);
                return res;
            }, []);

            points = _.uniq(points);
            //points = _.orderBy(points, "d");

            console.log("NEW LENGTH 1", points.length);

            var idx = 0;
            var pts = _.takeWhile(points, (value: Point, i, array) => {
                idx++;
                //return value.x !== start.x && value.y !== start.y;
                return value.x !== start.x && value.y !== start.y;
            });

            //var nPoints = points.slice(idx).concat(pts.reverse());
            points = points.splice(idx+1).concat(pts);
            //var nPoints = (points.slice(idx)).push(...pts);

            //var pts1 = pts;

            //pts1.concat(points.splice(idx).reverse());
            //var pts2 = points.splice(idx);
            //var pts2 = points.splice(idx).reverse();

            console.log("NEW LENGTH 2", points.length);

            //points = clones;

            var len = points.length;
            var ii = 0;

            var point = points.shift();
            //var point = points[ii++];
            //var point = points.pop();
            var first = new PathNode(null, point.x, point.y);

            this.open.push(first);

            //point = points.pop();
            //first = new PathNode(null, point.x, point.y);
            //this.open.push(first);

            while (this.open.length) {
            //while (ii < len) {

                var q = _.minBy(this.open, (node: PathNode) => {
                    //console.log("MINBY I", i);
                    return node.f;
                });

                //console.log("QQQQ", q)

                var index = _.indexOf(this.open, q);
                var current = this.open.splice(index, 1);

                var p1 = points.shift();
                //var p1 = points[ii++ % len];
                //var p1 = points.pop();
                //var p2 = pts2.shift();

                //var n1 = new PathNode(q, p1.x, p1.y);
                //var n2 = new PathNode(q, p2.x, p2.y);

                if (p1) {

                    var n1 = new PathNode(q, p1.x, p1.y);

                    if (n1.x === end.x && n1.y === end.y) {
                        console.log("FOUND THE GOAL");
                        break;
                    }

                    var dg1 = (q.x - n1.x) ** 2 + (q.y - n1.y) ** 2;
                    var dh1 = (end.x - n1.x) ** 2 + (end.y - n1.y) ** 2;

                    n1.g = dg1;
                    //n1.g = q.g + dg1;
                    //n1.g = q.g + dg1 + (q.parent && q.parent.g);
                    n1.h = dh1;
                    n1.f = n1.g + n1.h;

                    var o1 = _.filter(this.open, (node: PathNode) => {
                        return node.x === n1.x && node.y === n1.y && node.f <= n1.f;
                        //return node.f < n1.f;
                    })[0];

                    if (o1) {
                        continue;
                    } else {
                        //this.open.push(n1);
                    }

                    var c1 = _.filter(this.closed, (node: PathNode) => {
                        return node.x === n1.x && node.y === n1.y && node.f <= n1.f;
                        //return node.f < n1.f;
                    })[0];

                    if (c1) {
                        continue;
                    } else {
                        //this.open.push(n1);
                    }

                    this.open.push(n1);
                    //if (!o1 && !c1) {
                    //    this.open.push(n1);
                    //}

                    //if (o1 || c1) {
                    ////if (o1 && c1) {
                    //    console.log("HAS O1 or C1", o1, c1);
                    //} else {
                    //    this.open.push(n1);
                    //}

                    //this.open.push(n1);
                    //this.closed.push(q);
                }

                //this.closed.push(q);

                //if (p2) {

                //    var n2 = new PathNode(q, p2.x, p2.y);

                //    if (n2.x === end.x && n2.y === end.y) {
                //        break;
                //    }

                //    var dg2 = (q.x - n2.x) ** 2 + (q.y - n2.y) ** 2;
                //    var dh2 = (end.x - n2.x) ** 2 + (end.y - n2.y) ** 2;

                //    n2.g = q.g + dg2;
                //    n2.h = dh2;
                //    n2.f = n2.g + n2.h;

                //    var o2 = _.filter(this.open, (node: PathNode) => {
                //        return node.x === n2.x && node.y === n2.y && node.f < n2.f;
                //    })[0];

                //    var c2 = _.filter(this.closed, (node: PathNode) => {
                //        return node.x === n2.x && node.y === n2.y && node.f < n2.f;
                //    })[0];

                //    //if (!o2 && !c2) {
                //    //    this.open.push(n2);
                //    //}

                //    if (o2 || c2) {
                //        //console.log("HAS O1 or C1", o1, c1);
                //    } else {
                //        this.open.push(n2);
                //    }
                //}

                this.closed.push(q);
            }

            return this.closed;
            //return this.open;
        }
    }


    class PointSprite extends PIXI.Sprite {

        _selected = true;

        constructor(texture) {
            super(texture);

            this.setSelected();

            this.anchor.set(0.5);
            this.interactive = true;

            //this.on("click", this.onClick.bind(this));
            this.on("mouseover", this.onClick.bind(this));
        }

        setSelected() {
            this._selected = !this._selected;

            if (this._selected) {
                this.tint = 0xff0000;
            } else {
                this.tint = 0x000000;
            }

            //console.log("TINT", this.tint);
        }

        onClick() {
            this.setSelected();
            //console.log("CLICKED POINT");
        }
    }

    class PatchLayer {

        layer: Loader.Layer;

        patchWidth: number;
        patchHeight: number;

        renderer: PIXI.CanvasRenderer;
        canvas: HTMLCanvasElement;

        stage: PIXI.Container;
        graphics: PIXI.Graphics;

        // TEST
        shapes = this.layer._shapes;

        patchDesign;

        circleTexture;
        pointSprites = [];

        matrix = [];
        grid;
        finder = new PF.AStarFinder({
            //diagonalMovement: PF.DiagonalMovement.Never
            //allowDiagonal: true,
            //dontCrossCorners: true
        });

        easyStar = new EasyStar.js();

        constructor(
            private $scope,
            private $element: angular.IAugmentedJQuery,
            private $timeout: angular.ITimeoutService) {

            //console.log("\n\nLAYER SCOPE", $scope);
            //console.log("LAYER THIS", this);

            this.canvas = $element.find(".patch-layer-canvas")[0] as HTMLCanvasElement;

            this.renderer = new PIXI.CanvasRenderer(+this.patchWidth, +this.patchHeight, {
                view: this.canvas,
                transparent: true
            });

            this.stage = new PIXI.Container();
            this.graphics = new PIXI.Graphics();
            this.stage.addChild(this.graphics);

            this.stage.interactive = true;
            //this.stage.on("click", this.render.bind(this));
            this.stage.on("mouseover", this.render.bind(this));

            //this.drawLayer();
            
            //this.drawPSLG();
            //this.drawShapes();

            //this.drawEnds(false, 1);
            //this.drawEnds(false, 0);
            //this.drawEnds(true, 0);

            //this.drawClipper();

            this.graphics.beginFill(0xffffff);
            this.graphics.drawCircle(0, 0, 2);
            this.graphics.endFill();
            this.circleTexture = this.graphics.generateTexture(this.renderer);
            this.graphics.clear();

            this.render();

            //$timeout(() => {
            //    console.log("PATCH DESIGN", this.patchDesign);
            //});

            //this.renderer.resize(400, 400);
            //this.stage.width = 400;
            //this.stage.height = 400;
            //this.render();

            //console.log("CANVAS %O\n", this.canvas);

        }

        editShape(shape) {

            this.patchDesign.editShape(shape, this);
            this.renderShape(shape);

        }

        updateShape() {
            var shape = this.patchDesign.currentShape;

            this.renderShape(shape);
            //console.log("UPDATE SHAPE");
        }

        generateGrid() {

            var matrix = this.matrix = [];
            

            var w = +this.patchWidth;
            var h = +this.patchHeight;

            var imageData = this.canvas.getContext("2d").getImageData(0, 0, w, h);
            var data = imageData.data;
            var size = data.length;

            var row;

            var alpha = 0;

            for (let i = 0; i < size; i +=4) {

                var x = (i / 4) % w;

                if (!x) {
                    row = [];
                    matrix.push(row);
                }

                var px = data[i];

                var hit = (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255);

                hit = data[i + 3] === 0;

                if (data[i+3] === 0) {
                    alpha++;
                }

                if (hit) {
                    row.push(1);
                } else {
                    row.push(0);
                    //console.log("WALK");
                }
            }

            this.grid = new PF.Grid(matrix);
            //console.log("GRID", this.grid);

            //console.log("ALPHAS", alpha);
            //console.log("TOTAL", size/4);
        }


        pathFinder = new PathFinder();

        runFinder(shape, start, end) {

            var graphics = this.graphics;

            var path = this.pathFinder.find(start, end, shape.points);

            console.log("FINDER PATH", path);

            if (path.length) {
                graphics.lineStyle(1, 0x0000ff);
                graphics.moveTo(path[0].x, path[0].y);
                _.forEach(path, (point) => {
                    graphics.lineTo(point.x, point.y);
                });
                graphics.endFill(); 
            }

            


        }

        matrix2 = [];
        runStar(shape, start, end) {

            var w = +this.patchWidth;
            var h = +this.patchHeight;
            var mat = this.matrix2;

            var row;
            for (let i = 0; i < h; i++) {
                row = [];
                mat.push(row);
                for (let j = 0; j < w; j++) {
                    row.push(1);
                }
            }




            var graphics = this.graphics;

            this.easyStar.enableSync();
            //this.easyStar.enableCornerCutting();
            //this.easyStar.enableDiagonals();

            var good = [];

            var points = _.reduce(shape.points, (res, point: Point, i) => {

                var x = (x + 1) % w;
                var y = i % h;
                good.push(x * y);

                mat[point.y >> 0][point.x >> 0] = 0;

                //res.push([point.x, point.y]);
                //res.push([point.y>>0, point.x>>0]);
                res.push([point.x>>0, point.y>>0]);
                return res;
            }, []);

            this.easyStar.setGrid(this.matrix);
            //this.easyStar.setGrid(mat);

            //console.log("MAT", mat);

            //this.easyStar.setAcceptableTiles(points);
            //this.easyStar.setAcceptableTiles([0]);
            //this.easyStar.setAcceptableTiles(good);
            this.easyStar.setAcceptableTiles(mat);

            var path = this.easyStar.findPath(start.x>>0, start.y>>0, end.x>>0, end.y>>0, (p) => {
                console.log("END FIND PATH", p);

                if (!p) {
                    return;
                }

                graphics.lineStyle(1, 0x0000ff);
                graphics.moveTo(p[0].x, p[0].y);
                _.forEach(p, (point) => {
                    graphics.lineTo(point.x, point.y);
                });
                graphics.endFill(); 
            });

            console.log("STAR PATH", path);

            var calc = this.easyStar.calculate();

            console.log("STAR CACL", calc);
        }

        findPath(shape) {

            var graphics = this.graphics;

            var start = _.sample<Point>(shape.points);
            var end = _.sample<Point>(shape.points);

            var point1 = new Point(_.round(start.x), _.round(start.y));
            var point2 = new Point(_.round(end.x), _.round(end.y));

            graphics.beginFill(0x00ff00);
            //graphics.drawCircle(start.x, start.y, 5);
            graphics.drawCircle(point1.x, point1.y, 5);
            graphics.endFill();

            graphics.beginFill(0xff0000);
            //graphics.drawCircle(end.x, end.y, 5);
            graphics.drawCircle(point2.x, point2.y, 5);
            graphics.endFill();

            console.log("***");
            console.log("FIND GRID", this.grid);
            //console.log("START", this.grid.nodes[start.y>>0][start.x>>0]);
            //console.log("END", this.grid.nodes[end.y>>0][end.x>>0]);
            console.log("START", this.grid.nodes[point1.y][point1.x]);
            console.log("END", this.grid.nodes[point2.y][point2.x]);


            //this.finder = new PF.AStarFinder();

            var grid1 = _.clone(this.grid);
            var grid2 = _.clone(this.grid);

            //var path = this.finder.findPath(start.x>>0, start.y>>0, end.x>>0, end.y>>0, this.grid);
            //var path = this.finder.findPath(start.x>>0, start.y>>0, end.x>>0, end.y>>0, grid1);
            var path = this.finder.findPath(point1.x, point1.y, point2.x, point2.y, grid1);
            console.log("FOUND PATH", path);

            path = PF.Util.smoothenPath(grid2, path);

            path = _.reduce(path, (res, point) => {
                //res.push({ x: point[0], y: point[1] });
                res.push(new Point(point[0], point[1]));
                return res;
            }, []);

            this.alignPath(shape, path);

            //path = simplify(path, 0.1);

            var pp = _.reduce(path, (res, point: Point, i, array) => {

                var minPoint = shape.points[0];
                var minDist = (minPoint.x - point.x) ** 2 + (minPoint.y - point.y) ** 2;

                var prev = minPoint;

                _.forEach(shape.points, (pt) => {
                    var d1 = (pt.x - point.x) ** 2 + (pt.y - point.y) ** 2;
                    //if (d1 < minDist && Math.abs(d1 - minDist) > 3) {

                    var coord = { x: 0, y: 0 };
                    var next = array[i + 1] || point;
                    var hit = lineIntersection(point, prev, point, pt, coord);

                    if (hit && coord.x != null && coord.y !== null) {
                        //res.push(coord);
                        //return true;
                    }

                    //var diff = Math.sqrt(Math.abs(d1 - minDist));
                    var diff = Math.abs(Math.sqrt(d1) - Math.sqrt(minDist));

                    //if (d1 < minDist && Math.abs(d1 - minDist) > 4) {
                    //if (d1 < minDist)  {
                    if (d1 < minDist && diff > 1) {

                        //if (i && diff > 2 && diff < 8) {
                        //    minDist = d1;
                        //    minPoint = pt;
                        //}

                        minDist = d1;
                        minPoint = pt;
                    }

                    prev = pt;
                });

                res.push(minPoint);
                return res;
            }, []);

            pp = simplify(pp, 0.1);

            graphics.lineStyle(2, 0xff0000);
            graphics.moveTo(pp[0].x, pp[0].y);

            _.forEach(pp, (point: Point) => {
                graphics.lineTo(point.x, point.y);
            });

            graphics.endFill();

            //graphics.lineStyle(2, 0xff0000);
            //graphics.moveTo(path[0][0], path[0][1]);

            //_.forEach(path, (point) => {
            //    graphics.lineTo(point[0], point[1]);
            //});

            //graphics.endFill();

            //this.runStar(shape, start, end);
            //this.runFinder(shape, start, end);
        }

        alignPath(shape, path) {

            var points = shape.points;
            var prev = points[0];

        }

        renderShape(shape) {

            var graphics = this.graphics;

            this.graphics.clear();

            _.forEach(this.pointSprites, (sprite) => {
                this.stage.removeChild(sprite);
                sprite.destroy();
            });

            this.pointSprites = [];

            //var points = simplify(shape.points, shape.simplification);

            shape.simplify(0.0);

            var first = shape.simplifiedPoints[0];
            graphics.moveTo(first.x, first.y);
            //graphics.lineStyle(0.5, 0xc0c0c0);
            graphics.lineStyle(0.5, 0x808080);

            _.forEach(shape.simplifiedPoints, (point) => {
                graphics.lineTo(point.x, point.y);
            });

            graphics.endFill();

            this.render();

            this.generateGrid();

            //_.forEach(shape.points, (point) => {
            _.forEach(shape.simplifiedPoints, (point) => {

                

                //var sprite = new PIXI.Sprite(this.circleTexture);
                var sprite = new PointSprite(this.circleTexture);
                //this.stage.addChild(sprite);
                this.pointSprites.push(sprite);

                sprite.position.set(point.x, point.y);
            });

            this.findPath(shape);

            this.render();
        }

        drawClipper() {

            var graphics = this.graphics;
            var shapes = this.layer._shapes;

            var fill = 0xffd900;
            fill = 0xff0000;
            fill = 0x990099;

            _.forEach(shapes, (shape) => {

                console.log("SHAPE PATH", shape.path);

                graphics.beginFill(fill, 0);
                graphics.lineStyle(1, 0xff0000);
                graphics.drawPolygon(shape.path);
                graphics.endFill();
            });
        }

        drawEnds(drawLine: boolean, alpha = 1) {

            var graphics = this.graphics;
            var shapes = this.layer.shapes;
            //var lineColor = 0xffd900;
            var lineColor = 0x000000;
            var radius = 4;
            var green = 0x00cc00;
            var lineWidth = 0;

            _.forEach(shapes, (shape, j) => {

                //console.log("\nCOUNT 1", j);

                if (!shape.length) {
                    return true;
                }

                //console.log("COUNT 2", j);

                _.forEach(shape, (point, i, points) => {

                    //console.log("SHAPE", points);

                    var size = points.length;
                    var last = points.length - 1;

                    if (i === last) {
                        var first = points[0];

                        if (drawLine) {
                            graphics.lineStyle(2, 0xff0000, 1);
                            graphics.moveTo(first.x, first.y);
                            graphics.lineTo(point.x, point.y);
                        }
                        
                        
                        //graphics.lineStyle(2, lineColor, 0);
                        graphics.lineStyle(lineWidth, green, 1);
                        graphics.beginFill(green, alpha);
                        graphics.drawCircle(first.x, first.y, radius);
                        //graphics.drawRect(first.x - radius, first.y - radius, radius * 2, radius * 2);
                        graphics.endFill();

                        graphics.lineStyle(lineWidth, 0xff0000, 1);
                        graphics.beginFill(0xff0000, alpha);
                        graphics.drawCircle(point.x, point.y, radius);
                        //graphics.drawRect(point.x - radius, point.y - radius, radius * 2, radius * 2);
                        graphics.endFill();
                    }

                    //if (!i) {

                    //    //graphics.lineStyle(2, lineColor, 1);
                    //    ////graphics.lineStyle(1, 0xffff00, 1);
                    //    //graphics.beginFill(0x00ff00, 1);
                    //    //graphics.drawCircle(point.x, point.y, 5);
                    //    //graphics.endFill();

                    //} else if (i === last) {
                    //    //var first = points[0];
                    //    //console.log("FIRST", first);
                    //    graphics.lineStyle(2, lineColor, 1);
                    //    //graphics.lineStyle(1, 0xffff00, 1);
                    //    graphics.beginFill(0xff0000, 1);
                    //    graphics.drawCircle(point.x, point.y, 5);
                    //    //graphics.lineStyle(2, 0xff0000, 1);
                    //    //graphics.moveTo(point.x, point.y);
                    //    //graphics.lineTo(first.x, first.y);
                    //    graphics.endFill();
                    //}
                });
            });
        }

        drawPSLG() {

            var graphics = this.graphics;

            //var cornerIndexes = this.layer.cornerIndexes;

            var shapes = _.reduce(this.layer.p3, (res, shape, i) => {

                var output = [];

                //var shapePoints = shape.points;

                //var points = [];
                //res.push(points);

                //var total = shapePoints.length;
                //for (let i = 0; i < total; i += 2) {
                //    var point = new Point(shapePoints[i], shapePoints[i + 1]);
                //    points.push(point);
                //}

                var shapePoints = _.reduce(shape.points, (points, point, j) => {
                //var shapePoints = _.reduce(shape.edges, (points, point) => {

                    output.push(point[0], point[1]);

                    var pp = new Point(point[0], point[1]);
                    points.push(pp);
                    //points.push(new Point(point[0], point[1]));

                    //console.log("CNN", cornerIndexes[i][j]);
                    //if (cornerIndexes[i].indexOf(j) > -1) {
                    //    //console.log("CONER FOUND");
                    //    //pp.isCorner = true;
                    //}

                    return points;
                }, []);

                //console.log("SHAPE\n", JSON.stringify(output));

                res.push(shapePoints);

                return res;
            }, []);
            
            //console.log("DRAW PSLG\n", shapes);

            var rawShapes = this.layer.shapes;

            _.forEach(shapes, (shape, i) => {

                //var fill = 0x4CAF50;
                var fill = 0xffd900;
                fill = 0xff0000;
                //fill = 0x990099;


                //fill = 0xffffff;
                //fill = 0x00ff00;

                graphics.beginFill(fill, 0.3);
                graphics.lineStyle(2, fill, 1);
                graphics.lineStyle(2, fill, 0);
                
                //graphics.beginFill(0xffd900, 0.3);
                //graphics.lineStyle(2, 0xffd900, 1);

                graphics.drawPolygon(shape);
                graphics.endFill();
                
                //var cornerIndexes = findCorners(rawShapes[i], rawShapes[i], 90);
                //var cornerIndexes = findCorners(rawShapes[i], shape, 10);
                var cornerIndexes = findCorners(rawShapes[i], rawShapes[i], 10);

                var simp = simplifyPath(rawShapes[i], 0);
                //console.log("SIMPLIFIED PATH", simp);
                //console.log("SIMP %s SHAPE %s", simp && simp.length, shape && shape.length);


                //_.forEach(rawShapes[i], (point, j, shapes) => {

                //    if (point === _.first(shapes)) {

                //        graphics.lineStyle(1, 0x000000, 1);
                //        //graphics.lineStyle(1, 0xffff00, 1);
                //        graphics.beginFill(0x00ff00);
                //        graphics.drawCircle(point.x, point.y, 5);
                //        graphics.endFill();

                //    } else if (point === _.last(shapes)) {
                //        graphics.lineStyle(1, 0x000000, 1);
                //        //graphics.lineStyle(1, 0xffff00, 1);
                //        graphics.beginFill(0xff0000);
                //        graphics.drawCircle(point.x, point.y, 5);
                //        graphics.endFill();
                //    }
                //});

                ////_.forEach(shape, (point) => {
                //_.forEach(rawShapes[i], (point) => {
                //    if (point.isCorner) {

                //        fill = 0xff0000;
                //        //fill = 0xE91E63;

                //        graphics.lineStyle(1, fill, 1);
                //        graphics.beginFill(fill, 0.2);

                //        graphics.lineStyle(1, 0x000000, 0.4);
                //        graphics.beginFill(fill, 1);

                //        graphics.drawCircle(point.x, point.y, 5);

                //        //graphics.beginFill(0xff0000);
                //        graphics.endFill();
                //    }
                //});

                //_.forEach(simp, (point) => {

                //    if (point.isCorner) {
                //    //if (true) {

                //        fill = 0x00ff00;

                //        graphics.lineStyle(1, fill, 1);
                //        graphics.lineStyle(1, 0x000000, 0.4);
                //        graphics.beginFill(fill, 1);

                //        //graphics.drawRect(point.x - 5, point.y - 5, 10, 10);
                //        graphics.drawCircle(point.x, point.y, 5);

                //        graphics.endFill();
                //    }
                //});

            });
        }

        drawShapes() {

            var graphics = this.graphics;
            var lineColor = 0xa0a0a0;
            lineColor = 0x606060;
            lineColor = 0x000000;

            //graphics.lineStyle(2, 0xbada55, 1);
            graphics.lineStyle(2, lineColor, 1);

            _.forEach(this.layer.shapes, (shape) => {
                _.forEach(shape, (point, i) => {

                    if (!i) {
                        graphics.endFill();
                        graphics.moveTo(point.x, point.y);
                    } else {
                        graphics.lineTo(point.x, point.y);
                    }
                    //graphics.lineTo(point.x, point.y);
                });

                graphics.endFill();
            });

            //graphics.endFill();
        }

        drawLayer() {

            console.log("*** DRAW LAYER ***");

            var graphics = this.graphics;

            graphics.lineStyle(2, 0x000000);
            graphics.moveTo(this.layer.points[0].x, this.layer.points[0].y);

            var prev;
            var next;

            var moved = false;

            _.forEach(this.layer.points, (point, i, points) => {
            //_.forEach(this.layer.stitches, point => {

                prev = points[i - 1];
                next = points[i + 1];

                var stitch = this.layer.stitches[i];
                var flag = this.layer.stitches[i].flags;
                
                //switch (stitch.flags) {
                //    case StitchType.Jump:
                //        console.log("JUMP");
                //        graphics.lineStyle(2, 0x00ff00);
                //        //graphics.lineTo(point.x, point.y);
                //        break;
                //    case StitchType.Stop:
                //        console.log("STOP");
                //        graphics.lineStyle(2, 0x0000ff);
                //        //graphics.lineTo(point.x, point.y);
                //        break;
                //    case StitchType.Trim:
                //        console.log("TRIM");
                //        graphics.lineStyle(2, 0xff0000);
                //        //graphics.lineTo(point.x, point.y);
                //        break;
                //    default:
                //        graphics.lineStyle(2, 0x000000);
                //        graphics.lineTo(point.x, point.y);
                //}

                if (flag === StitchType.Jump) {
                    console.log("JUMP");
                }

                if (flag === StitchType.Stop) {
                    console.log("STOP");
                }

                if (!i) {
                    console.log("FIRST STITCH");
                    //graphics.moveTo(point.x, point.y);
                    //return true;
                }

                //if (next && next.flags === StitchType.Trim) {
                //    graphics.endFill();
                //    return true;
                //}

                if (flag === StitchType.Trim) {

                    graphics.lineStyle(2, 0xff0000);
                    //graphics.lineTo(point.x, point.y);



                    graphics.endFill();
                    graphics.moveTo(point.x, point.y);

                    if (!next) {
                        console.log("TRIM STOP");
                        //graphics.moveTo(point.x, point.y);
                    } else {
                        console.log("MOVING");
                        moved = true;
                    }

                    return true;

                } else {

                    graphics.lineStyle(2, 0x000000);

                    if (next && next.flags === StitchType.Trim) {
                        console.log("TRIM NEXT");
                        graphics.lineStyle(2, 0x00ff00);
                    }

                    if (i === 0) {
                        //console.log("FIRST STITCH");
                        graphics.lineStyle(2, 0x0000ff);
                    }

                    if (prev && prev.flags === StitchType.Trim) {
                        console.log("TRIM PREV");
                        graphics.lineStyle(2, 0xff0000);
                    }

                    //graphics.lineTo(point.x, point.y);
                    

                    //if (flag === StitchType.Normal) {
                    ////if (flag === StitchType.Normal && i !== 1) {
                    //    //console.log("NORMAL STITCH");
                    //    graphics.lineTo(point.x, point.y);
                    //} else {
                    //    console.log("NOT A NORMAL STITCH", i);
                    //    graphics.moveTo(point.x, point.y);
                    //}
                }

                if (moved) {
                    moved = false;
                    graphics.lineStyle(2, 0xff0000);
                }

                if (flag === StitchType.Normal) {
                    //if (flag === StitchType.Normal && i !== 1) {
                    //console.log("NORMAL STITCH");
                    graphics.lineTo(point.x, point.y);
                } else {
                    console.log("NOT A NORMAL STITCH", i);
                    //graphics.moveTo(point.x, point.y);
                }

                //if (flag === StitchType.End) {
                //    console.log("END STITCH");
                //}

                


                //graphics.lineTo(point.x, point.y);

                graphics.lineStyle(2, 0x000000);
            });

            //graphics.endFill();
        }
        
        render() {
            this.renderer.render(this.stage);
        }
    }

    module.controller("PatchLayer", PatchLayer);

    module.component("patchLayer", {
        templateUrl: "app/routes/control-panel/patch-editor/patch-layer.html",
        controller: "PatchLayer",
        require: {
            patchDesign: "^patchDesign"  
        },
        bindings: {
            layer: "=",
            patchWidth: "@",
            patchHeight: "@"
        }
    });
}