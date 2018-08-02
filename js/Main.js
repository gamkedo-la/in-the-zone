var canvas, canvasContext;
var currentPic = player1;

var character1 = new playerClass(75, 220, false);
var character2 = new playerClass(1080, 220, true);

var ballArray = [];
var ball1 = new ballClass(200, 550);
var ball2 = new ballClass(950, 550);

var winner;

var mainStates = {
	inGame: true,
	gameOver: false,
	isPaused: false,
	menuOpen: true
};

var gameMode = {
	shootaround: true,
	oneOnOne: false
}



window.focus();//necessary to ensure the game receives keyboard input once it is uploaded to itch.io
window.onload = function () {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	canvas.onmousemove = (evt) => { //gathering mouse coordinates for easy reference during game dev in game play,
		//current use is to outline zones
		//mouseX = evt.pageX;
		//mouseY = evt.pageY;
		//character2.x = mouseX;
		//character2.y = mouseY;

	}

	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorText("LOADING IMAGES", canvas.width / 2, canvas.height / 2, 'white');

	loadImages();

}

function imageLoadingDoneSoStartGame() {
	var framesPerSecond = 30;
	initializeArrayOfZones();
	setInterval(updateAll, 1000 / framesPerSecond);
	setAudioFormat();
	loadAudios();

	setupInput();
}

function updateAll() {
	moveAll();
	updateAllEmitters(); // see ParticleSystem.js
	drawAll();
	if (mainStates.inGame) {
		playAndLoopMusic(backgroundMusic);
	}
}

function moveAll() {
	if (mainStates.inGame === true && mainStates.isPaused === false) {
		character1.move();
		character1.updateEdgesOfFeet();
		character1.updateCenterOfFeet();
		character2.move();
		character2.updateEdgesOfFeet();
		character2.updateCenterOfFeet();
		moveBalls(ballArray);
	}
}

function drawAll() {
	if (mainStates.inGame) {
		drawWorld();
		ParticleRenderer.renderAll(canvasContext); // particle FX
		drawBallShadows(ballArray);
		drawBalls(ballArray);
		character1.draw();
		character2.draw();
		drawMainMenu();
	}
	if (mainStates.gameOver) {
		drawGameOver();
	}
}


function drawWorld() {
	if (mainStates.inGame) {
		drawBitmapCenteredWithRotation(basketballCourt, canvas.width / 2, canvas.height / 2, 0);
		drawZones();
		drawScoreboard();

	}
}

function drawGameOver() {
	if (character1.score > character2.score) {
		winner = 1; //character1 won
	} else if (character2.score > character1.score) {
		winner = 2; //character2 won
	} else if (character1.score == character2.score) {
		winner = 0; //tie
	}
	colorRect(0, 0, canvas.width, canvas.height, "black");
	switch (winner) {
		case 0:
			colorText("The game ended with a tie", 350, 300, "white");
			break;
		case 1:
			colorText("player1 has won", 350, 300, "white");
			break;
		case 2:
			colorText("player2 has won", 350, 300, "white");
			break;
	}
	if (escKey) {
		mainStates.gameOver = false;
		resetGame();
		mainStates.inGame = true;
	}
}

function drawMainMenu() {
	var fired = false;

	if (mainStates.menuOpen) {
		mainStates.isPaused = true;
		colorRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2, "black");
		colorText("Press Enter to start game", canvas.width / 2, canvas.height / 2, "white");
	}

	if (enterKey) {
		mainStates.menuOpen = false;
		mainStates.isPaused = false;
	}

}

function resetGame() {
	character1.x = 75;
	character1.y = 75;
	character1.isHoldingBall = false;
	character1.ballToHold = false;
	character1.ballToChase = false;
	character1.currentZone = false;
	character1.score = 0;
	character1.tickCount = 0;
	character1.states.isIdle = true;
	character1.states.isShooting = false;
	character1.states.isDunking = false;
	player1Score = 0;
	player2Score = 0;

	character2.x = 150;
	character2.y = 75;
	character2.isHoldingBall = false;
	character2.ballToHold = false;
	character2.ballToChase = false;
	character2.currentZone = false;
	character2.score = 0;
	character2.tickCount = 0;
	character2.states.isIdle = true;
	character2.states.isShooting = false;
	character2.states.isDunking = false;
	for (var i = 0; i < ballArray.length; i++) {
		ballArray[i]
		ballArray[i].x = 700;
		ballArray[i].y = 100;
		ballArray[i].isHeld = false
		ballArray[i].isHeldBy = null;
		ballArray[i].beingShot = false;
		ballArray[i].shootingX = 0;
		ballArray[i].shootingY = 0;
		ballArray[i].height = 10;
		ballArray[i].ballPower = -10;
		ballArray[i].goingIn = false;
		ballArray[i].isShotBy = null;
	}
	for (var i = 0; i < arrayOfZones.length; i++) {
		arrayOfZones[i].unclaimed = true;

		arrayOfZones[i].claimStatus = 0;
		arrayOfZones[i].character1InTheZone = false;
		arrayOfZones[i].character2InTheZone = false;
		arrayOfZones[i].isClaimedBy;
	}
	min = 0;
	sec = 30;
}
