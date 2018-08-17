var canvas, canvasContext;
var player1Pic = player1;
var player2Pic = player2;

var ballArray = [];
var ball1 = new ballClass(200, 550);
var ball2 = new ballClass(950, 550);

const MenuBall = {
	SpeedOnePlayer: "Speed1Player",
	SpeedTwoPlayer: "Speed2Player",
	SpeedPractice: "SpeedPractice",
	TurfOnePlayer: "Turf1Player",
	TurfTwoPlayer: "Turf2Player",
	TurfPractice: "TurfPractice",
	Options: "Options",
	Credits: "Credits",
	Help: "Help"
}

const PauseBall = {
	Resume: "resume",
	Restart: "restart",
	Options: "options",
	MainMenu: "mainMenu"
}

const GameOverBall = {
	Restart: "restart",
	Options: "options",
	MainMenu: "mainMenu"
}

var menuBallPos = MenuBall.SpeedOnePlayer;
var pauseBallPos = PauseBall.Resume;
var gameOverBallPos = GameOverBall.Restart;

const CourtOptions = {
	Indoor: "court",
	Beach: "beach",
	Fence: "fence"
}

var courtDisplayed = CourtOptions.Indoor;

const Options = {
	Court: "court",
	Diff: "diff",
	SFX: "sfx",
	Music: "music"
}

var selectedOption = Options.Court;

const AIDifficulty = {
	Easy: 5,
	Normal: 3,
	Hard: 1
}

var selectedDifficulty = AIDifficulty.Easy;
var pressEnterToStartCounter = 1;
var pressEnterShown = false;
var winner;

var mainStates = {
	demo: true,
	inGame: false,
	gameOver: false,
	isPaused: false,
	menuOpen: true,
	optionsOpen: false,
	creditsOpen: false,
	helpOpen: false
};

var GameMode = {
	Shootaround: true,
	OneOnOne: false,
	AroundTheWorld: false
}

var creditsBaseY;

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
		//		console.log("Mouse Click: (" + (mouseX - 8) + ", " + (mouseY - 10) + ")");
	}

	creditsBaseY = 0.80 * canvas.height;

	colorRect(0, 0, canvas.width, canvas.height, 'black');
	colorText("LOADING IMAGES", canvas.width / 2, canvas.height / 2, 'white');

	loadImages();
}

function setPaused(shouldPause) {
	if (shouldPause) {
		mainStates.isPaused = true;
		pauseMusic(backgroundMusic);
	} else {
		mainStates.isPaused = false;
		playAndLoopMusic(backgroundMusic);
	}
}

window.focus();//necessary to ensure the game receives keyboard input once it is uploaded to itch.io

function windowOnBlur() {
	setPaused(true);
}

function windowOnFocus() {
	if ((mainStates.inGame) || (mainStates.demo)) {
		playAndLoopMusic(backgroundMusic);
	}

	setPaused(false);
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

function courtLimitsForYPos(yPos) {
	if (courtDisplayed == CourtOptions.Indoor) {
		return { minX: 0, minY: 125, maxX: canvas.width, maxY: canvas.height };
	} else if (courtDisplayed == CourtOptions.Beach) {
		return { minX: 0, minY: 125, maxX: canvas.width, maxY: canvas.height };
	} else if (courtDisplayed == CourtOptions.Fence) {
		return { minX: (75 - 0.18 * (yPos - 175)), minY: 175, maxX: (canvas.width - (70 - 0.18 * (yPos - 175))), maxY: canvas.height };
	}
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

		if ((sec === 5 || sec === 4 || sec === 3 || sec === 2 || sec === 1) &&
			(GameMode.Shootaround || GameMode.OneOnOne)) {
			clockTick.play();
		} else if ((sec === 0) &&
		           (GameMode.Shootaround || GameMode.OneOnOne) &&
		           suddenDeathOvertime == false) {
			horn.play();
		}
		if ((menuBallPos != MenuBall.SpeedPractice) && (menuBallPos != MenuBall.TurfPractice)) {
			character2.move();
			character2.updateEdgesOfFeet();
			character2.updateCenterOfFeet();
		}
		moveBalls(ballArray);
	}
}

function drawAll() {
	if ((mainStates.inGame) || (mainStates.demo)) {
		drawWorld();
		ParticleRenderer.renderAll(canvasContext); // particle FX
		drawBallShadows(ballArray);
		drawBalls(ballArray);

		if ((menuBallPos == MenuBall.SpeedPractice) || (menuBallPos == MenuBall.TurfPractice)) {
			character1.draw();
		} else if (character1.y > character2.y) {
			character2.draw();
			character1.draw();
		} else {
			character1.draw();
			character2.draw();
		}

		if (mainStates.menuOpen) {
			drawMainMenu();
		} else if (mainStates.optionsOpen) {
			drawOptionsScreen();
		} else if (mainStates.isPaused) {
			drawPausedMenu();
		}
	}

	if (suddenDeathOvertime) {
		drawSuddenDeathText();
	}

	if (mainStates.creditsOpen) {
		drawCredits();
	}

	if (mainStates.helpOpen) {
		drawHelp();
	}

	if (mainStates.gameOver) {
		drawGameOver();
	}
}


function drawWorld() {
	if ((mainStates.inGame) || (mainStates.demo)) {
		if (courtDisplayed == CourtOptions.Indoor) {
			drawBitmapCenteredWithRotation(basketballCourt, canvas.width / 2, canvas.height / 2, 0);
		} else if (courtDisplayed == CourtOptions.Beach) {
			drawBitmapCenteredWithRotation(beachBasketballCourt, canvas.width / 2, canvas.height / 2, 0);
		} else if (courtDisplayed == CourtOptions.Fence) {
			drawBitmapCenteredWithRotation(fenceBasketballCourt, canvas.width / 2, canvas.height / 2, 0);
		}
		drawZones();
		drawScoreboard();
	}
}

function celebrationWobble() {
	return (Math.pow(Math.cos(performance.now() / 120), 2) / Math.PI) * 40;
}

function drawGameOver() {
		suddenDeathTextCounter = 0;
	if (character1.score > character2.score || character1.score >= 100) {
		winner = 1; //character1 won
	} else if (character2.score > character1.score || character2.score >= 100) {
		winner = 2; //character2 won
	} else if (character1.score == character2.score) {
		winner = 0; //tie
	}
	colorRect(0, 0, canvas.width, canvas.height, "orange");
	switch (winner) {
		case 0:
			colorText("The game ended with a tie", 350, 300, "white");
			break;
		case 1:
			colorText("player1 has won", 350, 300, "white");
			drawBitmapCenteredWithRotation(player1Victory, 600, 300 + celebrationWobble(), 0);
			//twoPointsFX(Math.random() * canvas.width, Math.random() * 300);
			break;
		case 2:
			if (character2.isAI) {
				drawBitmapCenteredWithRotation(gameOverSadPicture, 600, 300, 0);
			}
			else {
				drawBitmapCenteredWithRotation(player2Victory, 600, 300 + celebrationWobble(), 0);
				//twoPointsFX(Math.random() * canvas.width, Math.random() * 300);
			}
			colorText("player2 has won", 350, 300, "white");
			break;
	}
	if (escKey) {
		mainStates.gameOver = false;
		resetGame();
		mainStates.inGame = true;
	}

	colorText("Restart", canvas.width / 2 - 35, canvas.height - 195, "white", 24, "left");
	colorText("Options", canvas.width / 2 - 35, canvas.height - 165, "white", 24, "left");
	colorText("Main Menu", canvas.width / 2 - 35, canvas.height - 135, "white", 24, "left");

	if (gameOverBallPos == GameOverBall.Restart) {
		drawBitmapCenteredWithRotation(ballImage, canvas.width / 2 - 50, canvas.height - 205, 0);
	} else if (gameOverBallPos == GameOverBall.Options) {
		drawBitmapCenteredWithRotation(ballImage, canvas.width / 2 - 50, canvas.height - 175, 0);
	} else if (gameOverBallPos == GameOverBall.MainMenu) {
		drawBitmapCenteredWithRotation(ballImage, canvas.width / 2 - 50, canvas.height - 145, 0);
	}

	if (enterKey && mainStates.gameOver) {
		enterKey = false;
		if (gameOverBallPos == GameOverBall.Restart) {
			mainStates.gameOver = false;
			mainStates.menuOpen = false;

			setPaused(false);
			mainStates.inGame = true;
			mainStates.demo = false;

			resetGame();
		} else if (gameOverBallPos == GameOverBall.Options) {
			mainStates.optionsOpen = true;
			mainStates.gameOver = false;

			setPaused(false);
			mainStates.inGame = false;
			mainStates.demo = true;
			resetDemo();
		} else if (gameOverBallPos == GameOverBall.MainMenu) {
			console.log("going to main menu");
			mainStates.menuOpen = true;
			mainStates.gameOver = false;

			setPaused(false);
			mainStates.inGame = false;
			mainStates.demo = true;
			resetDemo();
		}
	}
}

function drawCredits() {
	const contributors = [
		{ name: "Barıs Koklu", works: ['Game Lead', 'Core Gameplay', 'AI Drivers', 'Time Limit', 'Successful Shot Detection', 'Art Integration', 'Player Art & Animation'] },
		{ name: "H Trayford", works: ['Menu Functionality', 'Demo Gameplay'] },
		{ name: "Brandon Trumpold", works: ['Tuning Shooting Mechanics', 'Sudden Death Overtime Implementation', 'UI Polish'] }
		/*    {name:"Terrence McDonnell", works: ['Signs (Over 28 Designs)', 'Checkpoint Code', 'Crashing Animation Code', 'Menu Improvements', 'Finish Line Animation', 'Stage Ground Colors', 'Track Design (Skyline, Mountain, Forest)','Main Menu Animation']},
			{name:"Artem Smirnov", works: ['Screen State Machine','City Skyline','Data Storage','End of Round Report','Level Select','Game Over Screen','Font Improvements','Dashboard Radio', 'Automatic Transmission']},
			{name:"Adam A. Lohnes", works: ['Truck Model and Sprites','Semi Model and Sprites','Bus Model and Sprites']},
			{name:"Christer McFunkypants Kaitila", works: ['Particle Effects', 'Car Spritesheet Code', 'Dashboard HUD Code', 'Cloudy Sky Backgrounds', 'Sharp Pixel Scaling','Gamepad Support', 'Kangaroo Sign', 'Title Parallax', 'Random Track Generator (Unreleased WIP)']},
			{name:"Michael Misha Fewkes", works: ['Custom Audio Engine Code','Sounds (Engine, Off Road, Brakes, Crash)', 'Sound Mixing', 'Starting Countdown']},
			{name:"Vignesh Ramesh", works: ['Music (Snow Level, Night Theme)','Player Car Model','Sound (Cheering)','Billboard (Slick Punch)']},
			{name:"Brandon Trumpold", works: ['Steering Feel Tweaks','Tuning (speeds, crash time)', 'RPM Needle Fix']},
			{name:"Stebs",  works: ['Billboard (East Coast Throwback)', 'Billboard (Presidential)', 'Billboard (Attractions)', 'Additional Tree Art']},
			{name:"Chris Markle", works: ['Music (Main Menu, Game Over)', 'Sound (Checkpoint)','Billboard (Globuton)']},
			{name:"Tomanski", works: ['Snowy Mountain Background','Props (Tires)','Props (Trees)','Main Menu Sprites']},
			{name:"Todd Enyeart", works: ['Billboard (Sandwich)','Billboard (Coffee)', 'Billboard (Fast Food)']},
			{name:"Barıs Koklu", works: ['Gear Shifting', "Game Over Screen Improvement"]},
			{name:"Joseph Spedale", works: ['Countdown Sounds', 'Music (Dr Juno)']},
			{name:"Remy Lapointe", works: ['Billboard (Arcaninjadroid)','Billboard (Spell Spiel)']},
			{name:"Mary Brady", works: ['Dashboard UI Art']},
			{name:"Dynokhan", works: ['Rear Car Bump Collision']},
			{name:"Dan Dela Rosa", works: ['Save State Improvements']},
			{name:"Jeremy Kenyon", works: ['Billboard (We Must Prepare)']},
			{name:"Trenton Pegeas", works: ['Billboard (Aether)']},
			{name:"Brian Boucher", works: ['Playtesting', 'Music Bug Fix']},
			{name:"Brian Dieffenderfer", works: ['Additional Road Tiles']},
			{name:"Chris DeLeon", works: ['Particle Camera Drift','Perspective Sprite Tweaks','Credits Data Entry']}*/
	];

	colorRect(0, 0, canvas.width, canvas.height, "black", 0.5);

	if (!mainStates.isPaused) {
		if (upArrowKey) {
			creditsBaseY -= 6;
		} else if (downArrowKey) {
			creditsBaseY += 6;
		} else {
			creditsBaseY -= 3;
		}
	}

	let nameX = canvas.width / 2 - 350;
	let textSkip = 20;
	let height = 24;
	var textY = 150;

	for (let i = 0; i < contributors.length; i++) {
		let contributor = contributors[i];

		colorText(contributor.name, nameX, creditsBaseY + textY, "white", 24, "left");
		textY += height * 1.4;
		for (let j = 0; j < contributor.works.length; j++) {
			colorText(contributor.works[j], nameX + 20, creditsBaseY + textY, "white", 20, "left");
			textY += height;
		}
		textY += textSkip;
	}

	colorText("Backspace to Main Menu", canvas.width - 125, canvas.height - 45, "white", 24, "right");
	colorText("Up/Down Arrows to scroll", canvas.width - 125, canvas.height - 15, "white", 20, "right");
	if (backspaceKey && mainStates.creditsOpen) {
		creditsBaseY = 0.80 * canvas.height;
		mainStates.menuOpen = true;
		mainStates.creditsOpen = false;
		backspaceKey = false;
	}
}

function drawHelp() {
	const menuX = canvas.width / 8;
	const menuY = canvas.height / 8;
	const menuWidth = 3 * canvas.width / 4;
	const menuHeight = 3 * canvas.height / 4;

	colorRect(menuX, menuY, menuWidth, menuHeight, "black", 0.5);

	colorText("Help", menuX + menuWidth / 2, menuY + 45, "white", 40, "center");

	colorText("Controls", menuX + 110, menuY + 70, "white", 24, "left");
	colorText("Player 1: Arrow keys to move, Spacebar to shoot", menuX + 10, menuY + 100, "white", 20, "left");
	colorText("Player 2: WASD to move, X to shoot", menuX + 10, menuY + 140, "white", 20, "left");
	colorText("Hold shoot key to power up for the perfect shot", menuX + 10, menuY + 180, "white", 20, "left");

	colorText("Play Styles", menuX + (menuWidth / 2) + 210, menuY + 70, "white", 24, "left");
	colorText("One Player: Play against the AI", menuX + (menuWidth / 2) + 110, menuY + 100, "white", 20, "left");
	colorText("Two Player: Play against your friend", menuX + (menuWidth / 2) + 110, menuY + 140, "white", 20, "left");
	colorText("Practice: Play by yourself to git gud", menuX + (menuWidth / 2) + 110, menuY + 180, "white", 20, "left");

	colorText("Game Modes", menuX + (menuWidth / 2) - 55, menuY + 250, "white", 24, "left");
	colorText("Speed Round: Get as many points as possible in", menuX + (menuWidth / 2) - 195, menuY + 280, "white", 20, "left");
	colorText("one minute.  Steal points from your", menuX + (menuWidth / 2) - 85, menuY + 310, "white", 20, "left");
	colorText("opponent by making baskets from", menuX + (menuWidth / 2) - 85, menuY + 340, "white", 20, "left");
	colorText("their zones.", menuX + (menuWidth / 2) - 85, menuY + 370, "white", 20, "left");

	colorText("Turf War: Earn as many points as you can by", menuX + (menuWidth / 2) - 195, menuY + 410, "white", 20, "left");
	colorText("claiming as many zones as possible.", menuX + (menuWidth / 2) - 85, menuY + 440, "white", 20, "left");
	colorText("Game ends when all zones have been", menuX + (menuWidth / 2) - 85, menuY + 470, "white", 20, "left");
	colorText("claimed.", menuX + (menuWidth / 2) - 85, menuY + 500, "white", 20, "left");

	colorText("Backspace to Main Menu", menuX + (menuWidth / 2) + 280, menuY + (menuHeight / 2) + 260, "lightblue", 14, "left");

	if (backspaceKey && mainStates.helpOpen) {
		mainStates.menuOpen = true;
		mainStates.helpOpen = false;
		backspaceKey = false;
	}
}

function drawMainMenu() {
	if (mainStates.menuOpen) {
		const menuX = canvas.width / 4;
		const menuY = canvas.height / 3;
		const menuWidth = canvas.width / 2;
		const menuHeight = canvas.height / 2;
		const lowerMenuHalfOffset = 25;

		reboundFX(Math.random() * canvas.width, Math.random() * 100);

		colorRect(menuX, menuY - 25, menuWidth, menuHeight, "black", 0.65);
		drawBitmapCenteredWithRotation(inTheZoneLogo, canvas.width / 2, (canvas.height / 2) - 50, 0);
		
		pressEnterToStartCounter++;
		// This means that every 10 frames, we will show the text, and then turn it off for 10 frames
		if (pressEnterToStartCounter % 15 == 0) {
			pressEnterShown = !pressEnterShown;
		}
		if (pressEnterShown) {
			colorText("Press Enter to start game", canvas.width / 2, (canvas.height / 2) + 50, "white", 32, "center");
		}
		colorText("Speed Round", menuX + menuWidth / 4 + 20 - lowerMenuHalfOffset, (canvas.height / 2) + 90, "white", 28, "center");
		colorText("Turf War", menuX + 3 * menuWidth / 4 + 15 - lowerMenuHalfOffset + 20, (canvas.height / 2) + 90, "white", 28, "center");

		colorText("1 Player", menuX + menuWidth / 4 - 25 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 70, "white", 24, "left");
		colorText("2 Players", menuX + menuWidth / 4 - 25 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 100, "white", 24, "left");
		colorText("Practice", menuX + menuWidth / 4 - 25 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 130, "white", 24, "left");

		colorText("1 Player", menuX + 3 * menuWidth / 4 - 25 - lowerMenuHalfOffset + 20, menuY + (menuHeight / 2) + 70, "white", 24, "left");
		colorText("2 Players", menuX + 3 * menuWidth / 4 - 25 - lowerMenuHalfOffset + 20, menuY + (menuHeight / 2) + 100, "white", 24, "left");
		colorText("Practice", menuX + 3 * menuWidth / 4 - 25 - lowerMenuHalfOffset + 20, menuY + (menuHeight / 2) + 130, "white", 24, "left");

		colorText("Options", menuX + menuWidth / 2 - 15 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 70, "white", 24, "left");
		colorText("Credits", menuX + menuWidth / 2 - 12 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 100, "white", 24, "left");
		colorText("Help", menuX + menuWidth / 2 - 1 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 130, "white", 24, "left");

		if (menuBallPos == MenuBall.SpeedOnePlayer) {
			drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 4 - 40 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 60, 0);
		} else if (menuBallPos == MenuBall.SpeedTwoPlayer) {
				drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 4 - 40 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 90, 0);
		} else if (menuBallPos == MenuBall.SpeedPractice) {
			drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 4 - 40 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 120, 0);
		} else if (menuBallPos == MenuBall.TurfOnePlayer) {
			drawBitmapCenteredWithRotation(ballImage, menuX + 3 * menuWidth / 4 - 20 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 60, 0);
		} else if (menuBallPos == MenuBall.TurfTwoPlayer) {
			drawBitmapCenteredWithRotation(ballImage, menuX + 3 * menuWidth / 4 - 20 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 90, 0);
		} else if (menuBallPos == MenuBall.TurfPractice) {
			drawBitmapCenteredWithRotation(ballImage, menuX + 3 * menuWidth / 4 - 20 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 120, 0);
		} else if (menuBallPos == MenuBall.Options) {
			drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 30 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 60, 0);
		} else if (menuBallPos == MenuBall.Credits) {
			drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 30 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 90, 0);
		} else if (menuBallPos == MenuBall.Help) {
			drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 30 - lowerMenuHalfOffset, menuY + (menuHeight / 2) + 120, 0);
		}
	}

	if (enterKey && mainStates.menuOpen) {
		enterKey = false;
		if (menuBallPos == MenuBall.Options) {
			mainStates.optionsOpen = true;
			mainStates.menuOpen = false;
		} else if (menuBallPos == MenuBall.Credits) {
			mainStates.menuOpen = false;
			mainStates.creditsOpen = true;
		} else if (menuBallPos == MenuBall.Help) {
			mainStates.menuOpen = false;
			mainStates.helpOpen = true;
		} else {
			if ((menuBallPos == MenuBall.SpeedOnePlayer) || (menuBallPos == MenuBall.SpeedTwoPlayer) || (menuBallPos == MenuBall.SpeedPractice)) {
				GameMode.Shootaround = true;
				GameMode.OneOnOne = false;
				GameMode.AroundTheWorld = false;
			} else if ((menuBallPos == MenuBall.TurfOnePlayer) || (menuBallPos == MenuBall.TurfTwoPlayer) || (menuBallPos == MenuBall.TurfPractice)) {
				GameMode.Shootaround = false;
				GameMode.OneOnOne = false;
				GameMode.AroundTheWorld = true;
			}

			mainStates.menuOpen = false;
			setPaused(false);
			mainStates.inGame = true;
			mainStates.demo = false;

			resetGame();
		}
	}
}

function drawPausedMenu() {
	const menuX = canvas.width / 4;
	const menuY = canvas.height / 3;
	const menuWidth = canvas.width / 2;
	const menuHeight = canvas.height / 2;
	const offsetToCenter = 20;

	colorRect(menuX, menuY, menuWidth, menuHeight, "black", 0.5);
	drawBitmapCenteredWithRotation(inTheZoneLogo, canvas.width / 2, (canvas.height / 2) - 30, 0);
	colorText("Resume", menuX + menuWidth / 2 - 25 - offsetToCenter, menuY + (menuHeight / 2) + 60, "white", 24, "left");
	colorText("Restart", menuX + menuWidth / 2 - 25 - offsetToCenter, menuY + (menuHeight / 2) + 90, "white", 24, "left");
	colorText("Options", menuX + menuWidth / 2 - 25 - offsetToCenter, menuY + (menuHeight / 2) + 120, "white", 24, "left");
	colorText("Main Menu", menuX + menuWidth / 2 - 25 - offsetToCenter, menuY + (menuHeight / 2) + 150, "white", 24, "left");

	if (pauseBallPos == PauseBall.Resume) {
		drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40 - offsetToCenter, menuY + (menuHeight / 2) + 50, 0);
	} else if (pauseBallPos == PauseBall.Restart) {
		drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40 - offsetToCenter, menuY + (menuHeight / 2) + 80, 0);
	} else if (pauseBallPos == PauseBall.Options) {
		drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40 - offsetToCenter, menuY + (menuHeight / 2) + 110, 0);
	} else if (pauseBallPos == PauseBall.MainMenu) {
		drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40 - offsetToCenter, menuY + (menuHeight / 2) + 140, 0);
	}

	if (enterKey && mainStates.isPaused) {
		setPaused(false);
		enterKey = false;

		if (pauseBallPos == PauseBall.Resume) {
			//setPaused(false); is all that needs to be done, so nothing else here
		} else if (pauseBallPos == PauseBall.Restart) {
			resetGame();
		} else if (pauseBallPos == PauseBall.Options) {
			mainStates.optionsOpen = true;
		} else if (pauseBallPos == PauseBall.MainMenu) {
			mainStates.menuOpen = true;
		}
	}
}

function drawOptionsScreen() {
	if (mainStates.optionsOpen) {
		const menuX = canvas.width / 4;
		const menuY = canvas.height / 3;
		const menuWidth = canvas.width / 2;
		const menuHeight = canvas.height / 2;

		colorRect(menuX, menuY, menuWidth, menuHeight, "black", 0.5);
		drawBitmapWithSizeAndRotation(optionsScoreboard, menuX + menuWidth / 2, menuY + (menuHeight / 4) + 20, menuWidth / 2, menuHeight / 2, 0);

		if (courtDisplayed == CourtOptions.Indoor) {
			drawBitmapWithSizeAndRotation(number1, menuX + (menuWidth / 2) - 66, menuY + (menuHeight / 4) - (menuHeight / 8) + 24, menuWidth / 9, menuHeight / 9, 0);
		} else if (courtDisplayed == CourtOptions.Beach) {
			drawBitmapWithSizeAndRotation(number2, menuX + (menuWidth / 2) - 66, menuY + (menuHeight / 4) - (menuHeight / 8) + 24, menuWidth / 9, menuHeight / 9, 0);
		} else if (courtDisplayed == CourtOptions.Fence) {
			drawBitmapWithSizeAndRotation(number3, menuX + (menuWidth / 2) - 66, menuY + (menuHeight / 4) - (menuHeight / 8) + 24, menuWidth / 9, menuHeight / 9, 0);
		}

		if (selectedDifficulty == AIDifficulty.Easy) {
			drawBitmapWithSizeAndRotation(number1, menuX + (menuWidth / 2) + 64, menuY + (menuHeight / 4) - (menuHeight / 8) + 24, menuWidth / 9, menuHeight / 9, 0);
		} else if (selectedDifficulty == AIDifficulty.Normal) {
			drawBitmapWithSizeAndRotation(number2, menuX + (menuWidth / 2) + 64, menuY + (menuHeight / 4) - (menuHeight / 8) + 24, menuWidth / 9, menuHeight / 9, 0);
		} else if (selectedDifficulty == AIDifficulty.Hard) {
			drawBitmapWithSizeAndRotation(number3, menuX + (menuWidth / 2) + 64, menuY + (menuHeight / 4) - (menuHeight / 8) + 24, menuWidth / 9, menuHeight / 9, 0);
		}

		const selectedColor = "yellow";
		const courtBox = { x: menuX + menuWidth / 2 - 110, y: menuY + 42, w: 90, h: 52 };
		const diffBox = { x: menuX + menuWidth / 2 + 20, y: menuY + 42, w: 90, h: 52 };
		const sfxBox = { x: menuX + menuWidth / 2 - 135, y: menuY + 143, w: 108, h: 52 };
		const musicBox = { x: menuX + menuWidth / 2 + 27, y: menuY + 143, w: 108, h: 52 };

		if (selectedOption == Options.Court) {
			strokePath([{ x: courtBox.x, y: courtBox.y },
			{ x: courtBox.x + courtBox.w, y: courtBox.y },
			{ x: courtBox.x + courtBox.w, y: courtBox.y + courtBox.h },
			{ x: courtBox.x, y: courtBox.y + courtBox.h }], selectedColor);
		} else if (selectedOption == Options.Diff) {
			strokePath([{ x: diffBox.x, y: diffBox.y },
			{ x: diffBox.x + diffBox.w, y: diffBox.y },
			{ x: diffBox.x + diffBox.w, y: diffBox.y + diffBox.h },
			{ x: diffBox.x, y: diffBox.y + diffBox.h }], selectedColor);
		} else if (selectedOption == Options.SFX) {
			strokePath([{ x: sfxBox.x, y: sfxBox.y },
			{ x: sfxBox.x + sfxBox.w, y: sfxBox.y },
			{ x: sfxBox.x + sfxBox.w, y: sfxBox.y + sfxBox.h },
			{ x: sfxBox.x, y: sfxBox.y + sfxBox.h }], selectedColor);
		} else if (selectedOption == Options.Music) {
			strokePath([{ x: musicBox.x, y: musicBox.y },
			{ x: musicBox.x + musicBox.w, y: musicBox.y },
			{ x: musicBox.x + musicBox.w, y: musicBox.y + musicBox.h },
			{ x: musicBox.x, y: musicBox.y + musicBox.h }], selectedColor);
		}

		const sfxVolumeImage = getVolumeImage(getSFXVolume());
		drawBitmapWithSizeAndRotation(sfxVolumeImage[0], sfxBox.x + 25, sfxBox.y + 28, menuWidth / 9, menuHeight / 9, 0);
		drawBitmapWithSizeAndRotation(sfxVolumeImage[1], sfxBox.x + 75, sfxBox.y + 28, menuWidth / 9, menuHeight / 9, 0);
		const musicVolumeImage = getVolumeImage(getMusicVolume(backgroundMusic))
		drawBitmapWithSizeAndRotation(musicVolumeImage[0], musicBox.x + 25, musicBox.y + 28, menuWidth / 9, menuHeight / 9, 0);
		drawBitmapWithSizeAndRotation(musicVolumeImage[1], musicBox.x + 75, musicBox.y + 28, menuWidth / 9, menuHeight / 9, 0);

		colorText("Press Enter to Start", menuX + (menuWidth / 2) - 100, menuY + (menuHeight / 2) + 50, "white", 24, "left");
		colorText("Backspace to Main Menu", menuX + (menuWidth / 2) - 125, menuY + (menuHeight / 2) + 80, "white", 24, "left");

		colorText("Arrows to change option", menuX + (menuWidth / 2) - 10, menuY + (menuHeight / 2) + 120, "white", 16, "center");
		colorText("+/- to change option values", menuX + (menuWidth / 2) - 10, menuY + (menuHeight / 2) + 150, "white", 16, "center");
	}

	if (backspaceKey && mainStates.optionsOpen) {
		mainStates.menuOpen = true;
		mainStates.optionsOpen = false;
		backspaceKey = false;
	} else if (enterKey && mainStates.optionsOpen) {
		mainStates.inGame = true;
		mainStates.menuOpen = false;
		mainStates.optionsOpen = false;
		enterKey = false;

		if ((menuBallPos == MenuBall.Options) || (menuBallPos == MenuBall.Credits) || (menuBallPos == MenuBall.SpeedOnePlayer)) {
			menuBallPos = MenuBall.SpeedOnePlayer;
			GameMode.Shootaround = true;
			GameMode.OneOnOne = false;
			GameMode.AroundTheWorld = false;
		} else if (menuBallPos == MenuBall.SpeedTwoPlayer) {
			menuBallPos = MenuBall.SpeedTwoPlayer;
			GameMode.Shootaround = true;
			GameMode.OneOnOne = false;
			GameMode.AroundTheWorld = false;
		} if (menuBallPos == MenuBall.TurfOnePlayer) {
			menuBallPos = MenuBall.TurfOnePlayer;
			GameMode.Shootaround = false;
			GameMode.OneOnOne = false;
			GameMode.AroundTheWorld = true;
		} else if (menuBallPos == MenuBall.TurfTwoPlayer) {
			menuBallPos = MenuBall.TurfTwoPlayer;
			GameMode.Shootaround = false;
			GameMode.OneOnOne = false;
			GameMode.AroundTheWorld = true;
		}

		resetGame();
	}
}

function getVolumeImage(volume) {
	const cleanVolume = Math.floor(volume * 10);
	switch (cleanVolume) {
		case 0:
			return [number0, number0];
		case 1:
			return [number0, number1];
		case 2:
			return [number0, number2];
		case 3:
			return [number0, number3];
		case 4:
			return [number0, number4];
		case 5:
			return [number0, number5];
		case 6:
			return [number0, number6];
		case 7:
			return [number0, number7];
		case 8:
			return [number0, number8];
		case 9:
			return [number0, number9];
		case 10:
			return [number1, number0];
	}
}

function moveSelectionRight() {
	if (menuBallPos == MenuBall.SpeedOnePlayer) {
		menuBallPos = MenuBall.Options;
	} else if (menuBallPos == MenuBall.SpeedTwoPlayer) {
		menuBallPos = MenuBall.Credits;
	} else if (menuBallPos == MenuBall.SpeedPractice) {
		menuBallPos = MenuBall.Help;
	} else if (menuBallPos == MenuBall.TurfOnePlayer) {
		menuBallPos = MenuBall.SpeedOnePlayer;
	} else if (menuBallPos == MenuBall.TurfTwoPlayer) {
		menuBallPos = MenuBall.SpeedTwoPlayer;
	} else if (menuBallPos == MenuBall.TurfPractice) {
		menuBallPos = MenuBall.SpeedPractice;
	} else if (menuBallPos == MenuBall.Options) {
		menuBallPos = MenuBall.TurfOnePlayer;
	} else if (menuBallPos == MenuBall.Credits) {
		menuBallPos = MenuBall.TurfTwoPlayer;
	} else if (menuBallPos == MenuBall.Help) {
		menuBallPos = MenuBall.TurfPractice;
	}
}

function moveSelectionDown() {
	if (menuBallPos == MenuBall.SpeedOnePlayer) {
		menuBallPos = MenuBall.SpeedTwoPlayer;
	} else if (menuBallPos == MenuBall.SpeedTwoPlayer) {
		menuBallPos = MenuBall.SpeedPractice;
	} else if (menuBallPos == MenuBall.SpeedPractice) {
		menuBallPos = MenuBall.Options;
	} else if (menuBallPos == MenuBall.Options) {
		menuBallPos = MenuBall.Credits;
	} else if (menuBallPos == MenuBall.Credits) {
		menuBallPos = MenuBall.Help;
	} else if (menuBallPos == MenuBall.Help) {
		menuBallPos = MenuBall.TurfOnePlayer;
	} else if (menuBallPos == MenuBall.TurfOnePlayer) {
		menuBallPos = MenuBall.TurfTwoPlayer;
	} else if (menuBallPos == MenuBall.TurfTwoPlayer) {
		menuBallPos = MenuBall.TurfPractice;
	} else if (menuBallPos == MenuBall.TurfPractice) {
		menuBallPos = MenuBall.SpeedOnePlayer;
	}
}

function moveSelectionLeft() {
	if (menuBallPos == MenuBall.SpeedOnePlayer) {
		menuBallPos = MenuBall.TurfOnePlayer;
	} else if (menuBallPos == MenuBall.SpeedTwoPlayer) {
		menuBallPos = MenuBall.TurfTwoPlayer;
	} else if (menuBallPos == MenuBall.SpeedPractice) {
		menuBallPos = MenuBall.TurfPractice;
	} else if (menuBallPos == MenuBall.TurfOnePlayer) {
		menuBallPos = MenuBall.Options;
	} else if (menuBallPos == MenuBall.TurfTwoPlayer) {
		menuBallPos = MenuBall.Credits;
	} else if (menuBallPos == MenuBall.TurfPractice) {
		menuBallPos = MenuBall.Help;
	} else if (menuBallPos == MenuBall.Options) {
		menuBallPos = MenuBall.SpeedOnePlayer;
	} else if (menuBallPos == MenuBall.Credits) {
		menuBallPos = MenuBall.SpeedTwoPlayer;
	} else if (menuBallPos == MenuBall.Help) {
		menuBallPos = MenuBall.SpeedPractice;
	}
}

function moveSelectionUp() {
	if (menuBallPos == MenuBall.SpeedOnePlayer) {
		menuBallPos = MenuBall.TurfPractice;
	} else if (menuBallPos == MenuBall.SpeedTwoPlayer) {
		menuBallPos = MenuBall.SpeedOnePlayer;
	} else if (menuBallPos == MenuBall.SpeedPractice) {
		menuBallPos = MenuBall.SpeedTwoPlayer;
	} else if (menuBallPos == MenuBall.TurfOnePlayer) {
		menuBallPos = MenuBall.Help;
	} else if (menuBallPos == MenuBall.TurfTwoPlayer) {
		menuBallPos = MenuBall.TurfOnePlayer;
	} else if (menuBallPos == MenuBall.TurfPractice) {
		menuBallPos = MenuBall.TurfTwoPlayer;
	} else if (menuBallPos == MenuBall.Options) {
		menuBallPos = MenuBall.SpeedPractice;
	} else if (menuBallPos == MenuBall.Credits) {
		menuBallPos = MenuBall.Options;
	} else if (menuBallPos == MenuBall.Help) {
		menuBallPos = MenuBall.Credits;
	}
}

function incrementOption() {
	if (selectedOption == Options.Court) {
		if (mainStates.optionsOpen) {
			if (courtDisplayed == CourtOptions.Indoor) {
				courtDisplayed = CourtOptions.Beach;
				backgroundMusic.pause();
				backgroundMusic.src = "audio/beachCourt" + audioFormat;
				playAndLoopMusic(backgroundMusic);
			} else if (courtDisplayed == CourtOptions.Beach) {
				courtDisplayed = CourtOptions.Fence;
				backgroundMusic.pause();
				backgroundMusic.src = "audio/fenceMusic" + audioFormat;
				playAndLoopMusic(backgroundMusic);
			} else if (courtDisplayed == CourtOptions.Fence) {
				courtDisplayed = CourtOptions.Indoor;
				backgroundMusic.pause();
				backgroundMusic.src = "audio/Sweet Georgia Brown" + audioFormat;
				playAndLoopMusic(backgroundMusic);
			}
		}
	} else if (selectedOption == Options.Diff) {
		if (mainStates.optionsOpen) {
			if (selectedDifficulty == AIDifficulty.Easy) {
				selectedDifficulty = AIDifficulty.Normal;
			} else if (selectedDifficulty == AIDifficulty.Normal) {
				selectedDifficulty = AIDifficulty.Hard;
			} else if (selectedDifficulty == AIDifficulty.Hard) {
				selectedDifficulty = AIDifficulty.Easy;
			}
		}
	} else if (selectedOption == Options.SFX) {
		raiseSFXVolume();
	} else if (selectedOption == Options.Music) {
		raiseVolume(backgroundMusic);
	}
}

function decrementOption() {
	if (selectedOption == Options.Court) {
		if (mainStates.optionsOpen) {
			if (courtDisplayed == CourtOptions.Indoor) {
				courtDisplayed = CourtOptions.Fence;
				backgroundMusic.pause();
				backgroundMusic.src = "audio/fenceMusic" + audioFormat;
				playAndLoopMusic(backgroundMusic);
			} else if (courtDisplayed == CourtOptions.Beach) {
				courtDisplayed = CourtOptions.Indoor;
				backgroundMusic.pause();
				backgroundMusic.src = "audio/Sweet Georgia Brown" + audioFormat;
				playAndLoopMusic(backgroundMusic);
			} else if (courtDisplayed == CourtOptions.Fence) {
				courtDisplayed = CourtOptions.Beach;
				backgroundMusic.pause();
				backgroundMusic.src = "audio/beachCourt" + audioFormat;
				playAndLoopMusic(backgroundMusic);
			}
		}
	} else if (selectedOption == Options.Diff) {
		if (mainStates.optionsOpen) {
			if (selectedDifficulty == AIDifficulty.Easy) {
				selectedDifficulty = AIDifficulty.Hard;
			} else if (selectedDifficulty == AIDifficulty.Normal) {
				selectedDifficulty = AIDifficulty.Easy;
			} else if (selectedDifficulty == AIDifficulty.Hard) {
				selectedDifficulty = AIDifficulty.Normal;
			}
		}
	} else if (selectedOption == Options.SFX) {
		lowerSFXVolume();
	} else if (selectedOption == Options.Music) {
		lowerVolume(backgroundMusic);
	}
}

function nextOption() {
	if (mainStates.optionsOpen) {
		if (selectedOption == Options.Court) {
			selectedOption = Options.Diff;
		} else if (selectedOption == Options.Diff) {
			selectedOption = Options.SFX;
		} else if (selectedOption == Options.SFX) {
			selectedOption = Options.Music;
		} else if (selectedOption == Options.Music) {
			selectedOption = Options.Court;
		}
	} else if (mainStates.isPaused) {
		if (pauseBallPos == PauseBall.Resume) {
			pauseBallPos = PauseBall.Restart;
		} else if (pauseBallPos == PauseBall.Restart) {
			pauseBallPos = PauseBall.Options;
		} else if (pauseBallPos == PauseBall.Options) {
			pauseBallPos = PauseBall.MainMenu;
		} else if (pauseBallPos == PauseBall.MainMenu) {
			pauseBallPos = PauseBall.Resume;
		}
	} else if (mainStates.gameOver) {
		if (gameOverBallPos == GameOverBall.Restart) {
			gameOverBallPos = GameOverBall.Options;
		} else if (gameOverBallPos == GameOverBall.Options) {
			gameOverBallPos = GameOverBall.MainMenu;
		} else if (gameOverBallPos == GameOverBall.MainMenu) {
			gameOverBallPos = GameOverBall.Restart;
		}
	}
}

function previousOption() {
	if (mainStates.optionsOpen) {
		if (selectedOption == Options.Court) {
			selectedOption = Options.Music;
		} else if (selectedOption == Options.SFX) {
			selectedOption = Options.Diff;
		} else if (selectedOption == Options.Music) {
			selectedOption = Options.SFX;
		} else if (selectedOption == Options.Diff) {
			selectedOption = Options.Court;
		}
	} else if (mainStates.isPaused) {
		if (pauseBallPos == PauseBall.Resume) {
			pauseBallPos = PauseBall.MainMenu;
		} else if (pauseBallPos == PauseBall.Restart) {
			pauseBallPos = PauseBall.Resume;
		} else if (pauseBallPos == PauseBall.Options) {
			pauseBallPos = PauseBall.Restart;
		} else if (pauseBallPos == PauseBall.MainMenu) {
			pauseBallPos = PauseBall.Options;
		}
	} else if (mainStates.gameOver) {
		if (gameOverBallPos == GameOverBall.Restart) {
			gameOverBallPos = GameOverBall.MainMenu;
		} else if (gameOverBallPos == GameOverBall.Options) {
			gameOverBallPos = GameOverBall.Restart;
		} else if (gameOverBallPos == GameOverBall.MainMenu) {
			gameOverBallPos = GameOverBall.Options;
		}
	}
}

function resetDemo() {
	character1 = new playerClass(75, 220, true, true);
	character2 = new playerClass(1080, 220, true, false);

	setupInput();

	player1Score = 0;
	player2Score = 0;

	min = 1;
	sec = 0;
}

function resetGame() {
	mainStates.demo = false;

	if ((menuBallPos == MenuBall.SpeedOnePlayer) || (menuBallPos == MenuBall.TurfOnePlayer)) {
		character1 = new playerClass(75, 220, false, true);
		character2 = new playerClass(1080, 220, true, false);
	} else if ((menuBallPos == MenuBall.SpeedTwoPlayer) || (menuBallPos == MenuBall.TurfTwoPlayer)) {
		character1 = new playerClass(75, 220, false, true);
		character2 = new playerClass(1080, 220, false, false);
	} else if ((menuBallPos == MenuBall.SpeedPractice) || (menuBallPos == MenuBall.TurfPractice)) {
		character1 = new playerClass(75, 220, false, true);
		character2 = new playerClass(1080, 220, false, false);
	}

	setupInput();

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

	if (GameMode.AroundTheWorld) {
		min = 0;
		sec = 0;

		resetZones();
	} else {
		min = 1;
		sec = 0;
	}
}
