var socket;
var player_index;
var intx;
var inty;
function initNetwork() {
	socket = io();

	socket.on('init_server', function(server) {
		initDisplay(server); //initial canvas stuff
		console.log(server);
		console.log(server.players[0].parts[0]);
	});

	socket.on('update_server', function(server) {
		updateDisplay(server);
	});
	socket.on('init_player', function(pnum) {
		player_index = pnum;
		var mane = document.getElementById("name").value;
		if (mane == "") mane="troll";
		socket.emit('set_name', mane);
	});
	
	socket.on('dead_player', function(pnum) {
		console.log("dead: " + pnum);
		if(pnum == player_index) {
			setInterval(function () {
				document.getElementById("canvas").style.display = "none";
				document.getElementById("lost").style.display = "block";
			}, 100);
			clearInterval(intx);
			clearInterval(inty);
			socket.disconnect();
		}
	});
}

function myPlayer(server) {
	var player = getPlayerByIndex(server,player_index);
	player.x = player.parts[0].x;
	player.y = player.parts[0].y;
	return player;
}

function getPlayerByIndex(server, index) {
	for(var i = 0;i < server.players.length;i ++) {
		if(server.players[i].index == index) {
			return server.players[i];
		}
	}
}
