var canvas, canvasContext;
var player1Pic = player1;
var player2Pic = player2;

var ballArray = [];
var ball1 = new ballClass(200, 550);
var ball2 = new ballClass(950, 550);

var winner;

var mainStates = {
	demo: true,
	inGame: false,
	gameOver: false,
	isPaused: false,
	menuOpen: true
};

var gameMode = {
	shootaround: true,
	oneOnOne: false
}

var character1 = new playerClass(75, 220, mainStates.demo, true);
var character2 = new playerClass(1080, 220, true, false);

window.onload = function () {
	window.addEventListener("focus", windowOnFocus);
    window.addEventListener("blur", windowOnBlur);
    
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	canvas.onmousemove = (evt) => { //gathering mouse coordinates for easy reference during game dev in game play,
		//current use is to outline zones
		//mouseX = evt.pageX;
		//mouseY = evt.pageY;
		//character2.x = mouseX;
		//character2.y = mouseY;

	}

	canvas.onclick = (evt) => {
		mouseX = evt.pageX;
		mouseY = evt.pageY;
		console.log("Mouse Click: (" + (mouseX - 8) + ", " + (mouseY - 10) + ")");
	}

	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorText("LOADING IMAGES", canvas.width / 2, canvas.height / 2, 'white');

	loadImages();
}

window.focus();//necessary to ensure the game receives keyboard input once it is uploaded to itch.io

function windowOnBlur() {
	mainStates.isPaused = true;
	pauseMusic(backgroundMusic);
}

function windowOnFocus() {
	if ((mainStates.inGame) || (mainStates.demo)) {
		playAndLoopMusic(backgroundMusic);
	}

	mainStates.isPaused = false;
}

function imageLoadingDoneSoStartGame() {
	var framesPerSecond = 30;
	initializeArrayOfZones();
	setInterval(updateAll, 1000 / framesPerSecond);
	setAudioFormat();
	loadAudios();

	setupInput();
	
	windowOnFocus();
}

function updateAll() {
	moveAll();
	updateAllEmitters(); // see ParticleSystem.js
	drawAll();
}

function moveAll() {
	if (((mainStates.inGame === true) || (mainStates.demo === true)) && (mainStates.isPaused === false)) {
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
	if ((mainStates.inGame) || (mainStates.demo)) {
		drawWorld();
		ParticleRenderer.renderAll(canvasContext); // particle FX
		drawBallShadows(ballArray);
		drawBalls(ballArray);
		character1.draw();
		character2.draw();

	if (mainStates.menuOpen) {
		drawMainMenu();
	}

	}
	if (mainStates.gameOver) {
		drawGameOver();
	}
}


function drawWorld() {
	if ((mainStates.inGame) || (mainStates.demo)) {
		drawBitmapCenteredWithRotation(basketballCourt, canvas.width / 2, canvas.height / 2, 0);
		drawZones();
		drawScoreboard();
	}
}

function drawGameOver() {
	if (character1.score > character2.score || character1.score >= 100) {
		winner = 1; //character1 won
	} else if (character2.score > character1.score || character2.score >= 100) {
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
		colorRect(canvas.width / 4, canvas.height / 3, canvas.width / 2, canvas.height / 2, "black", 0.5);
		drawBitmapCenteredWithRotation(inTheZoneLogo, canvas.width / 2, (canvas.height / 2) - 50, 0);
		colorText("Press Enter to start game", canvas.width / 2, (canvas.height / 2) + 50, "white", 20);
	}

	if (enterKey && mainStates.menuOpen) {
		mainStates.menuOpen = false;
		mainStates.isPaused = false;
		mainStates.inGame = true;
		mainStates.demo = false;

		character1 = new playerClass(75, 220, mainStates.demo, true);

		setupInput();

		resetGame();
	}
}

function resetGame() {
	character1.initialize();
	character2.initialize();
  player1Score = 0;
  player2Score = 0;

	ball1.x = 200;
	ball1.y = 550;
	ball2.x = 950;
	ball2.y = 550;

	for (var i = 0; i < ballArray.length; i++) {
		ballArray[i]
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
	min = 1;
	sec = 0;
}
