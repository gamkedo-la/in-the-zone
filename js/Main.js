var canvas, canvasContext;
var currentPic = player1;

var character1 = new playerClass(75,75,false);
var character2 = new playerClass(150,75,true);

var ballArray = [];
var ball1 = new ballClass(700,100);
var ball2 = new ballClass(500,600);


window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("LOADING IMAGES", canvas.width/2, canvas.height/2, 'white');

	loadImages();
}

function imageLoadingDoneSoStartGame() {
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);
	setAudioFormat();
	loadAudios();
	setupInput();
}

function updateAll() {
	moveAll();
	drawAll();
}

function moveAll() {
	character1.move();
  character2.move();
  moveBalls(ballArray);
}

function drawAll() {
	drawWorld();
  character1.draw();
  character2.draw();
	drawBallShadows(ballArray);
  drawBalls(ballArray);
}


function drawWorld(){
  drawBitmapCenteredWithRotation(basketballCourt, canvas.width/2,canvas.height/2,0);
}
