function ServerState() {
	this.pnum = 0; //# of players
	this.players = [];//Plyaers array
	this.worldWidth = 600; //Playing dimenetion
	this.worldHeight = 600;
	this.createPlayer = function() {
		var player = new Player(
			Math.floor(Math.random() * 601),
			Math.floor(Math.random() * 601),
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
				if(keys.left) this.players[i].x -= 10;
				if(keys.right) this.players[i].x += 10;
				if(keys.up) this.players[i].y -= 10;
				if(keys.down) this.players[i].y += 10;
				return;
			}
		}
	}
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
	});

	socket.on('client_controls', function(keys) {
		server.move(keys, playerIndex);
	});
	var int = setInterval(function() {
		socket.emit('update_server', server);
	}, 500);
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});

function Player(x, y, size, color, index) { //Players object 4 server
	this.x = x;
	this.y = y;
	this.size = size;
	this.color = color;
	this.index = index;
}
