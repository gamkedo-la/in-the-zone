var audioFormat;
var ballBouncing1 = new Audio();
var ballBouncing2 = new Audio();
var ballRebound1 = new Audio();
var ballRebound2 = new Audio();

function setAudioFormat(){
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


function loadAudios(){
   audios = [{
      name : ballBouncing1,
      source :"audio/basketball_bounce" + audioFormat
    },
    {
      name : ballBouncing2,
      source : "audio/basketball_bounce_ver2" + audioFormat
    },
    {
      name : ballRebound1,
      source :"audio/basketball_rebound" + audioFormat
    },
    {
      name : ballRebound2,
      source :"audio/basketball_rebound_ver2" + audioFormat
    }]


  console.log(audioFormat);
  console.log(audios[1].source);
  for (var i = 0; i < audios.length; i++) {
    audios[i].name.src = audios[i].source;
  }
  console.log(ballRebound1.source);
}
