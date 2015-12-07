initNetwork();
initControls();

setInterval(function(){
  draw(serverState);
  handleControls();
}, 50);
