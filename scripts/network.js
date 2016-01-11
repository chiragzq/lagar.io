var socket;
function initNetwork() {
	socket = io();

	socket.on('init_server', function(server) {
		initDisplay(server); //initial canvas stuff
		console.log(server);
	});

	socket.on('update_server', function(server) {
		updateDisplay(server);
	});

}
