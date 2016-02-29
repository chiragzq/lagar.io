var socket;
var player_index;
function initNetwork() {
	socket = io();

	socket.on('init_server', function(server) {
		initDisplay(server); //initial canvas stuff
		console.log(server);
	});

	socket.on('update_server', function(server) {
		updateDisplay(server);
	});
	socket.on('init_player', function(pnum) {
		player_index = pnum;
		socket.emit('set_name', document.getElementById("name").value);
	});
}

function myPlayer(server) {
	return getPlayerByIndex(server,player_index);
}

function getPlayerByIndex(server, index) {
	for(var i = 0;i < server.players.length;i ++) {
		if(server.players[i].index == index) {
			return server.players[i];
		}
	}
}
