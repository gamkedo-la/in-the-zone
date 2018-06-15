var basketballCourt = document.createElement("img");
var player1 = document.createElement("img");
var player2 = document.createElement("img");
var player3 = document.createElement("img");
var player4 = document.createElement("img");
var player5 = document.createElement("img");
var player6 = document.createElement("img");
var player7 = document.createElement("img");
var player8 = document.createElement("img");
var player9 = document.createElement("img");
var player10 = document.createElement("img");
var player11 = document.createElement("img");
var player12 = document.createElement("img");


var worldPics = [];

var picsToLoad = 0; // set automatically based on imageList in loadImages()

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	console.log(picsToLoad);
	if(picsToLoad == 0) {
		imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName) {
	console.log(imgVar);
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "images/"+fileName;
}

function loadImageForWorldCode(worldCode, fileName) {
	worldPics[worldCode] = document.createElement("img");
	beginLoadingImage(worldPics[worldCode], fileName);
}


function loadImages() {
	var imageList = [
		{varName: basketballCourt, theFile: "court.png"},

    {varName: player1, theFile:"player1.png"},
    {varName: player2, theFile:"player2.png"},
    {varName: player3, theFile:"player3.png"},
    {varName: player4, theFile:"player4.png"},
    {varName: player5, theFile:"player5.png"},
    {varName: player6, theFile:"player6.png"},
    {varName: player7, theFile:"player7.png"},
    {varName: player8, theFile:"player8.png"},
    {varName: player9, theFile:"player9.png"},
    {varName: player10, theFile:"player10.png"},
    {varName: player11, theFile:"player11.png"},
    {varName: player12, theFile:"player12.png"}
		];



	picsToLoad = imageList.length;

	for(var i=0;i<imageList.length;i++) {
		if(imageList[i].varName != undefined) {
			beginLoadingImage(imageList[i].varName, imageList[i].theFile);
		} else {
			loadImageForWorldCode(imageList[i].worldType, imageList[i].theFile);
		}
	}
}
