function startGame() {
  initNetwork();
  initControls();
  setInterval(function(){
    draw(serverState);
  }, 50);
  setInterval(function(){
    handleControls();
  }, 50);
  document.getElementById("loginBox").style.display="none";
}
document.getElementById("gameStart").addEventListener('click',startGame);
