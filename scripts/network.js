function initNetwork() {
	var socket = io();
	socket.on('init_player', function(player) {
		console.log(player); //print player data
	});

	socket.on('init_server', function(server) {
		console.log(server); //print server data
		initDisplay(server); //initial canvas stuff
	});
}
