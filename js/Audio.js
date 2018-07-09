var audioFormat;
var ballBouncing1 = new Audio();
var ballBouncing2 = new Audio();
var ballRebound1 = new Audio();
var ballRebound2 = new Audio();

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

function setAudioFormat() {
  var audio = new Audio();
  if (audio.canPlayType) {
    if (audio.canPlayType("audio/mp3")) {
      console.log("ses");
      audioFormat = ".mp3";
    } else {
      audioFormat = ".ogg";
    }
  }
}
var audios = [{}];


function loadAudios() {
  audios = [{
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
  }


  ];


  console.log(audioFormat);
  console.log(audios[1].source);
  for (var i = 0; i < audios.length; i++) {
    audios[i].name.src = audios[i].source;
  }
  console.log(ballRebound1.source);
}
