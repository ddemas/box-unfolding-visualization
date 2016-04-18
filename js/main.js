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

    var scaledWidth = width * SCALE;
    var scaledLength = length * SCALE;
    var scaledHeight = height * SCALE;

    // B(x, y+a+c)
    // C(-b-c+y, (a+b)/2+x)
    // D(-b-c-x, y)
    // E(-(a+b)/2-c+y, -(a+b)/2-x)
    // F(x, -a-c+y)
    // G((a+b)/2+c-y, -(a+b)/2+x)
    // H(a+c-x, -y)
    // I((a+b)/2+c+y, (a+b)/2-x)

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

    drawSymmetricPointsAndLines(0,0, BLACK);

    document.getElementById("perimeter").innerHTML=perimeter;
}

function resizeWindow() {
    canvas.width = $(window).width() - 250;
    center_x = canvas.width / 2;
}

function drawRectangle(x, y, width, height, color) {
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.fillStyle = color;
    ctx.strokeStyle = GRAY;
    ctx.stroke();
	ctx.fill();
	ctx.closePath();
}

function drawSymmetricPointsAndLines(x, y, lineColor) {
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

    // Apologies for the bad variable names
    var leftVertexX = center_x - scaledWidth/2 - scaledLength;
    var midLeftVertexX = center_x - scaledWidth/2;
    var midRightVertexX = center_x + scaledWidth/2;
    var rightVertexX = center_x + scaledWidth/2 + scaledLength;
    var topVertexY = center_y - scaledHeight/2;
    var bottomVertexY = center_y + scaledHeight/2;

    // F
    drawLine(center_x + x, center_y + y + scaledHeight + scaledLength,
        midLeftVertexX, bottomVertexY, lineColor);
    drawLine(center_x + x, center_y + y + scaledHeight + scaledLength,
        midRightVertexX, bottomVertexY, lineColor);
    drawPoint(center_x + x, center_y + y + scaledHeight + scaledLength);

    // E
    drawLine(center_x-(scaledHeight+scaledWidth)/2-scaledLength-y, center_y+(scaledHeight+scaledWidth)/2+x,
        leftVertexX, bottomVertexY, lineColor);
    drawLine(center_x-(scaledHeight+scaledWidth)/2-scaledLength-y, center_y+(scaledHeight+scaledWidth)/2+x,
        midLeftVertexX, bottomVertexY, lineColor);
    drawPoint(center_x-(scaledHeight+scaledWidth)/2-scaledLength-y, center_y+(scaledHeight+scaledWidth)/2+x);

    // D
    drawLine(center_x-scaledWidth-scaledLength-x, center_y+y,
        leftVertexX, topVertexY, lineColor);
    drawLine(center_x-scaledWidth-scaledLength-x, center_y+y,
        leftVertexX, bottomVertexY, lineColor);
    drawPoint(center_x-scaledWidth-scaledLength-x, center_y+y);

    // C
    drawLine(center_x-(scaledHeight+scaledWidth)/2-scaledLength+y, center_y-(scaledHeight+scaledWidth)/2-x,
        leftVertexX, topVertexY, lineColor);
    drawLine(center_x-(scaledHeight+scaledWidth)/2-scaledLength+y, center_y-(scaledHeight+scaledWidth)/2-x,
        midLeftVertexX, topVertexY, lineColor);
    drawPoint(center_x-(scaledHeight+scaledWidth)/2-scaledLength+y, center_y-(scaledHeight+scaledWidth)/2-x);

    // B
    drawLine(center_x+x, center_y-scaledHeight-scaledLength+y,
        midLeftVertexX, topVertexY, lineColor);
    drawLine(center_x+x, center_y-scaledHeight-scaledLength+y,
        midRightVertexX, topVertexY, lineColor);
    drawPoint(center_x+x, center_y-scaledHeight-scaledLength+y);

    // I
    drawLine(center_x+(scaledHeight+scaledWidth)/2+scaledLength-y, center_y-(scaledHeight+scaledWidth)/2+x,
        midRightVertexX, topVertexY, lineColor);
    drawLine(center_x+(scaledHeight+scaledWidth)/2+scaledLength-y, center_y-(scaledHeight+scaledWidth)/2+x,
        rightVertexX, topVertexY, lineColor);
    drawPoint(center_x+(scaledHeight+scaledWidth)/2+scaledLength-y, center_y-(scaledHeight+scaledWidth)/2+x);

    // H
    drawLine(center_x+scaledWidth+scaledLength-x, center_y-y,
        rightVertexX, topVertexY, lineColor);
    drawLine(center_x+scaledWidth+scaledLength-x, center_y-y,
        rightVertexX, bottomVertexY, lineColor);
    drawPoint(center_x+scaledWidth+scaledLength-x, center_y-y);

    // G
    drawLine(center_x+(scaledHeight+scaledWidth)/2+scaledLength+y, center_y+(scaledHeight+scaledWidth)/2-x,
        midRightVertexX, bottomVertexY, lineColor);
    drawLine(center_x+(scaledHeight+scaledWidth)/2+scaledLength+y, center_y+(scaledHeight+scaledWidth)/2-x,
        rightVertexX, bottomVertexY, lineColor);
    drawPoint(center_x+(scaledHeight+scaledWidth)/2+scaledLength+y, center_y+(scaledHeight+scaledWidth)/2-x);
}

function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x,y,POINT_RADIUS,0,360);
    ctx.fillStyle = BRIGHT_RED;
    ctx.fill();
    ctx.closePath();
}

function drawLine(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.stroke();

    var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1,2));
    perimeter += distance / SCALE;
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
        animate: true,
        slide: function (event, ui) {
            $("#lengthAmount" ).val(ui.value);
            length = ui.value;
        }
    });
    $( "#lengthAmount" ).val( $( "#length" ).slider( "value" ) );
});