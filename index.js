	function ServerState() {
	this.pnum = 0; //# of players
	this.players = [];//Plyaers array
	this.width = 1110; //Playing dimenetion
	this.height = 690;
	this.squareNum = 0;
	this.squares = [];
	this.addSquare = function() {
		this.squares.push(new Square(Math.floor(Math.random() * (server.width+1)),
		Math.floor(Math.random() * (server.height+1)),
		15,
		'#'+Math.floor(Math.random()*16777215).toString(16)));
		this.squareNum++;
	};
	this.removeSquare = function(index) {
		this.squares.splice(index,1);
	}
	this.createPlayer = function() {
		var player = new Player(
			Math.floor(Math.random() * (server.width+1)),
			Math.floor(Math.random() * (server.height+1)),
			10,
			'#'+Math.floor(Math.random()*16777215).toString(16)
			, this.pnum++);
		this.players.push(player);
		return player.index;
	};
	this.removePlayer = function(index) {
		for(var i = 0;i < this.players.length;i ++) {
			if(this.players[i].index == index) {
				this.players.splice(i, 1);
				return;
			}
		}
	};
	this.move = function(keys, index) {
		for(var i = 0;i < this.players.length;i ++) {
			if(this.players[i].index == index) {
				if(keys.left) this.players[i].xvel -= 3;
				if(keys.right) this.players[i].xvel += 3;
				if(keys.up) this.players[i].yvel -= 3;
				if(keys.down) this.players[i].yvel += 3;
				return;
			}
		}
	};
	var t = this;
	this.mainLoop = function() {
		var Delete = [];
		for(var i = 0;i < t.players.length;i ++) {
			t.players[i].x += t.players[i].xvel;
			t.players[i].y += t.players[i].yvel
			t.players[i].xvel *= 0.85;
			t.players[i].yvel *= 0.85;
			if(t.players[i].x + t.players[i].size > server.width) {
				t.players[i].x = server.width-t.players[i].size
			}
			if(t.players[i].x - t.players[i].size < 0) {
				t.players[i].x = t.players[i].size;
			}
			if(t.players[i].y + t.players[i].size > server.height) {
				t.players[i].y = server.height-t.players[i].size;
			}
			if(t.players[i].y - t.players[i].size < 0) {
				t.players[i].y = t.players[i].size;
			}
		}
		for(var i = 0;i < t.players.length;i ++) {
		  Delete = [];
			for(var j = 0;j < t.squares.length;j ++) {
				if(collision(t.players[i], t.squares[j])) {
					Delete.push(j);
					t.players[i].size++;
				}
			}
			for(var j = Delete.length-1;j >= 0;j--) {
				t.removeSquare(Delete[j]);
			}
		}
	};
	setInterval(this.mainLoop, 50);
}

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var server = new ServerState();

app.use("/styles", express.static(__dirname+"/styles"));
app.use("/scripts", express.static(__dirname+"/scripts"));
app.use("/img", express.static(__dirname+"/img"));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	//Create a player and add him to the players array
	var playerIndex = server.createPlayer();
	console.log("A user connected. His pnum is " + server.pnum);

	socket.emit('init_player', playerIndex); //Give player initial data
	socket.emit('init_server', server); //Give player server data

	socket.on('disconnect', function() {
		console.log('player ' + playerIndex + " disconnected");
		server.removePlayer(playerIndex);
		clearInterval(int);
		clearInterval(calcSquare);
	});

	socket.on('client_controls', function(keys) {
		server.move(keys, playerIndex);
	});
	var int = setInterval(function() {
		socket.emit('update_server', server);
	}, 20);
	var rate = 6000;
	function calcSquare() {
	  rate = 6000;
		if(server.players.length * 10 < server.squares.length) {
		  rate = 10000;
		}
		if(server.players.length * 15 < server.squares.length) {
			rate = 5000;
		}
	}
	function squareLoop() {
		if(rate == 5000) void(0);
		else server.addSquare();
		spawn = setTimeout(squareLoop,rate);
	}
	setInterval(calcSquare, 100);
	var spawn = setTimeout(squareLoop,6000);
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});

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

function Player(x, y, size, color, index) { //Players object 4 server
	this.x = x;
	this.y = y;
	this.size = size;
	this.color = color;
	this.index = index;
	this.xvel = 0;
	this.yvel = 0;
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
        ctx.lineWidth = 5;
        ctx.strokeStyle = shadeColor(this.color, -0.4);
				ctx.stroke();
        ctx.closePath();
    }
}
