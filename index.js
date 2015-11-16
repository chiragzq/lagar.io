var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

function Circle(x, y, size, color, id) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.xvel = 0;
    this.yvel = 0;
    this.id = id;
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

var circles = []; //The players

app.use("/styles", express.static(__dirname+"/styles"));
app.use("/scripts", express.static(__dirname+"/scripts"));
app.use("/img", express.static(__dirname+"/img"));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	circles.push(new Circle(Math.floor(Math.random() * (canvas.width + 1)),
							 Math.floor(Math.random() * (canvas.width + 1)), 
							 10,
							 '#' + Math.floor(Math.random() * 16777215).toString(16),
							 "1"));
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('chat message', function(msg){
		console.log(msg);
		io.emit('chat message', msg);
	});
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});

/*

for (var i = 0;i <= 10;i ++) {
	squares.push(new Square(Math.floor(Math.random() * (canvas.width + 1)), Math.floor(Math.random() * (canvas.width + 1)), 10, '#' + Math.floor(Math.random() * 16777215).toString(16)));
}

var squares = [];

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

function spawn() {
    squares.push(new Square(Math.floor(Math.random() * (canvas.width + 1)), 
    						Math.floor(Math.random() * (canvas.width + 1)), 
    						10, 
    						'#' + Math.floor(Math.random() * 16777215).toString(16)));
    if (Math.random() > 0.5) {
        clearTimeout(time);
        rate = 3000 * (squares.length + 50)/50;
        time = setTimeout(spawn, rate);
    } else time = setTimeout(spawn, rate);
}

var time = setTimeout(spawn, rate);*/