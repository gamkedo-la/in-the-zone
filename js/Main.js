var canvas, canvasContext;
var player1Pic = player1;
var player2Pic = player2;

var ballArray = [];
var ball1 = new ballClass(200, 550);
var ball2 = new ballClass(950, 550);

const MenuBall = {
	OnePlayer:"1Player",
	TwoPlayer:"2Player",
	Options:"Options",
	Credits:"Credits"
}

const PauseBall = {
	Resume:"resume",
	Restart:"restart",
	Options:"options",
	MainMenu:"mainMenu"
}

var menuBallPos = MenuBall.OnePlayer;
var pauseBallPos = PauseBall.Resume;

const CourtOptions = {
	Indoor:"court",
	Beach:"beach",
	Fence:"fence"
}

var courtDisplayed = CourtOptions.Indoor;

const Options = {
	Court:"court",
	SFX:"sfx",
	Music:"music"
}

var selectedOption = Options.Court;

var winner;

var mainStates = {
	demo: true,
	inGame: false,
	gameOver: false,
	isPaused: false,
	menuOpen: true,
	optionsOpen:false,
	creditsOpen:false,
};

var gameMode = {
	shootaround: true,
	oneOnOne: false
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
	if(shouldPause) {
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
	if(courtDisplayed == CourtOptions.Indoor) {
		return {minX:0, minY:125, maxX:canvas.width, maxY:canvas.height};
	} else if(courtDisplayed ==  CourtOptions.Beach) {
		return {minX:0, minY:125, maxX:canvas.width, maxY:canvas.height};
	} else if(courtDisplayed == CourtOptions.Fence) {
		return {minX:(75 - 0.18 * (yPos - 175)), minY:175, maxX:(canvas.width - (70 - 0.18 * (yPos - 175))), maxY:canvas.height};
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
		
		if (character1.y > character2.y) {
			character2.draw();
			character1.draw();
		} else {
			character1.draw();
			character2.draw();
		}
	
		if (mainStates.menuOpen) {
			drawMainMenu();
		}
	
		if (mainStates.optionsOpen) {
			drawOptionsScreen();
		}
		
		if(mainStates.isPaused) {
			drawPausedMenu();
		}
	}

	if(mainStates.creditsOpen) {
		drawCredits();
	}

	if (mainStates.gameOver) {
		drawGameOver();
	}
}


function drawWorld() {
	if ((mainStates.inGame) || (mainStates.demo)) {
		if(courtDisplayed == CourtOptions.Indoor) {
			drawBitmapCenteredWithRotation(basketballCourt, canvas.width / 2, canvas.height / 2, 0);
		} else if(courtDisplayed ==  CourtOptions.Beach) {
			drawBitmapCenteredWithRotation(beachBasketballCourt, canvas.width / 2, canvas.height / 2, 0);
		} else if(courtDisplayed == CourtOptions.Fence) {
			drawBitmapCenteredWithRotation(fenceBasketballCourt, canvas.width / 2, canvas.height / 2, 0);
		}
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
		if (character2.isAI) {
			drawBitmapCenteredWithRotation(gameOverSadPicture, 600, 300, 0);
		}
			colorText("player2 has won", 350, 300, "white");
			break;
	}
	if (escKey) {
		mainStates.gameOver = false;
		resetGame();
		mainStates.inGame = true;
	}
}

function drawCredits() {
    const contributors = [
    {name:"Barıs Koklu",   works: ['Game Lead', 'Core Gameplay', 'AI Drivers', 'Time Limit', 'Successful Shot Detection', 'Art Integration', 'Player Art & Animation'] },
    {name:"H Trayford", works: ['Menu Functionality', 'Demo Gameplay']}

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

	creditsBaseY--;
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
}

function drawMainMenu() {
	if (mainStates.menuOpen) {
		const menuX = canvas.width / 4;
		const menuY = canvas.height / 3;
		const menuWidth = canvas.width / 2;
		const menuHeight = canvas.height / 2;

		colorRect(menuX, menuY, menuWidth, menuHeight, "black", 0.5);
		drawBitmapCenteredWithRotation(inTheZoneLogo, canvas.width / 2, (canvas.height / 2) - 50, 0);
		colorText("Press Enter to start game", canvas.width / 2, (canvas.height / 2) + 50, "white", 28, "center");
		colorText("1 Player", menuX + menuWidth / 2 - 25, menuY + (menuHeight / 2) + 60, "white", 24, "left");
		colorText("2 Players", menuX + menuWidth / 2 - 25, menuY + (menuHeight / 2) + 90, "white", 24, "left");
		colorText("Options", menuX + menuWidth / 2 - 25, menuY + (menuHeight / 2) + 120, "white", 24, "left");
		colorText("Credits", menuX + menuWidth / 2 - 25, menuY + (menuHeight / 2) + 150, "white", 24, "left");

		if(menuBallPos == MenuBall.OnePlayer) {
			drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40, menuY + (menuHeight / 2) + 50, 0);
		} else if(menuBallPos == MenuBall.TwoPlayer) {
			drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40, menuY + (menuHeight / 2) + 80, 0);
		} else if(menuBallPos == MenuBall.Options) {
			drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40, menuY + (menuHeight / 2) + 110, 0);
		} else if(menuBallPos == MenuBall.Credits) {
			drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40, menuY + (menuHeight / 2) + 140, 0);
		}
	}

	if (enterKey && mainStates.menuOpen) {
		if(menuBallPos == MenuBall.Options) {
			mainStates.optionsOpen = true;
			mainStates.menuOpen = false;
			enterKey = false;
		} else if(menuBallPos == MenuBall.Credits) {
			mainStates.menuOpen = false;
			mainStates.creditsOpen = true;
		} else {
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

	colorRect(menuX, menuY, menuWidth, menuHeight, "black", 0.5);
	drawBitmapCenteredWithRotation(inTheZoneLogo, canvas.width / 2, (canvas.height / 2) - 50, 0);
	colorText("Resume", menuX + menuWidth / 2 - 25, menuY + (menuHeight / 2) + 60, "white", 24, "left");
	colorText("Restart", menuX + menuWidth / 2 - 25, menuY + (menuHeight / 2) + 90, "white", 24, "left");
	colorText("Options", menuX + menuWidth / 2 - 25, menuY + (menuHeight / 2) + 120, "white", 24, "left");
	colorText("Main Menu", menuX + menuWidth / 2 - 25, menuY + (menuHeight / 2) + 150, "white", 24, "left");

	if(pauseBallPos == PauseBall.Resume) {
		drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40, menuY + (menuHeight / 2) + 50, 0);
	} else if(pauseBallPos == PauseBall.Restart) {
		drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40, menuY + (menuHeight / 2) + 80, 0);
	} else if(pauseBallPos == PauseBall.Options) {
		drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40, menuY + (menuHeight / 2) + 110, 0);
	} else if(pauseBallPos == PauseBall.MainMenu) {
		drawBitmapCenteredWithRotation(ballImage, menuX + menuWidth / 2 - 40, menuY + (menuHeight / 2) + 140, 0);
	}
	
	if(enterKey && mainStates.isPaused) {
		setPaused(false);
		enterKey = false;
		
		if(pauseBallPos == PauseBall.Resume) {
			//setPaused(false); is all that needs to be done, so nothing else here
		} else if(pauseBallPos == PauseBall.Restart) {
			resetGame();
		} else if(pauseBallPos == PauseBall.Options) {
			mainStates.optionsOpen = true;			
		} else if(pauseBallPos == PauseBall.MainMenu) {
			mainStates.menuOpen = true;
		}
	}
}

function drawOptionsScreen() {
	if(mainStates.optionsOpen) {
		const menuX = canvas.width / 4;
		const menuY = canvas.height / 3;
		const menuWidth = canvas.width / 2;
		const menuHeight = canvas.height / 2;

		colorRect(menuX, menuY, menuWidth, menuHeight, "black", 0.5);
		drawBitmapWithSizeAndRotation(optionsScoreboard, menuX + menuWidth / 2, menuY + (menuHeight / 4) + 20, menuWidth / 2, menuHeight / 2, 0);

		if(courtDisplayed == CourtOptions.Indoor) {
			drawBitmapWithSizeAndRotation(number1, menuX + (menuWidth / 2) - 4, menuY + (menuHeight / 4) - (menuHeight / 8) + 20, menuWidth / 9, menuHeight / 9, 0);
		} else if(courtDisplayed == CourtOptions.Beach) {
			drawBitmapWithSizeAndRotation(number2, menuX + (menuWidth / 2) - 4, menuY + (menuHeight / 4) - (menuHeight / 8) + 20, menuWidth / 9, menuHeight / 9, 0);
		} else if(courtDisplayed == CourtOptions.Fence) {
			drawBitmapWithSizeAndRotation(number3, menuX + (menuWidth / 2) - 4, menuY + (menuHeight / 4) - (menuHeight / 8) + 20, menuWidth / 9, menuHeight / 9, 0);
		}

		const selectedColor = "yellow";
		const courtBox = {x: menuX + menuWidth / 2 - 46, y: menuY + 40, w: 90, h: 52};
		const sfxBox = {x: menuX + menuWidth / 2 - 135, y: menuY + 143, w: 108, h: 52};
		const musicBox = {x: menuX + menuWidth / 2 + 27, y: menuY + 143, w: 108, h: 52};

		if(selectedOption == Options.Court) {
			strokePath([{x: courtBox.x, y: courtBox.y},
					    {x: courtBox.x + courtBox.w, y: courtBox.y},
					    {x: courtBox.x + courtBox.w, y: courtBox.y + courtBox.h},
					    {x: courtBox.x, y: courtBox.y + courtBox.h}], selectedColor);
		} else if(selectedOption == Options.SFX) {
			strokePath([{x: sfxBox.x, y: sfxBox.y},
					    {x: sfxBox.x + sfxBox.w, y: sfxBox.y},
					    {x: sfxBox.x + sfxBox.w, y: sfxBox.y + sfxBox.h},
					    {x: sfxBox.x, y: sfxBox.y + sfxBox.h}], selectedColor);
		} else if(selectedOption == Options.Music) {
			strokePath([{x: musicBox.x, y: musicBox.y},
					    {x: musicBox.x + musicBox.w, y: musicBox.y},
					    {x: musicBox.x + musicBox.w, y: musicBox.y + musicBox.h},
					    {x: musicBox.x, y: musicBox.y + musicBox.h}], selectedColor);
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
	} else if(enterKey && mainStates.optionsOpen) {
		mainStates.menuOpen = false;
		mainStates.optionsOpen = false;
		enterKey = false;
		
		if((menuBallPos == MenuBall.Options) || (menuBallPos == MenuBall.Credits) || (menuBallPos == MenuBall.OnePlayer)) {
			menuBallPos = MenuBall.OnePlayer;
		} else if(menuBallPos == MenuBall.TwoPlayer) {
			menuBallPos = MenuBall.TwoPlayer;
		}

		resetGame();
	}
}

function getVolumeImage(volume) {
	const cleanVolume = Math.floor(volume * 10);
	switch(cleanVolume) {
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

function incrementMenuSelection() {
	if(mainStates.menuOpen) {
		if(menuBallPos == MenuBall.OnePlayer) {
			menuBallPos = MenuBall.TwoPlayer;
		} else if(menuBallPos == MenuBall.TwoPlayer) {
			menuBallPos = MenuBall.Options;
		} else if(menuBallPos == MenuBall.Options) {
			menuBallPos = MenuBall.Credits;
		} else if(menuBallPos == MenuBall.Credits) {
			menuBallPos = MenuBall.OnePlayer;
		}
	}
}

function decrementMenuSelection() {
	if(mainStates.menuOpen) {
		if(menuBallPos == MenuBall.OnePlayer) {
			menuBallPos = MenuBall.Credits;
		} else if(menuBallPos == MenuBall.TwoPlayer) {
			menuBallPos = MenuBall.OnePlayer;
		} else if(menuBallPos == MenuBall.Options) {
			menuBallPos = MenuBall.TwoPlayer;
		} else if(menuBallPos == MenuBall.Credits) {
			menuBallPos = MenuBall.Options;
		}
	}
}

function incrementOption() {
	if(selectedOption == Options.Court) {
		if(mainStates.optionsOpen) {
			if(courtDisplayed == CourtOptions.Indoor) {
				courtDisplayed = CourtOptions.Beach;
			} else if(courtDisplayed == CourtOptions.Beach) {
				courtDisplayed = CourtOptions.Fence;
			} else if(courtDisplayed == CourtOptions.Fence) {
				courtDisplayed = CourtOptions.Indoor;
			}
		}
	} else if(selectedOption == Options.SFX) {
		raiseSFXVolume();
	} else if(selectedOption == Options.Music) {
		raiseVolume(backgroundMusic);
	}
}

function decrementOption() {
	if(selectedOption == Options.Court) {
		if(mainStates.optionsOpen) {
			if(courtDisplayed == CourtOptions.Indoor) {
				courtDisplayed = CourtOptions.Fence;
			} else if(courtDisplayed == CourtOptions.Beach) {
				courtDisplayed = CourtOptions.Indoor;
			} else if(courtDisplayed == CourtOptions.Fence) {
				courtDisplayed = CourtOptions.Beach;
			}
		}
	} else if(selectedOption == Options.SFX) {
		lowerSFXVolume();
	} else if(selectedOption == Options.Music) {
		lowerVolume(backgroundMusic);
	}
}

function nextOption() {
	if(mainStates.optionsOpen) {
		if(selectedOption == Options.Court) {
			selectedOption = Options.SFX;
		} else if(selectedOption == Options.SFX) {
			selectedOption = Options.Music;
		} else if(selectedOption == Options.Music) {
			selectedOption = Options.Court;
		}
	} else if(mainStates.isPaused) {
		if(pauseBallPos == PauseBall.Resume) {
			pauseBallPos = PauseBall.Restart;
		} else if(pauseBallPos == PauseBall.Restart) {
			pauseBallPos = PauseBall.Options;
		} else if(pauseBallPos == PauseBall.Options) {
			pauseBallPos = PauseBall.MainMenu;
		} else if(pauseBallPos == PauseBall.MainMenu) {
			pauseBallPos = PauseBall.Resume;
		}
	}
}

function previousOption() {
	if(mainStates.optionsOpen) {
		if(selectedOption == Options.Court) {
			selectedOption = Options.Music;
		} else if(selectedOption == Options.SFX) {
			selectedOption = Options.Court;
		} else if(selectedOption == Options.Music) {
			selectedOption = Options.SFX;
		}
	} else if(mainStates.isPaused) {
		if(pauseBallPos == PauseBall.Resume) {
			pauseBallPos = PauseBall.MainMenu;
		} else if(pauseBallPos == PauseBall.Restart) {
			pauseBallPos = PauseBall.Resume;
		} else if(pauseBallPos == PauseBall.Options) {
			pauseBallPos = PauseBall.Restart;
		} else if(pauseBallPos == PauseBall.MainMenu) {
			pauseBallPos = PauseBall.Options;
		}
	}	
}

function resetGame() {
	if(menuBallPos == MenuBall.OnePlayer) {
		character1 = new playerClass(75, 220, false, true);
		character2 = new playerClass(1080, 220, true, false);
	} else if(menuBallPos == MenuBall.TwoPlayer) {
		character1 = new playerClass(75, 220, false, true);
		character2 = new playerClass(1080, 220, false, false);
	}

	setupInput();
	
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
