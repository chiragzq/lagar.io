function startGame() {
  initNetwork();
  initControls();
  intx = setInterval(function(){
    draw(serverState);
  }, 50);
  inty = setInterval(function(){
    handleControls();
  }, 50);
  document.getElementById("loginBox").style.display="none";
}
document.getElementById("gameStart").addEventListener('click',startGame);
