initNetwork();
initControls();

setInterval(function() {

})
setInterval(function(){
  draw(serverState);
}, 50);

setInterval(function(){
  handleControls();
}, 50);
