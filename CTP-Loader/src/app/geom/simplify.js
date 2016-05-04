var CTP;
(function (CTP) {
    var Geom;
    (function (Geom) {
        var module = Geom.getModule();
        function distanceSq(p1, p2) {
            return Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2);
        }
        /**
         * Square distance from point to a segment
         * @param p
         * @param p1
         * @param p2
         */
        function segDistSq(p, start, end) {
            var x = start.x;
            var y = start.y;
            var dx = end.x - x;
            var dy = end.y - y;
            if (dx !== 0 || dy !== 0) {
                var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
                if (t > 1) {
                    x = end.x;
                    y = end.y;
                }
                else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }
            dx = p.x - x;
            dy = p.y - y;
            return dx * dx + dy * dy;
        }
        function simplifyRadialDist(points, toleranceSq) {
            var prevPoint = points[0];
            var newPoints = [prevPoint];
            var total = points.length;
            var point;
            for (var i = 1; i < total; i++) {
                point = points[i];
                if (distanceSq(point, prevPoint) > toleranceSq) {
                    newPoints.push(point);
                    prevPoint = point;
                }
            }
            if (prevPoint !== point)
                newPoints.push(point);
            return newPoints;
        }
        function simplifyDPStep(points, first, last, toleranceSq, simplified) {
            var maxDistSq = toleranceSq;
            var index = 0;
            for (var i = first + 1; i < last; i++) {
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
        function simplifyDouglasPeucker(points, toleranceSq) {
            var last = points.length - 1;
            var simplified = [points[0]];
            simplifyDPStep(points, 0, last, toleranceSq, simplified);
            simplified.push(points[last]);
            return simplified;
        }
        function simplify(points, tolerance, highQuality) {
            if (points.length <= 2)
                return points;
            var toleranceSq = tolerance != null ? Math.pow(tolerance, 2) : 1;
            points = highQuality ? points : simplifyRadialDist(points, toleranceSq);
            points = simplifyDouglasPeucker(points, toleranceSq);
            return points;
        }
        Geom.simplify = simplify;
        module.factory("simplify", simplify);
    })(Geom = CTP.Geom || (CTP.Geom = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=simplify.js.map