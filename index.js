var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

app.use("/styles", express.static(__dirname+"/styles"));
app.use("/scripts", express.static(__dirname+"/scripts"));
app.use("/img", express.static(__dirname+"/img"));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log("A user connected.");
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('control', function(control) {
		console.log(control);
	});
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});