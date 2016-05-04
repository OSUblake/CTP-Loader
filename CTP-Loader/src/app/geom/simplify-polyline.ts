namespace CTP.Geom {

    //import Point = Geom.Point;

    const module = getModule();

    export function simplifyPath(points: Point[], tolerance = 0) {
        
        var total = points && points.length;

        if (!total || total < 3) return points;

        //console.log("START LEN", total);

        var previousPoint = points[0];
        var acceptedPoint = points[0];
        var currentPoint  = points[1];
        var currentVector = Point.subtract(currentPoint, previousPoint);
        var previousVector;

        var result = [points[0]];
        var cache  = [];
        
        for (let i = 2; i < total; i++) {

            previousPoint  = currentPoint;
            currentPoint   = points[i];
            previousVector = currentVector;
            currentVector  = Point.subtract(currentPoint, previousPoint);

            if (previousVector.dot(currentVector) <= 0) {

                //console.log("DOT VECT", previousVector.dot(currentVector));

                // Corner
                //previousPoint.isCorner = true;
                currentPoint.isCorner = true;
                acceptPoint();

            } else {

                var candidate  = Point.subtract(currentPoint, acceptedPoint);
                var lastVector = Point.subtract(previousPoint, acceptedPoint);

                cache.push(lastVector);

                for (let j = 0; j < cache.length; j++) {

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
}