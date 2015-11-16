//var socket = io();
//var name = "PI LOVER";
var canvas = document.getElementById("canvas");
var width = 1270;
var height = 750;
//width = window.innerWidth - 10;
//anvas.height = window.innerHeight - 33;

var ctx = canvas.getContext("2d");
var keys = [];
var circle = new Circle(width /2, height / 2, 5, "#00ff00");
var circle2 = new Circle(width/3, height/3, 5, "#00ffaa");
var squares = [];
var rate = 3000;

for (var i = 0; i < 222; i++) {
    keys.push(false);
}
for (var i = 0;i <= 10;i ++) {
	squares.push(new Square(Math.floor(Math.random() * (width + 1)), Math.floor(Math.random() * (width + 1)), 10, '#' + Math.floor(Math.random() * 16777215).toString(16)));
}

function Circle(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.xvel = 0;
    this.yvel = 0;
    this.score = 0;
    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = shadeColor(this.color, -0.4);
        ctx.stroke();
        ctx.closePath();
    }
}

function Square(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.draw = function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = shadeColor(this.color, -0.4);
        ctx.stroke();
        ctx.closePath();
    }
}

function shadeColor(color, percent) {
    var f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

function draw() {
    var freq = 30;
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i <= width; i = i + freq) {
        ctx.fillStyle = "#808080";
        ctx.fillRect(i, 0, 1, height);
    }
    for (var i = 0; i <= height; i = i + freq) {
        ctx.fillStyle = "#808080";
        ctx.fillRect(0, i, width, 1);
    }
    circle.draw();
    circle2.draw();
    for (var i = 0; i < squares.length; i++) {
        squares[i].draw();
    }
}

function move() {
    circle.xvel *= 0.85;
    circle.yvel *= 0.85;
    circle2.xvel *= 0.85;
    circle2.yvel *= 0.85;
    if (keys[37]) circle.xvel -= accel;
    if (keys[39]) circle.xvel += accel;
    if (keys[38]) circle.yvel -= accel;
    if (keys[40]) circle.yvel += accel;
    if(keys[87]) circle2.yvel += accel;
    if(keys[83]) circle2.yvel -= accel;
    if(keys[68]) circle2.xvel += accel;
    if(keys[65]) circle2.xvel -= accel;
    circle.x += xvel;
    circle.y += yvel;
    circle2.x += xvel;
    circle2.y += yvel;
    if (circle.x < 0) {circle.x = width/2; circle.score--;}
    if (circle.x > width) {circle.x = width/2; circle.score--;}
    if (circle.y < 0) {circle.y = height/2; circle.score--;}
    if (circle.y > height) {circle.y = height/2;circle.score--;}
    if (circle2.x < 0) {circle2.x = width/2; circle2.score--;}
    if (circle2.x > width) {circle2.x = width/2; circle2.score--;}
    if (circle2.y < 0) {circle2.y = height/2; circle2.score--;}
    if (circle2.y > height) {circle2.y = height/2;circle2.score--;}
}

function detect() {
    var del = [];
    for (var i = 0; i < squares.length; i++) {
        if (collision(circle, squares[i])) del.push(i);
    }
    for (var i = 0; i < del.length; i++) {
        squares.splice(del[i], 1);
        circle.size += 1;
        cicle.score += 1;
    }
}

function loop() {
    detect();
    move();
    draw();
    document.getElementById("score").innerHTML = "Score: " + circle.score;
}

function spawn() {
    squares.push(new Square(Math.floor(Math.random() * (width + 1)), 
    						Math.floor(Math.random() * (width + 1)), 
    						10, 
    						'#' + Math.floor(Math.random() * 16777215).toString(16)));
    if (Math.random() > 0.5) {
        clearTimeout(time);
        rate = 3000 * (squares.length + 50)/50;
        time = setTimeout(spawn, rate);
    } else time = setTimeout(spawn, rate);
}

function shrink() {
	clearTimeout(swink);
	circle.size -= 5;
	swink = setTimeout(shrink, 20000);

}
function keyUp(e) {
    var key = e.keyCode;
    keys[key] = false;
}

function keyDetect(e) {
    var key = e.keyCode;
    keys[key] = true;
}
setInterval(loop, 28);
var time = setTimeout(spawn, rate);
var swink = setTimeout(shrink, 20000)
document.addEventListener("keydown", keyDetect);
document.addEventListener("keyup", keyUp);
/*



*/

//socket.emit('chat message', name + ": " + $("#m").val());
//socket.on('chat message', function(msg){
//	$('#messages').append($('<li>').text(msg));
//});