namespace CTP.Geom {

    const module = getModule();

    function distanceSq(p1: Point, p2: Point) {
        return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
    }

    /**
     * Square distance from point to a segment
     * @param p
     * @param p1
     * @param p2
     */
    function segDistSq(p: Point, start: Point, end: Point) {

        var x = start.x;
        var y = start.y;
        var dx = end.x - x;
        var dy = end.y - y;

        if (dx !== 0 || dy !== 0) {

            var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

            if (t > 1) {

                x = end.x;
                y = end.y;

            } else if (t > 0) {

                x += dx * t;
                y += dy * t;
            }
        }

        dx = p.x - x;
        dy = p.y - y;

        return dx * dx + dy * dy;
    }

    function simplifyRadialDist(points: Point[], toleranceSq: number) {

        var prevPoint = points[0];
        var newPoints = [prevPoint];
        var total = points.length;
        var point;

        for (let i = 1; i < total; i++) {

            point = points[i];

            if (distanceSq(point, prevPoint) > toleranceSq) {
                newPoints.push(point);
                prevPoint = point;
            }
        }
        
        if (prevPoint !== point) newPoints.push(point);

        return newPoints;
    }

    function simplifyDPStep(points: Point[], first: number, last: number, toleranceSq: number, simplified: Point[]) {

        var maxDistSq = toleranceSq;
        var index = 0;

        for (let i = first + 1; i < last; i++) {

            var distSq = segDistSq(points[i], points[first], points[last]);

            if (distSq > maxDistSq) {
                index = i;
                maxDistSq = distSq;
            }
        }

        if (maxDistSq > toleranceSq) {

            if (index - first > 1) {
                simplifyDPStep(points, first, index, toleranceSq, simplified);
            }

            simplified.push(points[index]);

            if (last - index > 1) {
                simplifyDPStep(points, index, last, toleranceSq, simplified);
            }
        }
    }

    function simplifyDouglasPeucker(points: Point[], toleranceSq: number) {

        var last = points.length - 1;

        var simplified = [points[0]];

        simplifyDPStep(points, 0, last, toleranceSq, simplified);
        simplified.push(points[last]);

        return simplified;
    }

    export function simplify(points: Point[], tolerance?: number, highQuality?: boolean) {

        if (points.length <= 2) return points;

        var toleranceSq = tolerance != null ? tolerance ** 2 : 1;

        points = highQuality ? points : simplifyRadialDist(points, toleranceSq);
        points = simplifyDouglasPeucker(points, toleranceSq);

        return points;
    }

    module.factory("simplify", simplify);
}