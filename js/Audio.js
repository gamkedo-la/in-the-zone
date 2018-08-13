var audioFormat;
var ballBouncing1 = new Audio();
var ballBouncing2 = new Audio();
var ballRebound1 = new Audio();
var ballRebound2 = new Audio();
var ballGrab = new Audio();
var shootingBall = new Audio();

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
  {
    name: ballBouncing1,
    source: "audio/basketball_bounce" + audioFormat
  },
  {
    name: ballBouncing2,
    source: "audio/basketball_bounce_ver2" + audioFormat
  },
  {
    name: ballRebound1,
    source: "audio/basketball_rebound" + audioFormat
  },
  {
    name: ballRebound2,
    source: "audio/basketball_rebound_ver2" + audioFormat
  },
  {
    name: ballGrab,
    source: "audio/ballGrab" + audioFormat
  },
  {
    name: shootingBall,
    source: "audio/shootingBall" + audioFormat
  },
  {
    name: shoe1,
    source: "audio/shoe-1" + audioFormat
  },
  {
    name: shoe2,
    source: "audio/shoe-2" + audioFormat
  },
  {
    name: shoe3,
    source: "audio/shoe-3" + audioFormat
  },
  {
    name: shoe4,
    source: "audio/shoe-4" + audioFormat
  },
  {
    name: shoe5,
    source: "audio/shoe-5" + audioFormat
  },
  {
    name: shoe6,
    source: "audio/shoe-6" + audioFormat
  },
  {
    name: shoe7,
    source: "audio/shoe-7" + audioFormat
  },
  {
    name: shoe8,
    source: "audio/shoe-8" + audioFormat
  },
  {
    name: shoe9,
    source: "audio/shoe-9" + audioFormat
  },
  {
    name: shoe10,
    source: "audio/shoe-10" + audioFormat
  },
  {
    name: backgroundMusic,
    source: "audio/Sweet Georgia Brown" + audioFormat
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
