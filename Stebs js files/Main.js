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
	canvas.onmousemove = (evt) => {//gathering mouse coordinates for easy reference during game dev in game play,
		                             //current use is to outline zones
		 mouseX = evt.pageX;
		 mouseY = evt.pageY;
	}

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
	initializeArrayOfZones();
}

function updateAll() {
	character1.updateEdgesOfFeet();
	//console.log("player",character1.leftEdgeOfFeet,character1.topEdgeOfFeet,character1.rightEdgeOfFeet,character1.bottomEdgeOfFeet);
	//console.log("zone",arrayOfZones[0].leftEdge,arrayOfZones[0].topEdge,arrayOfZones[0].rightEdge,arrayOfZones[0].bottomEdge);
	//console.log(arrayOfZones[0].claimStatus);
	character2.updateEdgesOfFeet();
	updateZoneStatus();
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
	drawZones();
  character1.draw();
  character2.draw();
	drawBallShadows(ballArray);
  drawBalls(ballArray);
	//drawGrid();

}


function drawWorld(){
  drawBitmapCenteredWithRotation(basketballCourt, canvas.width/2,canvas.height/2,0);
}
