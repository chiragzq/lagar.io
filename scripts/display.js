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

function Circle(x, y, size, color, name) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
		this.name = name;
    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = shadeColor(this.color, -0.4);
        ctx.stroke();
        ctx.closePath();
				ctx.font="normal normal 900 12px Arial";
				ctx.fillStyle="white";
				ctx.strokeStyle="black";
				ctx.lineWidth="1";
				var shortSize = Math.floor(size);
				var ratio = ctx.measureText(shortSize).width/12;
				ctx.font="normal normal 900 " + (ratio*(this.size/1.2)) + "px Arial";
				if(shortSize.toString().length >= 3) {
					ctx.font="normal normal 900 " + (ratio*(this.size/2)) + "px Arial";
				}
				ctx.fillText(shortSize,
				this.x-(ctx.measureText(shortSize).width/2),
				this.y+this.size/1.5);
				ctx.strokeText(shortSize,
				this.x-(ctx.measureText(shortSize).width/2),
				this.y+this.size/1.5);

				shortSize = name;
				ratio = ctx.measureText(shortSize).width/14;
				ctx.font="normal normal 900 " + (ratio*(this.size/(shortSize.length*(this.size/15)))) + "px Arial";
				ctx.fillText(shortSize,
				this.x-(ctx.measureText(shortSize).width/2),
				this.y-this.size/2.4);
				ctx.strokeText(shortSize,
				this.x-(ctx.measureText(shortSize).width/2),
				this.y-this.size/2.4);
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
	var xbounds = clientwidth/2;
	var ybounds = clientheight/2;
    for (var i = -Math.floor(xbounds/45)*45-1; i <= server.width+xbounds; i = i + freq) {
				if(i < player.x-clientwidth/2 || i > player.x+clientwidth/2)continue;
        ctx.fillStyle = "#808080";
        ctx.fillRect(i, player.y-clientheight/2, 1, clientheight);
    }
    for (var i = -Math.floor(ybounds/45)*45-1; i <= server.height+ybounds; i = i + freq) {
				if(i < player.y-clientheight/2 || i > player.y+clientheight/2)continue;
        ctx.fillStyle = "#808080";
        ctx.fillRect(player.x-clientwidth/2, i, clientwidth, 1);
    }
		ctx.fillStyle="red";
		ctx.fillRect(0,0,5,server.height);
		ctx.fillRect(0,0,server.width+5,5);
		ctx.fillRect(server.width,0,5,server.height);
		ctx.fillRect(0,server.height,server.width+5,5);
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
			server.players[i].color,
			server.players[i].name);
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
	ctx.save();
	ctx.translate(scrollX, scrollY);
	grid(server);
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
