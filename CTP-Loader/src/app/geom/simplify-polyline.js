var CTP;
(function (CTP) {
    var Geom;
    (function (Geom) {
        //import Point = Geom.Point;
        var module = Geom.getModule();
        function simplifyPath(points, tolerance) {
            if (tolerance === void 0) { tolerance = 0; }
            var total = points && points.length;
            if (!total || total < 3)
                return points;
            //console.log("START LEN", total);
            var previousPoint = points[0];
            var acceptedPoint = points[0];
            var currentPoint = points[1];
            var currentVector = Geom.Point.subtract(currentPoint, previousPoint);
            var previousVector;
            var result = [points[0]];
            var cache = [];
            for (var i = 2; i < total; i++) {
                previousPoint = currentPoint;
                currentPoint = points[i];
                previousVector = currentVector;
                currentVector = Geom.Point.subtract(currentPoint, previousPoint);
                if (previousVector.dot(currentVector) <= 0) {
                    //console.log("DOT VECT", previousVector.dot(currentVector));
                    // Corner
                    //previousPoint.isCorner = true;
                    currentPoint.isCorner = true;
                    acceptPoint();
                }
                else {
                    var candidate = Geom.Point.subtract(currentPoint, acceptedPoint);
                    var lastVector = Geom.Point.subtract(previousPoint, acceptedPoint);
                    cache.push(lastVector);
                    for (var j = 0; j < cache.length; j++) {
                        var perp = cache[j].perpendicular(candidate);
                        if (perp.magnitude > tolerance) {
                            acceptPoint();
                            break;
                        }
                    }
                }
            }
            result.push(_.last(points));
            function acceptPoint() {
                acceptedPoint = previousPoint;
                result.push(acceptedPoint);
                cache = [];
            }
            return result;
        }
        Geom.simplifyPath = simplifyPath;
    })(Geom = CTP.Geom || (CTP.Geom = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=simplify-polyline.js.map