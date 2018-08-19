var basketballCourt = document.createElement("img");
var beachBasketballCourt = document.createElement("img");
var fenceBasketballCourt = document.createElement("img");
var inTheZoneLogo = document.createElement("img");
var player1 = document.createElement("img");
var player2 = document.createElement("img");
var currySpriteSheet = document.createElement("img");
var curry2SpriteSheet = document.createElement("img");
var player1Animated = document.createElement("img");
var player2Animated = document.createElement("img");
var dunkingPic = document.createElement("img");
var player1DunkingSpriteSheet = document.createElement("img");
var player2DunkingSpriteSheet = document.createElement("img");
var dustParticle = document.createElement("img");
var sparkParticle = document.createElement("img");
var fireParticle = document.createElement("img");
var smokeParticle = document.createElement("img");
var gameOverSadPicture = document.createElement("img");
var shootingLeftSpriteSheet = document.createElement("img");
var shootingRightSpriteSheet = document.createElement("img");
var shootingLeftSpriteSheet2 = document.createElement("img");
var shootingRightSpriteSheet2 = document.createElement("img");
var player1Victory = document.createElement("img");
var player2Victory = document.createElement("img");
var crowdSpriteSheet = document.createElement("img");

var scoreboard = document.createElement("img");
var number0 = document.createElement("img");
var number1 = document.createElement("img");
var number2 = document.createElement("img");
var number3 = document.createElement("img");
var number4 = document.createElement("img");
var number5 = document.createElement("img");
var number6 = document.createElement("img");
var number7 = document.createElement("img");
var number8 = document.createElement("img");
var number9 = document.createElement("img");

var optionsScoreboard = document.createElement("img");

var ballTrailImage = document.createElement("img");
var ballImage = document.createElement("img");
var ballShineImage = document.createElement("img");
var ballShadowImage = document.createElement("img");
var spotlightImage = document.createElement("img");

var worldPics = [];

var picsToLoad = 0; // set automatically based on imageList in loadImages()

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	console.log(picsToLoad);
	if (picsToLoad == 0) {
		imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName) {
	// console.log(imgVar);
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "images/" + fileName;
}

function loadImageForWorldCode(worldCode, fileName) {
	worldPics[worldCode] = document.createElement("img");
	beginLoadingImage(worldPics[worldCode], fileName);
}


function loadImages() {
	var imageList = [
		{ varName: basketballCourt, theFile: "court.png" },
		{ varName: beachBasketballCourt, theFile: "courtBeach.png" },
		{ varName: fenceBasketballCourt, theFile: "courtChainLink.png" },
		{ varName: inTheZoneLogo, theFile: "InTheZoneLogo.png" },
		{ varName: crowdSpriteSheet, theFile: "crowdSpriteSheet.png" },

		{ varName: player1, theFile: "player1.png" },
		{ varName: player2, theFile: "player2.png" },
		{ varName: currySpriteSheet, theFile: "currySpriteSheet.png" },
		{ varName: curry2SpriteSheet, theFile: "curry2SpriteSheet.png" },
		{ varName: player1Animated, theFile: "player1_animated.png" },
		{ varName: player2Animated, theFile: "player2_animated.png" },
		{ varName: dunkingPic, theFile: "tempDunking.png" },
		{ varName: player1DunkingSpriteSheet, theFile: "player1DunkingSpriteSheet.png" },
		{ varName: player2DunkingSpriteSheet, theFile: "player2DunkingSpriteSheet.png" },
		{ varName: shootingLeftSpriteSheet, theFile: "shootingLeftSpriteSheet.png" },
		{ varName: shootingRightSpriteSheet, theFile: "shootingRightSpriteSheet.png" },
		{ varName: shootingLeftSpriteSheet2, theFile: "shootingLeftSpriteSheet2.png" },
		{ varName: shootingRightSpriteSheet2, theFile: "shootingRightSpriteSheet2.png" },
		{ varName: player1Victory, theFile: "player1Victory.png" },
		{ varName: player2Victory, theFile: "player2Victory.png" },
		{ varName: gameOverSadPicture, theFile: "gameOverSadPicture.png" },


		{ varName: scoreboard, theFile: "scoreboard.png" },
		{ varName: number0, theFile: "0.png" },
		{ varName: number1, theFile: "1.png" },
		{ varName: number2, theFile: "2.png" },
		{ varName: number3, theFile: "3.png" },
		{ varName: number4, theFile: "4.png" },
		{ varName: number5, theFile: "5.png" },
		{ varName: number6, theFile: "6.png" },
		{ varName: number7, theFile: "7.png" },
		{ varName: number8, theFile: "8.png" },
		{ varName: number9, theFile: "9.png" },

		{ varName: optionsScoreboard, theFile: "optionsScoreboard.png" },

		{ varName: dustParticle, theFile: "dustParticle.png" },
		{ varName: sparkParticle, theFile: "sparkParticle.png" },
		{ varName: fireParticle, theFile: "fireParticle.png" },
		{ varName: smokeParticle, theFile: "smokeParticle.png" },
		{ varName: ballTrailImage, theFile: "ballTrail.png" },
		{ varName: ballImage, theFile: "ball.png" },
		{ varName: ballShineImage, theFile: "ball_shine_and_shadow.png" },
		{ varName: ballShadowImage, theFile: "shadow.png" },
		{ varName: spotlightImage, theFile: "spotlight.png" },

	];



	picsToLoad = imageList.length;

	for (var i = 0; i < imageList.length; i++) {
		if (imageList[i].varName != undefined) {
			beginLoadingImage(imageList[i].varName, imageList[i].theFile);
		} else {
			loadImageForWorldCode(imageList[i].worldType, imageList[i].theFile);
		}
	}
}
