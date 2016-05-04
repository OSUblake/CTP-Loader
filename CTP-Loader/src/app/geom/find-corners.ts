namespace CTP.Geom {

    const module = getModule();

    //export function angleBetween(p0: IPoint, p1: IPoint, p2: IPoint) {

    //    var a = Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2);
    //    var b = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    //    var c = Math.pow(p2.x - p0.x, 2) + Math.pow(p2.y - p0.y, 2);

    //    return Math.acos((a + b - c) / Math.sqrt(4 * a * b));
    //}

    //function pointsEqual(p1: IPoint, p2: IPoint) {

    //}

    export function _findCorners(points: Point[], cornerCandidates: Point[], detail: number) {
        
        var cornerIndexes = [];

        // The minimum angle is the angle that can hide behind a seemingly straight line
        var p1 = new Point(0, 0);
        var p2 = new Point(detail, 1);
        var p3 = new Point(detail * 2, 0);

        //var aMin = Math.PI - angleBetween({ x: 0, y: 0 }, { x: detail, y: 1 }, {x: detail * 2, y: 0 });
        var aMin = p2.angleBetween(p1, p3) / 2;

        //var iP = 0;
        //var iC = 0;
        var pLen = points.length;
        var cLen = cornerCandidates.length;

        //console.log("PLEN %s CLEN %s", pLen, cLen);

        for (var iP = 0, iC = 0; (iP < pLen) && (iC < cLen); iC++) {

            var A, B, C, D, E;
            var distance;

            var candidate = cornerCandidates[iC];

            // Find candidates position in the points array
            while (!candidate.equals(points[iP])) {
                iP++;

                //console.log("EQUALS", !candidate.equals(points[iP]), iP);

                if (iP >= pLen) {
                    // Start from beginning
                    console.log("COULDN'T FIND CORNER CANDIDATE", candidate);
                    iP = 0;
                    continue;
                }
            }

            // Starting from the candidate point (C), we find two points in both directions, 'detail' pixels apart:
            // - Points A & B before the candidate and D & E after.
            // - We calculate the difference in direction (in radians) for AB->BC (a1), BC->CD (a2) and CD->DE (a3):
            // - If a2 is a considerably wider angle than a1 and a3 combined, we say that we have a corner.
            C = points[iP];

            // A & B
            var iSearch = iP - 1;

            while ((iSearch >= 0) && (distance = C.distance(points[iSearch])) < detail) {
                iSearch--;
            }

            if (iSearch >= 0) {

                if (distance < 2 * detail) {

                    B = points[iSearch];
                    iSearch--;

                    while ((iSearch >= 0) && (B.distance(points[iSearch]) < detail)) {
                        iSearch--;
                    }

                    if (iSearch >= 0) {
                        A = points[iSearch];
                    }
                    
                } else {

                    A = points[iSearch];
                    B = new Point((A.x + C.x) / 2, (A.y + C.y) / 2);
                }
            }

            if (iSearch < 0) {
                // Not enough room to decide whether this is a corner
                console.log("A & B continue");
                continue;
            }

            // D & E
            iSearch = iP + 1;
            
            while ((iSearch < pLen) && (distance = C.distance(points[iSearch])) < detail) {
                iSearch++;
            }

            if (iSearch < pLen) {

                if (distance < 2 * detail) {

                    D = points[iSearch];
                    iSearch++;

                    while ((iSearch < pLen) && (D.distance(points[iSearch]) < detail)) {
                        iSearch++;
                    }

                    if (iSearch < pLen) {
                        E = points[iSearch];
                    }

                } else {
                    E = points[iSearch];
                    D = new Point((E.x + C.x) / 2, (E.y + C.y) / 2);
                }
            }

            if (iSearch >= pLen) {
                // Not enough room to decide whether this is a corner
                console.log("C & D continue");
                continue;
            }

            var a1 = Math.max(Math.PI - B.angleBetween(A, C), aMin);
            var a2 = Math.max(Math.PI - C.angleBetween(B, D), aMin);
            var a3 = Math.max(Math.PI - D.angleBetween(C, E), aMin);

            //console.log("C CORNER", C);

            if (a2 > (a1 + a3) * 3) {
                console.log("CORNER\n", C, a1, a2, a3);
                cornerIndexes.push(iP);

                // TEST
                points[iP].isCorner = true;
            }


            
        }
        return cornerIndexes;
    }

    //
    // 
    // ============================================================================
    export function findCorners(points, cornerCandidates, detail) {
        var candidate,
            iC, iP, iSearch, distance,
            A, B, C, D, E, a1, a2, a3, aMin,
            cornerIndexes = [];

        function pointsEqual(p1, p2) {
            return (p1.x === p2.x) && (p1.y === p2.y);
        }
        function getDistance(p1, p2) {
            var dX = p1.x - p2.x,
                dY = p1.y - p2.y;
            return Math.sqrt(dX * dX + dY * dY);
        }

        // http://phrogz.net/angle-between-three-points
        function findAngle(p0, p1, p2) {
            // Center point is p1; angle returned in radians
            var a = Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2),
                b = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2),
                c = Math.pow(p2.x - p0.x, 2) + Math.pow(p2.y - p0.y, 2);

            var angle = Math.acos((a + b - c) / Math.sqrt(4 * a * b));
            //console.log('findAngle:', p0, '->', p1, '->', p2, ':', angle);
            return angle;
        }

        //The minimum angle is the angle that can hide behind a seemingly straight line:
        aMin = Math.PI - findAngle({ x: 0, y: 0 }, { x: detail, y: 1 }, { x: detail * 2, y: 0 });
        aMin /= 2;

        for (iP = 0, iC = 0; (iP < points.length) && (iC < cornerCandidates.length); iC++) {
            candidate = cornerCandidates[iC];

            //Find the candidate's position in the points array
            //(assuming the same order of points in both arrays):
            while (!pointsEqual(candidate, points[iP])) {
                iP++;
                if (iP >= points.length) {
                    console.log("Couldn't find corner candidate", candidate);
                    //We must now start from the beginning when we search for the next candidate:
                    iP = 0;
                    continue;
                }
            }

            // Starting from the candidate point (C), we find two points in both directions, 'detail' pixels apart:
            // - Points A & B before the candidate and D & E after.
            // - We calculate the difference in direction (in radians) for AB->BC (a1), BC->CD (a2) and CD->DE (a3):
            // - If a2 is a considerably wider angle than a1 and a3 combined, we say that we have a corner.
            C = points[iP];

            //A & B
            iSearch = iP - 1;
            while ((iSearch >= 0) && (distance = getDistance(C, points[iSearch])) < detail) { iSearch--; }

            if (iSearch >= 0) {
                if (distance < (2 * detail)) {
                    B = points[iSearch];
                    iSearch--;
                    while ((iSearch >= 0) && (getDistance(B, points[iSearch]) < detail)) { iSearch--; }

                    if (iSearch >= 0) { A = points[iSearch]; }
                }
                else {
                    //If we have a very long line segment before C, pretend to cut it in half to get our two points:
                    A = points[iSearch];
                    B = {
                        x: (A.x + C.x) / 2,
                        y: (A.y + C.y) / 2
                    };
                }
            }
            if (iSearch < 0) { /*Not enough room to decide whether this is a corner*/ continue; }

            //D & E
            iSearch = iP + 1;
            while ((iSearch < points.length) && (distance = getDistance(C, points[iSearch])) < detail) { iSearch++; }

            if (iSearch < points.length) {
                if (distance < (2 * detail)) {
                    D = points[iSearch];
                    iSearch++;
                    while ((iSearch < points.length) && (getDistance(D, points[iSearch]) < detail)) { iSearch++; }

                    if (iSearch < points.length) { E = points[iSearch]; }
                }
                else {
                    //If we have a very long line segment after C, pretend to cut it in half to get our two points:
                    E = points[iSearch];
                    D = {
                        x: (E.x + C.x) / 2,
                        y: (E.y + C.y) / 2
                    };
                }
            }
            if (iSearch >= points.length) { /*Not enough room to decide whether this is a corner*/ continue; }

            //a1-3
            a1 = Math.max(Math.PI - findAngle(A, B, C), aMin);
            a2 = Math.max(Math.PI - findAngle(B, C, D), aMin);
            a3 = Math.max(Math.PI - findAngle(C, D, E), aMin);

            /*/DEBUG
            if((C.x > 238) && (C.x < 244)) {
                var js = JSON.stringify;
                console.log('Corner-DEBUG', tolerance, aMin,
                            a1.toFixed(2),a2.toFixed(2),a3.toFixed(2),
                            js(A),js(B), js(C), js(D),js(E));
            }
            //*/
            if (a2 > (a1 + a3) * 3) {
                //console.log('Corner', C, a1, a2, a3);
                cornerIndexes.push(iP);

                // TEST
                points[iP].isCorner = true;
            }
        }

        return cornerIndexes;
    }
}