var audioFormat;
var ballBouncing1 = new Audio();
var ballBouncing2 = new Audio();
var ballRebound1 = new Audio();
var ballRebound2 = new Audio();
var ballGrab = new Audio();
var shootingBall = new Audio();
var splash = new Audio();
var chainLinkFence = new Audio();
var crowdCheer = new Audio();
var player1DunkSound = new Audio();
var player2DunkSound = new Audio();
var wayOff = new Audio();
var ooLucky = new Audio();
var ooSoClose = new Audio();
var lucky = new Audio();
var mmAw = new Audio();
var mmYeah = new Audio();
var notEvenClose = new Audio();
var clockTick = new Audio();
var horn = new Audio();

// floor shoe squeaks
var shoe1 = new Audio();
var shoe2 = new Audio();
var shoe3 = new Audio();
var shoe4 = new Audio();
var shoe5 = new Audio();
var shoe6 = new Audio();
var shoe7 = new Audio();
var shoe8 = new Audio();
var shoe9 = new Audio();
var shoe10 = new Audio();
// an array for easy random
var shoeSounds = [shoe1, shoe2, shoe3, shoe4, shoe5, shoe6, shoe7, shoe8, shoe9, shoe10];

var backgroundMusic = new Audio();
var fenceMusic = new Audio();

function setAudioFormat() {
  var audio = new Audio();
  if (audio.canPlayType) {
    if (audio.canPlayType("audio/ogg") != "") {
      audioFormat = ".ogg";
    } else {
      audioFormat = ".mp3";
    }
  }
}
var audios = [{}];


function loadAudios() {
  audios = [
  {//0
    name: ballBouncing1,
    source: "audio/basketball_bounce" + audioFormat
  },
  {//1
    name: ballBouncing2,
    source: "audio/basketball_bounce_ver2" + audioFormat
  },
  {//2
    name: ballRebound1,
    source: "audio/basketball_rebound" + audioFormat
  },
  {//3
    name: ballRebound2,
    source: "audio/basketball_rebound_ver2" + audioFormat
  },
  {//4
    name: ballGrab,
    source: "audio/ballGrab" + audioFormat
  },
  {//5
    name: shootingBall,
    source: "audio/shootingBall" + audioFormat
  },
  {//6
    name: shoe1,
    source: "audio/shoe-1" + audioFormat
  },
  {//7
    name: shoe2,
    source: "audio/shoe-2" + audioFormat
  },
  {//8
    name: shoe3,
    source: "audio/shoe-3" + audioFormat
  },
  {//9
    name: shoe4,
    source: "audio/shoe-4" + audioFormat
  },
  {//10
    name: shoe5,
    source: "audio/shoe-5" + audioFormat
  },
  {//11
    name: shoe6,
    source: "audio/shoe-6" + audioFormat
  },
  {//12
    name: shoe7,
    source: "audio/shoe-7" + audioFormat
  },
  {//13
    name: shoe8,
    source: "audio/shoe-8" + audioFormat
  },
  {//14
    name: shoe9,
    source: "audio/shoe-9" + audioFormat
  },
  {//15
    name: shoe10,
    source: "audio/shoe-10" + audioFormat
  },
  {//16
    name: backgroundMusic,
    source: "audio/Sweet Georgia Brown" /* or audio/fenceMusic */ + audioFormat
  },
  {
    name: chainLinkFence,
    source: "audio/chainLinkFence" + audioFormat
  },
  {
    name: splash,
    source: "audio/splash" + audioFormat
  },
  {
    name: crowdCheer,
    source: "audio/crowdCheer" + audioFormat
  },
  {
    name: player1DunkSound,
    source: "audio/player1DunkSound" + audioFormat
  },
  {
    name: player2DunkSound,
    source: "audio/player2DunkSound" + audioFormat
  },
  {
    name: wayOff,
    source: "audio/wayOff" + audioFormat
  },
  {
    name: ooLucky,
    source: "audio/ooLucky" + audioFormat
  },
  {
    name: ooSoClose,
    source: "audio/ooSoClose" + audioFormat
  },
  {
    name: lucky,
    source: "audio/lucky" + audioFormat
  },
  {
    name: mmAw,
    source: "audio/mmAw" + audioFormat
  },
  {
    name: mmYeah,
    source: "audio/mmYeah" + audioFormat
  },
  {
    name: notEvenClose,
    source: "audio/notEvenClose" + audioFormat
  },
  {
    name: clockTick,
    source: "audio/clockTick" + audioFormat
  },
  {
    name: horn,
    source: "audio/horn" + audioFormat
  }


  ];

  for (var i = 0; i < audios.length; i++) {
    audios[i].name.src = audios[i].source;
  }
}

function playAndLoopMusic(music){
  music.play();
  music.loop = true;
}

function pauseMusic(music) {
	music.pause();
}

function raiseVolume(music) {
	if(music.volume <= 0.9) {
		music.volume += 0.1;
	}
}

function lowerVolume(music) {
	if(music.volume >= 0.1) {
		music.volume -= 0.1;
	}
}

function getMusicVolume(music) {
	return music.volume;
}

function getSFXVolume() {
	return audios[0].name.volume;
}

function raiseSFXVolume() {
	for(let i = 0; i < audios.length; i++) {
		if(audios[i].source != ("audio/Sweet Georgia Brown" + audioFormat)) {
			if(audios[i].name.volume <= 0.9) {
				audios[i].name.volume += 0.1;
			}
		}
	}
}

function lowerSFXVolume() {
	for(let i = 0; i < audios.length; i++) {
		if(audios[i].source != ("audio/Sweet Georgia Brown" + audioFormat)) {
			if(audios[i].name.volume >= 0.1) {
				audios[i].name.volume -= 0.1;
			}
		}
	}
}
