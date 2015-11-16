var socket = io();

socket.on('game_state', function(state) {
	console.log(state);
})