var basketballCourt = document.createElement("img");
var player1 = document.createElement("img");
var currySpriteSheet = document.createElement("img");

var dustParticle = document.createElement("img");
var sparkParticle = document.createElement("img");
var fireParticle = document.createElement("img");
var smokeParticle = document.createElement("img");

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

		{ varName: player1, theFile: "player1.png" },
		{varName: currySpriteSheet, theFile : "currySpriteSheet.png"},

		{ varName: dustParticle, theFile: "dustParticle.png" },
		{ varName: sparkParticle, theFile: "sparkParticle.png" },
		{ varName: fireParticle, theFile: "fireParticle.png" },
		{ varName: smokeParticle, theFile: "smokeParticle.png" },

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
