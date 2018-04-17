var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

canvas.onmousedown = clickMouse;
canvas.onmouseup = releaseMouse;
canvas.onmousemove = dragMouse;

var height = 0.5;
var width = 0.5;
var length = 0.5;

var center_x;
var center_y;

var perimeter = 0;

var sourceX = 0;
var sourceY = 0;

var points = starPoints(sourceX, sourceY);
var centerPoints = starPoints(0,0);

var mouseIsDown = false;
var selectedPoint = {};
selectedRectangleCenterX = 0;
selectedRectangleCenterY = 0;

var voronoiDiagram = null;
var voronoiDiagramAll = null;

var fade = 0.5;

var SCALE = 15;

var voronoiDisp = true;
var rectColorsDisp = true;
var starEdgesDisp = true;
var fadeDisp = true;

var upperLeftShortestFace = "height-length";
var upperRightShortestFace = "height-length";
var lowerLeftShortestFace = "height-length";
var lowerRightShortestFace = "height-length";

resizeCanvas();
setInterval(draw, 10);

function negateIfTrue(value, exp) {
    return (exp ? -1 : 1) * value;
}

function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    perimeter = 0;

    updateCheckBoxes();

    rescale();

    if (rectColorsDisp) {
        drawBgRectangles(width, height, length);
    }

    var minimumx = - ((width*SCALE)/2 - 1);
    var maximumx = width*SCALE/2 - 1;
    var minimumy = - (height*SCALE/2 - 1);
    var maximumy = (height*SCALE/2 - 1);
    sourceX = Math.max(Math.min(sourceX, maximumx), minimumx);
    sourceY = Math.max(Math.min(sourceY, maximumy), minimumy);

    setSwapBooleans(sourceX, sourceY);

    points = starPoints(sourceX, sourceY);
    centerPoints = starPoints(0,0);

    drawSymmetricPointsAndLines(sourceX,sourceY);

    //document.getElementById("perimeter").innerHTML=perimeter;
}

function resizeCanvas() {
    canvas.width = $(window).width() - 530;
    center_x = canvas.width / 2;
    canvas.height = $(window).height() - 65;
    center_y = canvas.height / 2;
}

function rescale() {
    var totalWidth = Math.max(width*3 + length*2, width + 2*height + 2*length);
    var totalHeight = Math.max(height*3 + length*2, width*2 + height + 2*length);
    // if(!more_wxl_faces) {
    //     totalWidth = Math.max(width*3 + length*2, width + 2*height);
    //     totalHeight = Math.max(height*3 + length*2, width*2 + length*2 + height);
    // }

    var newScale = SCALE;

    var canvasHeightToWidthRatio = canvas.height / canvas.width;

    if(totalHeight > totalWidth * canvasHeightToWidthRatio) {
        newScale = canvas.height * 0.9 / totalHeight;
    } else if (totalWidth * canvasHeightToWidthRatio >= totalHeight) {
        newScale = canvas.width * 0.9 / totalWidth;
    }

    SCALE = newScale;
}

function drawBgRectangles(w, h, l) {
    var scaledWidth = w * SCALE;
    var scaledLength = l * SCALE;
    var scaledHeight = h * SCALE;

    var drawMiddleRectangle = function() {
        drawRectangle(center_x - scaledWidth/2,center_y - scaledHeight/2, scaledWidth, scaledHeight, H_BY_W_COLOR);
    }

    var drawMiddleAdjacentRectangles = function() {
        drawRectangle(center_x + scaledWidth/2, center_y - scaledHeight/2, scaledLength, scaledHeight, H_BY_L_COLOR);
        drawRectangle(center_x - scaledWidth/2 - scaledLength, center_y - scaledHeight/2, scaledLength, scaledHeight, H_BY_L_COLOR);

        drawRectangle(center_x - scaledWidth/2, center_y - scaledHeight/2 - scaledLength, scaledWidth, scaledLength, W_BY_L_COLOR);
        drawRectangle(center_x - scaledWidth/2, center_y + scaledHeight/2, scaledWidth, scaledLength, W_BY_L_COLOR);
    }

    var drawCrossSourceRectangle = function(isWLAdj, isUpperLeftAdj) {
        var x = center_x - negateIfTrue(scaledWidth/2, !isWLAdj && !isUpperLeftAdj)
            + (!isWLAdj ? negateIfTrue(scaledLength, isUpperLeftAdj) : 0)
            - (!isWLAdj && isUpperLeftAdj ? scaledWidth : 0);
        var y = center_y - negateIfTrue(scaledHeight/2, isWLAdj && !isUpperLeftAdj) 
            + (isWLAdj ? negateIfTrue(scaledLength, isUpperLeftAdj) : 0)
            - (isWLAdj && isUpperLeftAdj ? scaledHeight : 0);
        drawRectangle(x, y, scaledWidth, scaledHeight, H_BY_W_COLOR);
    }

    var drawHLAdjSourceFace = function(isLeft, isTop) {
        var x = center_x + negateIfTrue(scaledWidth/2, isLeft)
            - (isLeft ? scaledHeight : 0);
        var y = center_y + negateIfTrue(scaledHeight/2, isTop) + negateIfTrue(scaledLength, isTop)
            - (isTop ? scaledWidth : 0);
        drawRectangle(x, y, scaledHeight, scaledWidth, H_BY_W_COLOR);
    }

    var drawWLAdjSourceFace = function(isLeft, isTop) {
        var x = center_x + negateIfTrue(scaledWidth/2, isLeft) + negateIfTrue(scaledLength, isLeft)
            - (isLeft ? scaledHeight : 0);
        var y = center_y + negateIfTrue(scaledHeight/2, isTop)
            - (isTop ? scaledWidth : 0);
        drawRectangle(x, y, scaledHeight, scaledWidth, H_BY_W_COLOR);
    }

    var drawCornerHLFace = function(isLeft, isTop) {
        var x = center_x + negateIfTrue(scaledWidth/2, isLeft)
            - (isLeft ? scaledHeight : 0);
        var y = center_y + negateIfTrue(scaledHeight/2, isTop)
            - (isTop ? scaledLength : 0);
        drawRectangle(x, y, scaledHeight, scaledLength, H_BY_L_COLOR);
    }

    var drawCornerWLFace = function(isLeft, isTop) {
        var x = center_x + negateIfTrue(scaledWidth/2, isLeft)
            - (isLeft ? scaledLength : 0);
        var y = center_y + negateIfTrue(scaledHeight/2, isTop)
            - (isTop ? scaledWidth : 0);
        drawRectangle(x, y, scaledLength, scaledWidth, W_BY_L_COLOR);
    }

    var drawNextCornerHLFace = function(isLeft, isTop) {
        var x = center_x + negateIfTrue(scaledWidth/2, isLeft)
            - (isLeft ? scaledLength : 0);
        var y = center_y + negateIfTrue(scaledHeight/2, isTop)
            + negateIfTrue(scaledWidth, isTop)
            - (isTop ? scaledHeight : 0);
        drawRectangle(x, y, scaledLength, scaledHeight, H_BY_L_COLOR);
    }

    var drawNextCornerWLFace = function(isLeft, isTop) {
        var x = center_x + negateIfTrue(scaledWidth/2, isLeft)
            + negateIfTrue(scaledHeight, isLeft)
            - (isLeft ? scaledWidth : 0);
        var y = center_y + negateIfTrue(scaledHeight/2, isTop)
            - (isTop ? scaledLength : 0);
        drawRectangle(x, y, scaledWidth, scaledLength, W_BY_L_COLOR);
    }

    var drawFarSourceFaceHLFirst = function(isLeft, isTop) {
        var x = center_x + negateIfTrue(scaledWidth/2, isLeft)
            + negateIfTrue(scaledHeight, isLeft)
            - (isLeft ? scaledWidth : 0);
        var y = center_y + negateIfTrue(scaledHeight/2, isTop)
            + negateIfTrue(scaledLength, isTop)
            - (isTop ? scaledHeight : 0);
        drawRectangle(x, y, scaledWidth, scaledHeight, H_BY_W_COLOR);
    }

    var drawFarSourceFaceWLFirst = function(isLeft, isTop) {
        var x = center_x + negateIfTrue(scaledWidth/2, isLeft)
            + negateIfTrue(scaledLength, isLeft)
            - (isLeft ? scaledWidth : 0);
        var y = center_y + negateIfTrue(scaledHeight/2, isTop)
            + negateIfTrue(scaledWidth, isTop)
            - (isTop ? scaledHeight : 0);
        drawRectangle(x, y, scaledWidth, scaledHeight, H_BY_W_COLOR);
    }

    var drawCrossRectangles = function() {
        drawMiddleRectangle();
        drawMiddleAdjacentRectangles();
        if (displayLeftBox()) {
            drawCrossSourceRectangle(false, true);
        }
        if (displayTopBox()) {
            drawCrossSourceRectangle(true, true);
        }
        if (displayRightBox()) {
            drawCrossSourceRectangle(false, false);
        }
        if (displayBottomBox()) {
            drawCrossSourceRectangle(true, false);
        }
    }

    drawCrossRectangles();

    var drawCornerRectangles = function(isLeft, isTop, shortestFace) {
        if (shortestFace === "width-length") {
            drawWLAdjSourceFace(isLeft, isTop);
            drawCornerWLFace(isLeft, isTop);
        } else if (shortestFace === "height-length") {
            drawHLAdjSourceFace(isLeft, isTop);
            drawCornerHLFace(isLeft, isTop);
        } else if (shortestFace === "both-wl-first") {
            drawCornerWLFace(isLeft, isTop);
            drawNextCornerHLFace(isLeft, isTop);
            drawFarSourceFaceWLFirst(isLeft, isTop);
            drawWLAdjSourceFace(isLeft, isTop);
        } else {
            drawCornerHLFace(isLeft, isTop);
            drawNextCornerWLFace(isLeft, isTop);
            drawFarSourceFaceHLFirst(isLeft, isTop);
            drawHLAdjSourceFace(isLeft, isTop);
        }
    }

    drawCornerRectangles(true, true, upperLeftShortestFace);
    drawCornerRectangles(false, true, upperRightShortestFace);
    drawCornerRectangles(true, false, lowerLeftShortestFace);
    drawCornerRectangles(false, false, lowerRightShortestFace);
}

function drawSymmetricPointsAndLines(relx, rely) {
    var scaledHeight = height * SCALE;
    var scaledWidth = width * SCALE;
    var scaledLength = length * SCALE;

    var middleFaceVertex = function(isLeft, isTop) {
        return {
            x: center_x + negateIfTrue(scaledWidth/2, isLeft),
            y: center_y + negateIfTrue(scaledHeight/2, isTop)
        };
    };

    var horizAxisSourceFaceVertex = function(isLeft, isTop) {
        return {
            x: center_x + negateIfTrue(scaledWidth/2 + scaledLength, isLeft),
            y: center_y + negateIfTrue(scaledHeight/2, isTop)
        };
    };

    var vertAxisSourceFaceVertex = function(isLeft, isTop) {
        return {
            x: center_x + negateIfTrue(scaledWidth/2, isLeft),
            y: center_y + negateIfTrue(scaledHeight/2 + scaledLength, isTop)
        };
    };

    var bothWLFirstMidVertex = function(isLeft, isTop) {
        return {
            x: center_x + negateIfTrue(scaledWidth/2 + scaledLength, isLeft),
            y: center_y + negateIfTrue(scaledHeight/2 + scaledWidth, isTop)
        };
    };

    var bothHLFirstMidVertex = function(isLeft, isTop) {
        return {
            x: center_x + negateIfTrue(scaledWidth/2 + scaledHeight, isLeft),
            y: center_y + negateIfTrue(scaledHeight/2 + scaledLength, isTop)
        };
    };

    var voronoi = new Voronoi();
    var bbox = {xl: -50, xr: canvas.width + 50, yt: -50, yb: canvas.height + 50};
    try {
        voronoiDiagram = voronoi.compute(points, bbox);
    } catch(Exception) {

    }

    if (voronoiDisp) {
        for (var i = 0; i < voronoiDiagram.edges.length; i++) {
            var edge = voronoiDiagram.edges[i];
            drawVoronoiLines(edge.va.x, edge.va.y, edge.vb.x, edge.vb.y, VORONOI_COLOR);
        }
    }

    var innerPolygon = [];

    // lower left
    if (lowerLeftShortestFace === "height-length") {
        if (displayBottomBox()) {
            innerPolygon.push(vertAxisSourceFaceVertex(true, false));
        }
        innerPolygon.push(middleFaceVertex(true, false));
    } else if (lowerLeftShortestFace === "width-length") {
        innerPolygon.push(middleFaceVertex(true, false));
        if (displayLeftBox()) {
            innerPolygon.push(horizAxisSourceFaceVertex(true, false));
        }
    } else if (lowerLeftShortestFace === "both-hl-first") {
        innerPolygon.push(vertAxisSourceFaceVertex(true, false));
        innerPolygon.push(bothHLFirstMidVertex(true, false));
        innerPolygon.push(middleFaceVertex(true, false));
    } else {
        innerPolygon.push(middleFaceVertex(true, false));
        innerPolygon.push(bothWLFirstMidVertex(true, false));
        innerPolygon.push(horizAxisSourceFaceVertex(true, false));   
    }

    // upper left
    if (upperLeftShortestFace === "height-length") {
        innerPolygon.push(middleFaceVertex(true, true));
        if (displayTopBox()) {
            innerPolygon.push(vertAxisSourceFaceVertex(true, true));
        }
    } else if (upperLeftShortestFace === "width-length") {
        if (displayLeftBox()) {
            innerPolygon.push(horizAxisSourceFaceVertex(true, true));
        }
        innerPolygon.push(middleFaceVertex(true, true));
    } else if (upperLeftShortestFace === "both-hl-first") {
        innerPolygon.push(middleFaceVertex(true, true));
        innerPolygon.push(bothHLFirstMidVertex(true, true));
        innerPolygon.push(vertAxisSourceFaceVertex(true, true));
    } else {
        innerPolygon.push(horizAxisSourceFaceVertex(true, true)); 
        innerPolygon.push(bothWLFirstMidVertex(true, true));  
        innerPolygon.push(middleFaceVertex(true, true));
    }

    // upper right
    if (upperRightShortestFace === "height-length") {
        if (displayTopBox()) {
            innerPolygon.push(vertAxisSourceFaceVertex(false, true));
        }
        innerPolygon.push(middleFaceVertex(false, true));
    } else if (upperRightShortestFace === "width-length") {
        innerPolygon.push(middleFaceVertex(false, true));
        if (displayRightBox()) {
            innerPolygon.push(horizAxisSourceFaceVertex(false, true));
        }
    } else if (upperRightShortestFace === "both-hl-first") {
        innerPolygon.push(vertAxisSourceFaceVertex(false, true));
        innerPolygon.push(bothHLFirstMidVertex(false, true));
        innerPolygon.push(middleFaceVertex(false, true));
    } else {
        innerPolygon.push(middleFaceVertex(false, true));
        innerPolygon.push(bothWLFirstMidVertex(false, true));
        innerPolygon.push(horizAxisSourceFaceVertex(false, true));   
    }

    // lower right
    if (lowerRightShortestFace === "height-length") {
        innerPolygon.push(middleFaceVertex(false, false));
        if (displayBottomBox()) {
            innerPolygon.push(vertAxisSourceFaceVertex(false, false));
        }
    } else if (lowerRightShortestFace === "width-length") {
        if (displayRightBox()) {
            innerPolygon.push(horizAxisSourceFaceVertex(false, false));
        }
        innerPolygon.push(middleFaceVertex(false, false));
    } else if (lowerRightShortestFace === "both-hl-first") {
        innerPolygon.push(middleFaceVertex(false, false));
        innerPolygon.push(bothHLFirstMidVertex(false, false));
        innerPolygon.push(vertAxisSourceFaceVertex(false, false));
    } else {
        innerPolygon.push(horizAxisSourceFaceVertex(false, false));
        innerPolygon.push(bothWLFirstMidVertex(false, false));   
        innerPolygon.push(middleFaceVertex(false, false));
    }


    if (lowerLeftShortestFace === "both-wl-first") {
        var first = innerPolygon.shift();
        innerPolygon.push(first);
    }

    if (fadeDisp && starEdgesDisp) {
        fadeOutside(points, innerPolygon, fade);
    } else if (fadeDisp) {
        fadeEverything(fade);
    }

    if (starEdgesDisp) {
        drawStarPerimeter(points[0].x, points[0].y, innerPolygon[innerPolygon.length-1].x, innerPolygon[innerPolygon.length-1].y);
        drawStarPerimeter(points[0].x, points[0].y, innerPolygon[0].x, innerPolygon[0].y);
        for (var k = 1; k < points.length; k++) {
            drawStarPerimeter(points[k].x, points[k].y, innerPolygon[k-1].x, innerPolygon[k-1].y);
            drawStarPerimeter(points[k].x, points[k].y, innerPolygon[k].x, innerPolygon[k].y);
        }
        // if (innerPolygon.length === 9) {
        //     drawStarPerimeter(innerPolygon[7].x, innerPolygon[7].y, innerPolygon[8].x, innerPolygon[8].y);
        // }
    }

    for (var j = 0; j < points.length; j++) {
        drawPoint(points[j].x, points[j].y, points[j].dragable);
    }
}

function displayTopBox() {
    return upperRightShortestFace !== "both-wl-first" && upperLeftShortestFace !== "both-wl-first";
}

function displayBottomBox() {
    return lowerLeftShortestFace !== "both-wl-first" && lowerRightShortestFace !== "both-wl-first";
}

function displayLeftBox() {
    return upperLeftShortestFace !== "both-hl-first" && lowerLeftShortestFace !== "both-hl-first";
}

function displayRightBox() {
    return lowerRightShortestFace !== "both-hl-first" && upperRightShortestFace !== "both-hl-first";
}
 
function starPoints(relx, rely) {
    var pointArray = [];

    if (displayBottomBox()) {
        pointArray.push(crossSourcePoint(relx, rely, false, false));
    }
    pointArray = pointArray.concat(calcStarVertices(relx, rely, true, false, lowerLeftShortestFace));
    if (displayLeftBox()) {
        pointArray.push(crossSourcePoint(relx, rely, true, true));
    }
    pointArray = pointArray.concat(calcStarVertices(relx, rely, true, true, upperLeftShortestFace));
    if (displayTopBox()) {
        pointArray.push(crossSourcePoint(relx, rely, true, false));
    }
    pointArray = pointArray.concat(calcStarVertices(relx, rely, false, true, upperRightShortestFace));
    if (displayRightBox()) {
        pointArray.push(crossSourcePoint(relx, rely, false, true));
    }
    pointArray = pointArray.concat(calcStarVertices(relx, rely, false, false, lowerRightShortestFace));

    return pointArray;
}

function crossSourcePoint(relx, rely, isUpperLeftAdj, isOnHorizAxis) {
    var scaledHeight = height * SCALE;
    var scaledWidth = width * SCALE;
    var scaledLength = length * SCALE;

    var point = sourcePoint(relx, rely,
        center_x + (isOnHorizAxis ? negateIfTrue(scaledWidth + scaledLength, isUpperLeftAdj) : 0),
        center_y + (!isOnHorizAxis ? negateIfTrue(scaledHeight + scaledLength, isUpperLeftAdj) : 0),
        isOnHorizAxis, isOnHorizAxis,
        false);

    point.dragable = true;
    return point;
}

function calcStarVertices(relx, rely, isLeft, isTop, shortestFace) {
    var scaledHeight = height * SCALE;
    var scaledWidth = width * SCALE;
    var scaledLength = length * SCALE;
    var pointArray = [];

    if (shortestFace === "height-length" || shortestFace === "both-hl-first") {
        var firstPoint, secondPoint;
        firstPoint = sourcePointHLFirst(relx, rely, isLeft, isTop);
        if (shortestFace === "both-hl-first") {
            secondPoint = sourcePointBothHLFirst(relx, rely, isLeft, isTop);

            if (isLeft !== isTop) {
                pointArray.push(firstPoint);
                pointArray.push(secondPoint);
            } else {
                pointArray.push(secondPoint);
                pointArray.push(firstPoint);
            }
        } else {
            pointArray.push(firstPoint);
        }
    }

    else if (shortestFace === "width-length" || shortestFace === "both-wl-first") {
        var firstPoint, secondPoint;
        firstPoint = sourcePointWLFirst(relx, rely, isLeft, isTop);
        if (shortestFace === "both-wl-first") {
            secondPoint = sourcePointBothWLFirst(relx, rely, isLeft, isTop);

            if (isLeft !== isTop) {
                pointArray.push(secondPoint);
                pointArray.push(firstPoint);
            } else {
                pointArray.push(firstPoint);
                pointArray.push(secondPoint);
            }
        } else {
            pointArray.push(firstPoint);
        }
    }

    return pointArray;
}

function sourcePointHLFirst(relx, rely, isLeft, isTop) {
    var scaledHeight = height * SCALE;
    var scaledWidth = width * SCALE;
    var scaledLength = length * SCALE;
    return (sourcePoint(relx, rely, 
            center_x + negateIfTrue(scaledWidth/2 + scaledHeight/2, isLeft),
            center_y + negateIfTrue(scaledHeight/2 + scaledLength + scaledWidth/2, isTop),
            isLeft !== isTop, isLeft === isTop, true));
}

function sourcePointWLFirst(relx, rely, isLeft, isTop) {
    var scaledHeight = height * SCALE;
    var scaledWidth = width * SCALE;
    var scaledLength = length * SCALE;
    return (sourcePoint(relx, rely, 
            center_x + negateIfTrue(scaledWidth/2 + scaledHeight/2 + scaledLength, isLeft),
            center_y + negateIfTrue(scaledHeight/2 + scaledWidth/2, isTop),
            isLeft !== isTop, isLeft === isTop, true));
}

function sourcePointBothHLFirst(relx, rely, isLeft, isTop) {
    var scaledHeight = height * SCALE;
    var scaledWidth = width * SCALE;
    var scaledLength = length * SCALE;
    return (sourcePoint(relx, rely, 
            center_x + negateIfTrue(scaledWidth + scaledHeight, isLeft),
            center_y + negateIfTrue(scaledLength + scaledHeight, isTop),
            true, true, false));
}

function sourcePointBothWLFirst(relx, rely, isLeft, isTop) {
    var scaledHeight = height * SCALE;
    var scaledWidth = width * SCALE;
    var scaledLength = length * SCALE;
    return (sourcePoint(relx, rely, 
            center_x + negateIfTrue(scaledWidth + scaledLength, isLeft),
            center_y + negateIfTrue(scaledWidth + scaledHeight, isTop),
            false, false, false));
}

function sourcePoint(relx, rely, boxCenterX, boxCenterY, shouldInvertX, shouldInvertY, shouldSwitchXY) {
    return {
        x: boxCenterX + negateIfTrue(shouldSwitchXY ? rely : relx, shouldInvertX),
        y: boxCenterY + negateIfTrue(shouldSwitchXY ? relx : rely, shouldInvertY),
        shouldInvertX: shouldInvertX,
        shouldInvertY: shouldInvertY,
        shouldSwitchXY: shouldSwitchXY,
        dragable: true
    }
}

function setSwapBooleans(x, y) {
    var scaledHeight = height * SCALE;
    var scaledWidth = width * SCALE;

    // These are some of the vertices of the box
    var leftVertexX = center_x - scaledWidth/2;
    var rightVertexX = center_x + scaledWidth/2;
    var topVertexY = center_y - scaledHeight/2;
    var bottomVertexY = center_y + scaledHeight/2;

    var distanceArray = function(isLeft, isTop) {
        var hlFirstPoint = sourcePointHLFirst(x, y, isLeft, isTop);
        var wlFirstPoint = sourcePointWLFirst(x, y, isLeft, isTop);
        var bothHLFirstPoint = sourcePointBothHLFirst(x, y, isLeft, isTop);
        var bothWLFirstPoint = sourcePointBothWLFirst(x, y, isLeft, isTop);

        comparePoint = {
            x: isLeft ? leftVertexX : rightVertexX,
            y: isTop ? topVertexY : bottomVertexY
        }

        return [{
            name: "width-length",
            dist: distance(wlFirstPoint.x, wlFirstPoint.y, comparePoint.x, comparePoint.y)
        }, {
            name: "height-length",
            dist: distance(hlFirstPoint.x, hlFirstPoint.y, comparePoint.x, comparePoint.y)
        }, {
            name: "both-hl-first",
            dist: distance(bothHLFirstPoint.x, bothHLFirstPoint.y, comparePoint.x, comparePoint.y)
        }, {
            name: "both-wl-first",
            dist: distance(bothWLFirstPoint.x, bothWLFirstPoint.y, comparePoint.x, comparePoint.y)
        }];
    }

    lowerLeftShortestFace = shortestDist(distanceArray(true, false));

    upperLeftShortestFace = shortestDist(distanceArray(true, true));

    upperRightShortestFace = shortestDist(distanceArray(false, true));

    lowerRightShortestFace = shortestDist(distanceArray(false, false));
}

function shortestDist(distances) {
    var min = distances[0].dist;
    var minName = distances[0].name;

    for (var i = 1; i < distances.length; i++) {
        if (distances[i].dist < min) {
            minName = distances[i].name;
            min = distances[i].dist;
        }
    }

    return minName;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1,2));
}

function drawPoint(x, y, dragable) {
    ctx.beginPath();
    ctx.arc(x,y,POINT_RADIUS,0,360);
    if (dragable) {
        ctx.fillStyle = WHITE;
    } else {
        ctx.fillStyle = BLACK;
    }
    ctx.strokeStyle = BLACK;
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawStarPerimeter(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = BLACK;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1,2));
    perimeter += distance / SCALE;
}

function drawVoronoiLines(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function drawRectangle(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.strokeStyle = GRAY;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function fadeOutside(convexVertices, concaveVertices, opacity) {
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();

    ctx.moveTo(convexVertices[0].x, convexVertices[0].y);
    for(var i = convexVertices.length-1; i >= 0; i--) {
        ctx.lineTo(concaveVertices[i].x, concaveVertices[i].y);
        ctx.lineTo(convexVertices[i].x, convexVertices[i].y);
    }
    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,255," + opacity + ")";
    ctx.fill();
}

function fadeEverything(opacity) {
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,255," + opacity + ")";
    ctx.fill();
}

function clickMouse(e) {
    var mousePos = getMousePos(canvas, e);
    for (var i = 0; i < points.length; i ++){
        if ((mousePos.x >= points[i].x - POINT_RADIUS && mousePos.x <= points[i].x + POINT_RADIUS) &&
            (mousePos.y >= points[i].y - POINT_RADIUS && mousePos.y <= points[i].y + POINT_RADIUS)) {
            mouseIsDown = true;
            selectedPoint = points[i];

            if (selectedPoint.shouldSwitchXY) {
                selectedRectangleCenterX = selectedPoint.x + negateIfTrue(sourceY, selectedPoint.shouldInvertY);
                selectedRectangleCenterY = selectedPoint.y + negateIfTrue(sourceX, selectedPoint.shouldInvertX);
            } else {
                selectedRectangleCenterX = selectedPoint.x - negateIfTrue(sourceX, selectedPoint.shouldInvertX);
                selectedRectangleCenterY = selectedPoint.y - negateIfTrue(sourceY, selectedPoint.shouldInvertY);
            }
        }
    }
}

function dragMouse(e) {
    var mousePos = getMousePos(canvas, e);
    if (mouseIsDown) {
        if (selectedPoint.dragable) {
            if (selectedPoint.shouldSwitchXY) {
                sourceY = negateIfTrue(mousePos.x - selectedRectangleCenterX, selectedPoint.shouldInvertX);
                sourceX = negateIfTrue(mousePos.y - selectedRectangleCenterY, selectedPoint.shouldInvertY);
            } else {
                sourceX = negateIfTrue(mousePos.x - selectedRectangleCenterX, selectedPoint.shouldInvertX);
                sourceY = negateIfTrue(mousePos.y - selectedRectangleCenterY, selectedPoint.shouldInvertY);
            }
        }
    }
}

function releaseMouse(e) {
    mouseIsDown = false;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function updateCheckBoxes() {
    voronoiDisp = document.getElementById("voronoi-check").checked;
    rectColorsDisp = document.getElementById("faces-check").checked;
    starEdgesDisp = document.getElementById("star-check").checked;
    fadeDisp = document.getElementById("fade-check").checked;
}

//////////////////////////////////////////////////////////////
// Sliders                                                  //
//////////////////////////////////////////////////////////////

$(function() {
    $("#height" ).slider({
        value: 0.5,
        orientation: "horizontal",
        range: "min",
        min: 0.01,
        max: 1,
        animate: true,
        step: 0.01,
        slide: function (event, ui) {
            $("#heightAmount" ).val(ui.value);
            height = ui.value;
        }
    });
});

$(function() {
    $("#width" ).slider({
        value: 0.5,
        orientation: "horizontal",
        range: "min",
        min: 0.01,
        max: 1,
        step: 0.01,
        animate: true,
        slide: function (event, ui) {
            $("#widthAmount" ).val(ui.value);
            width = ui.value;
        }
    });
});

$(function() {
    $("#length" ).slider({
        value: 0.5,
        orientation: "horizontal",
        range: "min",
        min: 0.01,
        max: 1,
        step: 0.01,
        animate: true,
        slide: function (event, ui) {
            $("#lengthAmount" ).val(ui.value);
            length = ui.value;
        }
    });
});

$(function() {
    $("#fade" ).slider({
        value: 0.85,
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 1,
        step: 0.05,
        animate: true,
        slide: function (event, ui) {
            $("#fadeAmount" ).val(ui.value);
            fade = ui.value;
        }
    });
});
