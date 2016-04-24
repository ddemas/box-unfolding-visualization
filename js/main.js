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
var selectedPointInd = 0;

var voronoiDiagram = null;

var fade = 0.5;

var SCALE = 15;

var voronoiDisp = true;
var rectColorsDisp = true;
var starEdgesDisp = true;
var fadeDisp = true;

resizeCanvas();
setInterval(draw, 10);

function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    perimeter = 0;

    updateCheckBoxes();

    rescale();

    if (rectColorsDisp) {
        drawBgRectangles(width, height, length);
    }

    var minimumx = - (width*SCALE)/2;
    var maximumx = width*SCALE/2;
    var minimumy = - height*SCALE/2;
    var maximumy = height*SCALE/2;
    sourceX = Math.max(Math.min(sourceX, maximumx), minimumx);
    sourceY = Math.max(Math.min(sourceY, maximumy), minimumy);

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
    var totalWidth = width*3 + length*2;
    var totalHeight = Math.max(height*3 + length*2, width*2 + height);
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

    drawRectangle(center_x - scaledWidth/2,center_y - scaledHeight/2, scaledWidth, scaledHeight, H_BY_W_COLOR);

    drawRectangle(center_x - scaledWidth/2,center_y - scaledHeight*3/2 - scaledLength, scaledWidth, scaledHeight, H_BY_W_COLOR);
    drawRectangle(center_x - scaledWidth/2,center_y + scaledHeight/2 + scaledLength, scaledWidth, scaledHeight, H_BY_W_COLOR);

    drawRectangle(center_x - scaledWidth/2 - scaledLength - scaledHeight,
        center_y - scaledHeight/2 - scaledWidth,
        scaledHeight, scaledWidth, H_BY_W_COLOR);
    drawRectangle(center_x - scaledWidth/2 - scaledLength - scaledWidth,
        center_y - scaledHeight/2,
        scaledWidth, scaledHeight, H_BY_W_COLOR);
    drawRectangle(center_x - scaledWidth/2 - scaledLength - scaledHeight,
        center_y + scaledHeight/2,
        scaledHeight, scaledWidth, H_BY_W_COLOR);

    drawRectangle(center_x + scaledWidth/2 + scaledLength,
        center_y - scaledHeight/2 - scaledWidth,
        scaledHeight, scaledWidth, H_BY_W_COLOR);
    drawRectangle(center_x + scaledWidth/2 + scaledLength,
        center_y - scaledHeight/2,
        scaledWidth, scaledHeight, H_BY_W_COLOR);
    drawRectangle(center_x + scaledWidth/2 + scaledLength,
        center_y + scaledHeight/2,
        scaledHeight, scaledWidth, H_BY_W_COLOR);

    drawRectangle(center_x + scaledWidth/2, center_y - scaledHeight/2, scaledLength, scaledHeight, H_BY_L_COLOR);
    drawRectangle(center_x - scaledWidth/2 - scaledLength, center_y - scaledHeight/2, scaledLength, scaledHeight, H_BY_L_COLOR);

    drawRectangle(center_x - scaledWidth/2 - scaledLength, center_y - scaledHeight/2 - scaledWidth, scaledLength, scaledWidth, W_BY_L_COLOR);
    drawRectangle(center_x - scaledWidth/2, center_y - scaledHeight/2 - scaledLength, scaledWidth, scaledLength, W_BY_L_COLOR);
    drawRectangle(center_x + scaledWidth/2, center_y - scaledHeight/2 - scaledWidth, scaledLength, scaledWidth, W_BY_L_COLOR);
    drawRectangle(center_x - scaledWidth/2 - scaledLength, center_y + scaledHeight/2, scaledLength, scaledWidth, W_BY_L_COLOR);
    drawRectangle(center_x - scaledWidth/2, center_y + scaledHeight/2, scaledWidth, scaledLength, W_BY_L_COLOR);
    drawRectangle(center_x + scaledWidth/2, center_y + scaledHeight/2, scaledLength, scaledWidth, W_BY_L_COLOR);
}

function drawSymmetricPointsAndLines(relx, rely) {
    // B(x, y+a+c)
    // C(-b-c+y, (a+b)/2+x)
    // D(-b-c-x, y)
    // E(-(a+b)/2-c+y, -(a+b)/2-x)
    // F(x, -a-c+y)
    // G((a+b)/2+c-y, -(a+b)/2+x)
    // H(b+c-x, -y)
    // I((a+b)/2+c+y, (a+b)/2-x)
    var scaledHeight = height * SCALE;
    var scaledWidth = width * SCALE;
    var scaledLength = length * SCALE;

    // Apologies for the bad variable names. These are the vertices of the box
    var leftVertexX = center_x - scaledWidth/2 - scaledLength;
    var midLeftVertexX = center_x - scaledWidth/2;
    var midRightVertexX = center_x + scaledWidth/2;
    var rightVertexX = center_x + scaledWidth/2 + scaledLength;
    var topVertexY = center_y - scaledHeight/2;
    var bottomVertexY = center_y + scaledHeight/2;

    var voronoi = new Voronoi();
    var bbox = {xl: -50, xr: canvas.width + 50, yt: -50, yb: canvas.height + 50};
    try {
        voronoiDiagram = voronoi.compute(points, bbox);
    } catch(Exception) {
        console.log("oops");
    }

    if (voronoiDisp) {
        for (var i = 0; i < voronoiDiagram.edges.length; i++) {
            var edge = voronoiDiagram.edges[i];
            drawVoronoiLines(edge.va.x, edge.va.y, edge.vb.x, edge.vb.y);
        }
    }

    if (fadeDisp && starEdgesDisp) {
        fadeOutside(points,
            [{x: midLeftVertexX, y: bottomVertexY},
                {x: leftVertexX, y: bottomVertexY},
                {x: leftVertexX, y: topVertexY},
                {x: midLeftVertexX, y: topVertexY},
                {x: midRightVertexX, y: topVertexY},
                {x: rightVertexX, y: topVertexY},
                {x: rightVertexX, y: bottomVertexY},
                {x: midRightVertexX, y: bottomVertexY}],
            fade);
    } else if (fadeDisp) {
        fadeEverything(fade);
    }

    if (starEdgesDisp) {
        // F
        drawStarPerimeter(points[0].x, points[0].y, midLeftVertexX, bottomVertexY);
        drawStarPerimeter(points[0].x, points[0].y, midRightVertexX, bottomVertexY);

        // E
        drawStarPerimeter(points[1].x, points[1].y, leftVertexX, bottomVertexY);
        drawStarPerimeter(points[1].x, points[1].y, midLeftVertexX, bottomVertexY);

        // D
        drawStarPerimeter(points[2].x, points[2].y, leftVertexX, topVertexY);
        drawStarPerimeter(points[2].x, points[2].y, leftVertexX, bottomVertexY);

        // C
        drawStarPerimeter(points[3].x, points[3].y, leftVertexX, topVertexY);
        drawStarPerimeter(points[3].x, points[3].y, midLeftVertexX, topVertexY);

        // B
        drawStarPerimeter(points[4].x, points[4].y, midLeftVertexX, topVertexY);
        drawStarPerimeter(points[4].x, points[4].y, midRightVertexX, topVertexY);

        // I
        drawStarPerimeter(points[5].x, points[5].y, midRightVertexX, topVertexY);
        drawStarPerimeter(points[5].x, points[5].y, rightVertexX, topVertexY);

        // H
        drawStarPerimeter(points[6].x, points[6].y, rightVertexX, topVertexY);
        drawStarPerimeter(points[6].x, points[6].y, rightVertexX, bottomVertexY);

        // G
        drawStarPerimeter(points[7].x, points[7].y, midRightVertexX, bottomVertexY);
        drawStarPerimeter(points[7].x, points[7].y, rightVertexX, bottomVertexY);
    }

    for (var j = 0; j < 8; j++) {
        drawPoint(points[j].x, points[j].y);
    }
}

function starPoints(relx, rely) {
    var scaledHeight = height * SCALE;
    var scaledWidth = width * SCALE;
    var scaledLength = length * SCALE;

    return [{x:center_x + relx, y:center_y + rely + scaledHeight + scaledLength}, // F
        {x:center_x-(scaledHeight+scaledWidth)/2-scaledLength-rely, y:center_y+(scaledHeight+scaledWidth)/2+relx}, // E
        {x:center_x-scaledWidth-scaledLength-relx, y:center_y-rely}, //D
        {x:center_x-(scaledHeight+scaledWidth)/2-scaledLength+rely, y:center_y-(scaledHeight+scaledWidth)/2-relx}, // C
        {x:center_x+relx, y:center_y-scaledHeight-scaledLength+rely}, // B
        {x:center_x+(scaledHeight+scaledWidth)/2+scaledLength-rely, y:center_y-(scaledHeight+scaledWidth)/2+relx}, // I
        {x:center_x+scaledWidth+scaledLength-relx, y:center_y-rely}, // H
        {x:center_x+(scaledHeight+scaledWidth)/2+scaledLength+rely, y:center_y+(scaledHeight+scaledWidth)/2-relx}]; // G
}

function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x,y,POINT_RADIUS,0,360);
    ctx.fillStyle = WHITE;
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

function drawVoronoiLines(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = VORONOI_COLOR;
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
    for (var i = 0; i < points.length; i++){
        if ((mousePos.x >= points[i].x - POINT_RADIUS && mousePos.x <= points[i].x + POINT_RADIUS) &&
            (mousePos.y >= points[i].y - POINT_RADIUS && mousePos.y <= points[i].y + POINT_RADIUS)) {
            mouseIsDown = true;
            selectedPointInd = i;
        }
    }
}

function dragMouse(e) {
    var mousePos = getMousePos(canvas, e);
    if (mouseIsDown) {
        // X and Y for Top and bottom points are obvious
        var xsign = 1;
        var ysign = 1;
        var switchXy = false;
        if (selectedPointInd == 3) {
            xsign = -1;
            switchXy = true;
        } else if (selectedPointInd == 5) {
            ysign = -1;
            switchXy = true;
        } else if (selectedPointInd == 6 || selectedPointInd == 2) {
            xsign = -1;
            ysign = -1;
        } else if (selectedPointInd == 1) {
            ysign = -1;
            switchXy = true;
        } else if (selectedPointInd == 7) {
            xsign = -1;
            switchXy = true;
        }

        if (switchXy) {
            sourceY = ysign * (mousePos.x - centerPoints[selectedPointInd].x);
            sourceX = xsign * (mousePos.y - centerPoints[selectedPointInd].y);
        } else {
            sourceX = xsign * (mousePos.x - centerPoints[selectedPointInd].x);
            sourceY = ysign * (mousePos.y - centerPoints[selectedPointInd].y);
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
