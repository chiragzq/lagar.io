//var socket = io();
//var name = "PI LOVER";
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 33;

var score = 0;
var ctx = canvas.getContext("2d");
var xvel = 0;
var yvel = 0;
var recentKey = 0;
var key = 0;
var accel = 1.8;
var keys = [];
var circle = new Circle(canvas.width /2, canvas.height / 2, 5, "#00ff00");
var squares = [];
var rate = 3000;
var trash = 0;

for (var i = 0; i < 222; i++) {
    keys.push(false);
}
for (var i = 0;i <= 10;i ++) {
	squares.push(new Square(Math.floor(Math.random() * (canvas.width + 1)), Math.floor(Math.random() * (canvas.width + 1)), 10, '#' + Math.floor(Math.random() * 16777215).toString(16)));
}

function Circle(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
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

function collision(circle, rect) {
    var distX = Math.abs(circle.x - rect.x - rect.size / 2);
    var distY = Math.abs(circle.y - rect.y - rect.size / 2);
    if (distX > (rect.size / 2 + circle.size)) return false;
    if (distY > (rect.size / 2 + circle.size)) return false;
    if (distX <= (rect.size / 2)) return true;
    if (distY <= (rect.size / 2)) return true;
    var dx = distX - rect.size / 2;
    var dy = distY - rect.size / 2;
    return (dx * dx + dy * dy <= (circle.size * circle.size));
}

function draw() {
    var freq = 30;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i <= canvas.width; i = i + freq) {
        ctx.fillStyle = "#808080";
        ctx.fillRect(i, 0, 1, canvas.height);
    }
    for (var i = 0; i <= canvas.height; i = i + freq) {
        ctx.fillStyle = "#808080";
        ctx.fillRect(0, i, canvas.width, 1);
    }
    circle.draw();
    for (var i = 0; i < squares.length; i++) {
        squares[i].draw();
    }
}

function move() {
    xvel *= 0.85;
    yvel *= 0.85;
    if (keys[37]) xvel -= accel;
    if (keys[39]) xvel += accel;
    if (keys[38]) yvel -= accel;
    if (keys[40]) yvel += accel;
    circle.x += xvel;
    circle.y += yvel;
    if (circle.x < 0) {circle.x = canvas.width/2; score--;}
    if (circle.x > canvas.width) {circle.x = canvas.width/2; score--;}
    if (circle.y < 0) {circle.y = canvas.height/2; score--;}
    if (circle.y > canvas.height) {circle.y = canvas.height/2;score--;}
}

function detect() {
    var del = [];
    for (var i = 0; i < squares.length; i++) {
        if (collision(circle, squares[i])) del.push(i);
    }
    for (var i = 0; i < del.length; i++) {
        squares.splice(del[i], 1);
        circle.size += 1;
        score += 1;
    }
}

function loop() {
    detect();
    move();
    draw();
    document.getElementById("score").innerHTML = "Score: " + score;
}

function spawn() {
    squares.push(new Square(Math.floor(Math.random() * (canvas.width + 1)), Math.floor(Math.random() * (canvas.width + 1)), 10, '#' + Math.floor(Math.random() * 16777215).toString(16)));
    if (Math.random() > 0.5) {
        clearTimeout(time);
        rate = 3000 * (squares.length + 50)/50;
        time = setTimeout(spawn, rate);
    } else time = setTimeout(spawn, rate);
}

function shrink() {
	clearTimeout(swink);
	circle.size -= 5;
	shwink = setTimeout(shrink, 20000);

}
function keyUp(e) {
    key = e.keyCode;
    keys[key] = false;
}

function keyDetect(e) {
    key = e.keyCode;
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