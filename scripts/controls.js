var keys = [];
/*
w=87
a=65
s=83
d=68
*/
function initControls() {
  for (var i = 0; i < 222; i++) {
    keys.push(false);
  }
}

function keyUp(e) {
  key = e.keyCode;
  keys[key] = false;
}

function keyDetect(e) {
  key = e.keyCode;
  keys[key] = true;
}

document.addEventListener("keydown", keyDetect);
document.addEventListener("keyup", keyUp);

function handleControls() {
  socket.emit('client_controls', {
    left: keys[37],
    right: keys[39],
    up: keys[38],
    down: keys[40],
  });
}
