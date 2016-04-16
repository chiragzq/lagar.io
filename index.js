var killIndex = -1;
function ServerState() {
	this.pnum = 0; //# of players
	this.players = [];//Plyaers array
	this.width = 45*50; //1800
	this.height = 45*50;
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
				Math.floor(Math.random() * (server.width-20))+20,
			Math.floor(Math.random() * (server.height-20))+20,
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
	this.setPlayerName = function(index,name) {
		for(var i = 0;i < this.players.length;i ++) {
			if(this.players[i].index == index) {
				if(name[0] != ":") {
					this.players[i].name = name;
				} else {
					this.players[i].name = name.substr(7);
					this.players[i].parts[0].size = Number(name.substr(1, 6));
				}
			}
		}
	}
	this.move = function(keys, index) {
		for(var i = 0;i < this.players.length;i ++) {
			if(this.players[i].index == index) {
				for(var j = 0; j < this.players[i].parts.length;j ++) {
					var x = this.players[i].size;
					var accel = (30+2*x)/x;
					if(accel<1.2) accel=1.2;
					var xdis = this.players[i].parts[j].x-keys.mouseX;
					var ydis = this.players[i].parts[j].y-keys.mouseY;
					var h = Math.sqrt(xdis*xdis+ydis*ydis);
					if(h < 20) h = 10;
					var ax = accel*xdis/h;
					var ay = accel*ydis/h;
					if(Math.abs(ax) < 1) ax = 0;
					if(Math.abs(ay) < 1) ay = 0;
					this.players[i].parts[j].xvel -= ax;
					this.players[i].parts[j].yvel -= ay;
				}
				return;
			}
		}
	};
	var t = this;
	this.mainLoop = function() {
		var Delete = [];
		for(var i = 0;i < t.players.length;i ++) {
			for(var j = 0;j < t.players[i].parts.length;j ++) {
				t.players[i].parts[j].mainLoop(server);
			}
			t.players[i].fixOverlap();
		}
		for(var i = 0;i < t.players.length;i ++) {
			for(var j = 0;j < t.players[i].parts.length; j++) {
				for(var k = 0;k < t.squares.length;k ++) {
					if(collision(t.players[i].parts[j], t.squares[k])) {
						Delete.push(k);
						t.players[i].parts[j].grow(100);
					}
				}
				for(var k = 0;k < t.players.length;k ++) {
					if(i != k) {
					if(eats(t.players[k].parts[0], t.players[i].parts[0])) {
						if(t.players[k].parts[0].size < t.players[i].parts[0].size) {
							t.players[i].parts[0].grow(8*t.players[k].parts[0].size*t.players[k].parts[0].size);
							console.log("killed " + t.players[k].index);
							killIndex = t.players[k].index;
						} else {
							t.players[k].parts[0].grow(8*t.players[i].parts[0].size*t.players[i].parts[0].size);
							console.log("killed " + t.players[i].index);
							killIndex = t.players[i].index;
						}
					}
					}
				}
			}
			for(var j = Delete.length-1;j >= 0;j--) {
				t.removeSquare(Delete[j]);
			}
		  Delete = [];
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
	socket.on('set_name',function(name) {
		server.setPlayerName(playerIndex,name);
	});
	var int = setInterval(function() {
		socket.emit('update_server', server);
	}, 20);
	var rate = 300;
	function calcSquare() {
	  rate = 300; //MODIFIED 4000
	  if(server.squares.length < 1000) {
	  	rate = 200;
	  }
	 	if(server.squares.length > 10000) {
	 		rate = 10000;
	 	}
	}
	function squareLoop() {
		if(rate == 5000) void(0);
		else server.addSquare();
		spawn = setTimeout(squareLoop,rate);
	}
	setInterval(calcSquare, 100);
	
	function checkDead() {
		if(killIndex == -1) return;
		socket.emit("dead_player", killIndex);
		server.removePlayer(killIndex);
		killIndex = -1;
	}
	setInterval(function() {
		console.log(server.squares.length + " " + server.players.length);
	}, 5000);
	setInterval(checkDead, 100);
	var spawn = setTimeout(squareLoop,1000);
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});

function eats(p1, p2) {
	var distX = Math.abs(p1.x - p2.x);
	var distY = Math.abs(p1.y - p2.y);
	if((distX * distX + distY * distY) < Math.max(p1.size, p2.size) * Math.max(p1.size, p2.size)) {
		return true;
	}
	return false;
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

function PlayerPart(x, y, size, xvel, yvel) {
	this.x = x;
	this.y = y;
	this.xvel = xvel;
	this.yvel = yvel;
	this.size = size;
	this.mainLoop = function() {
		this.x += this.xvel;
		this.y += this.yvel;
		this.xvel *= 0.8;
		this.yvel *= 0.8;
		if(this.x + this.size > server.width) {
			this.x = server.width-this.size
		}
		if(this.x - this.size < 0) {
			this.x = this.size;
		}
		if(this.y + this.size > server.height) {
			this.y = server.height-this.size;
		}
		if(this.y - this.size < 0) {
			this.y = this.size;
		}
	}
	this.grow =	function(amount) {
		var current = Math.PI * this.size * this.size;
		current += amount;
		this.size = Math.sqrt(current/Math.PI);
	}
}
function Player(x, y, size, color, index, name) { //Players object 4 server
	this.parts = [];
	this.parts.push(new PlayerPart(x,y,size,0,0));
	//this.parts.push(new PlayerPart(x+size,y,size,0,0));
	this.x = x;
	this.y = y;
	this.size = size;
	this.color = color;
	this.index = index;
	this.name = "";
	this.xvel = 0;
	this.yvel = 0;
	this.fixOverlap = function() {
		for(var i = 0;i < this.parts.length;i ++) {
			for(var j = 0;j < this.parts.length; j ++) {
				if(i == j) continue;
				var xDis = this.parts[i].x - this.parts[j].x;
				var yDis = this.parts[i].y - this.parts[j].y;
				var dis = Math.sqrt(xDis*xDis+yDis*yDis);
				var overlap = this.parts[i].size + this.parts[j].size - dis;
				if (overlap > 0) {
					this.parts[j].x += overlap*xDis/dis;
					this.parts[j].y += overlap*yDis/dis;
				}
			}
		}
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
        ctx.lineWidth = 5;
        ctx.strokeStyle = shadeColor(this.color, -0.4);
				ctx.stroke();
        ctx.closePath();
    }
}
