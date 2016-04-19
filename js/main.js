var canvas = document.getElementById("mainCanvas");
canvas.width = $(window).width() - 250;
var ctx = canvas.getContext("2d");

canvas.onmousedown = clickMouse;
canvas.onmouseup = releaseMouse;

var height = 5;
var width = 5;
var length = 5;

var center_x = canvas.width / 2;
var center_y = canvas.height / 2;

var perimeter = 0;

setInterval(draw, 10);

function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    perimeter = 0;

    drawBgRectangles(width, height, length);

    drawSymmetricPointsAndLines(0,0, BLACK);

    document.getElementById("perimeter").innerHTML=perimeter;
}

function resizeWindow() {
    canvas.width = $(window).width() - 250;
    center_x = canvas.width / 2;
}

function drawBgRectangles(w, h, l) {
    var scaledWidth = w * SCALE;
    var scaledLength = l * SCALE;
    var scaledHeight = h * SCALE;

    drawRectangle(center_x - scaledWidth/2,center_y - scaledHeight/2, scaledWidth, scaledHeight, BG_GREEN);

    drawRectangle(center_x - scaledWidth/2,center_y - scaledHeight*3/2 - scaledLength, scaledWidth, scaledHeight, BG_GREEN);
    drawRectangle(center_x - scaledWidth/2,center_y + scaledHeight/2 + scaledLength, scaledWidth, scaledHeight, BG_GREEN);

    drawRectangle(center_x - scaledWidth/2 - scaledLength - scaledHeight,
        center_y - scaledHeight/2 - scaledWidth,
        scaledHeight, scaledWidth, BG_GREEN);
    drawRectangle(center_x - scaledWidth/2 - scaledLength - scaledWidth,
        center_y - scaledHeight/2,
        scaledWidth, scaledHeight, BG_GREEN);
    drawRectangle(center_x - scaledWidth/2 - scaledLength - scaledHeight,
        center_y + scaledHeight/2,
        scaledHeight, scaledWidth, BG_GREEN);

    drawRectangle(center_x + scaledWidth/2 + scaledLength,
        center_y - scaledHeight/2 - scaledWidth,
        scaledHeight, scaledWidth, BG_GREEN);
    drawRectangle(center_x + scaledWidth/2 + scaledLength,
        center_y - scaledHeight/2,
        scaledWidth, scaledHeight, BG_GREEN);
    drawRectangle(center_x + scaledWidth/2 + scaledLength,
        center_y + scaledHeight/2,
        scaledHeight, scaledWidth, BG_GREEN);

    drawRectangle(center_x + scaledWidth/2, center_y - scaledHeight/2, scaledLength, scaledHeight, BG_BLUE);
    drawRectangle(center_x - scaledWidth/2 - scaledLength, center_y - scaledHeight/2, scaledLength, scaledHeight, BG_BLUE);

    drawRectangle(center_x - scaledWidth/2 - scaledLength, center_y - scaledHeight/2 - scaledWidth, scaledLength, scaledWidth, BG_RED);
    drawRectangle(center_x - scaledWidth/2, center_y - scaledHeight/2 - scaledLength, scaledWidth, scaledLength, BG_RED);
    drawRectangle(center_x + scaledWidth/2, center_y - scaledHeight/2 - scaledWidth, scaledLength, scaledWidth, BG_RED);
    drawRectangle(center_x - scaledWidth/2 - scaledLength, center_y + scaledHeight/2, scaledLength, scaledWidth, BG_RED);
    drawRectangle(center_x - scaledWidth/2, center_y + scaledHeight/2, scaledWidth, scaledLength, BG_RED);
    drawRectangle(center_x + scaledWidth/2, center_y + scaledHeight/2, scaledLength, scaledWidth, BG_RED);
}

function drawSymmetricPointsAndLines(relx, rely, lineColor) {
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

    var points = [{x:center_x + relx, y:center_y + rely + scaledHeight + scaledLength}, // F
        {x:center_x-(scaledHeight+scaledWidth)/2-scaledLength-rely, y:center_y+(scaledHeight+scaledWidth)/2+relx}, // E
        {x:center_x-scaledWidth-scaledLength-relx, y:center_y+rely}, //D
        {x:center_x-(scaledHeight+scaledWidth)/2-scaledLength+rely, y:center_y-(scaledHeight+scaledWidth)/2-relx}, // C
        {x:center_x+relx, y:center_y-scaledHeight-scaledLength+rely}, // B
        {x:center_x+(scaledHeight+scaledWidth)/2+scaledLength-rely, y:center_y-(scaledHeight+scaledWidth)/2+relx}, // I
        {x:center_x+scaledWidth+scaledLength-relx, y:center_y-rely}, // H
        {x:center_x+(scaledHeight+scaledWidth)/2+scaledLength+rely, y:center_y+(scaledHeight+scaledWidth)/2-relx}]; // G

    var voronoi = new Voronoi();
    var bbox = {xl: -10, xr: canvas.width + 10, yt: -10, yb: canvas.height + 10};
    var diagram = voronoi.compute(points, bbox);

    for (var i = 0; i < diagram.edges.length; i++) {
        var edge = diagram.edges[i];
        drawVoronoiLines(edge.va.x, edge.va.y, edge.vb.x, edge.vb.y);
    }

    fadeOutside(points,
        [{x: midLeftVertexX, y: bottomVertexY},
        {x: leftVertexX, y: bottomVertexY},
        {x: leftVertexX, y: topVertexY},
        {x: midLeftVertexX, y: topVertexY},
        {x: midRightVertexX, y: topVertexY},
        {x: rightVertexX, y: topVertexY},
        {x: rightVertexX, y: bottomVertexY},
        {x: midRightVertexX, y: bottomVertexY}]);

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


    for (var j = 0; j < 8; j++) {
        drawPoint(points[j].x, points[j].y);
    }
}

function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x,y,POINT_RADIUS,0,360);
    ctx.fillStyle = BRIGHT_RED;
    ctx.fill();
    ctx.closePath();
}

function drawStarPerimeter(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = BLACK;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1,2));
    perimeter += distance / SCALE;
}

function drawVoronoiLines(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = BRIGHT_PINK;
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

function fadeOutside(convexVertices, concaveVertices) {
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

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fill();
}

function clickMouse(e) {

}

function releaseMouse(e) {

}

//////////////////////////////////////////////////////////////
// Sliders                                                  //
//////////////////////////////////////////////////////////////

$(function() {
    $("#height" ).slider({
        value: 5,
        orientation: "horizontal",
        range: "min",
        min: 1,
        max: 10,
        animate: true,
        step: 0.1,
        slide: function (event, ui) {
            $("#heightAmount" ).val(ui.value);
            height = ui.value;
        }
    });
    $( "#heightAmount" ).val( $( "#height" ).slider( "value" ) );
});

$(function() {
    $("#width" ).slider({
        value: 5,
        orientation: "horizontal",
        range: "min",
        min: 1,
        max: 10,
        step: 0.1,
        animate: true,
        slide: function (event, ui) {
            $("#widthAmount" ).val(ui.value);
            width = ui.value;
        }
    });
    $( "#widthAmount" ).val( $( "#width" ).slider( "value" ) );
});

$(function() {
    $("#length" ).slider({
        value: 5,
        orientation: "horizontal",
        range: "min",
        min: 1,
        max: 10,
        step: 0.1,
        animate: true,
        slide: function (event, ui) {
            $("#lengthAmount" ).val(ui.value);
            length = ui.value;
        }
    });
    $( "#lengthAmount" ).val( $( "#length" ).slider( "value" ) );
});