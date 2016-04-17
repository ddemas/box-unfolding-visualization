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

setInterval(draw, 10);

function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);

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

    drawSymmetricPoints(-30,10);
}

function resizeWindow() {
    canvas.width = $(window).width() - 250;
    center_x = canvas.width / 2;
}

function drawRectangle(x, y, width, height, color) {
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.fillStyle = color;
    ctx.strokeStyle = BLACK;
    ctx.stroke();
	ctx.fill();
	ctx.closePath();
}

function drawSymmetricPoints(x, y) {
    // B(x, y+a+c)
    // C(-b-c+y, (a+b)/2+x)
    // D(-b-c-x, y)
    // E(-(a+b)/2-c+y, -(a+b)/2-x)
    // F(x, -a-c+y)
    // G((a+b)/2+c-y, -(a+b)/2+x)
    // H(b+c-x, -y)
    // I((a+b)/2+c+y, (a+b)/2-x)
    var a = height * SCALE;
    var b = width * SCALE;
    var c = length * SCALE;

    drawPoint(center_x + x, center_y + y + a + c);
    drawPoint(center_x-b-c+y, center_y+(a+b)/2+x);
    drawPoint(center_x-b-c-x, center_y+y);
    drawPoint(center_x-(a+b)/2-c+y, center_y-(a+b)/2-x);
    drawPoint(center_x+x, center_y-a-c+y);
    drawPoint(center_x+(a+b)/2+c-y, center_y-(a+b)/2+x);
    drawPoint(center_x+b+c-x, center_y-y);
    drawPoint(center_x+(a+b)/2+c+y, center_y+(a+b)/2-x);
}

function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x,y,POINT_RADIUS,0,360);
    ctx.fillStyle = BRIGHT_RED;
    ctx.fill()
    ctx.closePath();
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
        step: 1,
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
        step: 1,
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
        step: 1,
        slide: function (event, ui) {
            $("#lengthAmount" ).val(ui.value);
            length = ui.value;
        }
    });
    $( "#lengthAmount" ).val( $( "#length" ).slider( "value" ) );
});