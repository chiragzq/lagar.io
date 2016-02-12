var ctx = document.getElementById("canvas").getContext("2d");
var serverState = {};
var scrollX = 0;
var scrollY = 0;
var scale = 0;
var clientwidth = 0;
var clientheight = 0;

function initDisplay(server) { //initial canvas stuff
	var w = window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
	var h = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
	document.getElementById("canvas").width = w;
	document.getElementById("canvas").height= h;
	clientwidth = w;
	clientheight = h;
	serverState = server;
}

function updateDisplay(server) {
	var player = myPlayer(server);
	serverState = server;
	scrollX = canvas.width/2 - player.x;
	scrollY = canvas.height/2 - player.y;
}

function Circle(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = shadeColor(this.color, -0.4);
        ctx.stroke();
        ctx.closePath();
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

function grid(server) {
	var freq = 45;
	var player = myPlayer(server);
	var xstart = player.x % 45;
	var ystart = player.y % 45;
    for (var i = 45 - xstart; i <= server.width; i = i + freq) {
        ctx.fillStyle = "#808080";
        ctx.fillRect(i, 0, 1, server.height);
    }
    for (var i = 45 - ystart; i <= server.height; i = i + freq) {
        ctx.fillStyle = "#808080";
        ctx.fillRect(0, i, server.width, 1);
    }
}

function shadeColor(color, percent) {
    var f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

function playerRender(server) {
	var circle = 0;
	for(var i = 0;i < server.players.length;i ++) {
		circle = new Circle(
			server.players[i].x,
			server.players[i].y,
			server.players[i].size,
			server.players[i].color);
		circle.draw();
	}
}

function squareRender(server) {
	var square = 0;
	for(var i = 0; i < server.squares.length;i ++) {
		square = new Square(
			server.squares[i].x,
			server.squares[i].y,
			15,
			server.squares[i].color);
		square.draw();
	}
}

function update(server) {

}

function draw(server) { //MAIN drawing loop heoit
	ctx.clearRect(0, 0, clientwidth, clientheight);
	grid(server);
	ctx.save();
	ctx.translate(scrollX, scrollY);
  playerRender(server);
	squareRender(server);
	ctx.restore();
}
window.addEventListener("resize", function() {
	var w = window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
	var h = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
	document.getElementById("canvas").width = w;
	document.getElementById("canvas").height= h;
	clientheight = h;
	clientwidth = w;
}, false);
