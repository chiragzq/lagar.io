var socket;
function initNetwork() {
	socket = io();

	socket.on('init_server', function(server) {
		initDisplay(server); //initial canvas stuff
	});

	socket.on('update_server', function(server) {
		updateDisplay(server);
	});
}
