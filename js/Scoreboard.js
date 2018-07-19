const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const SCOREBOARD_X = CANVAS_WIDTH - 50;
const SCOREBOARD_Y = 32;

const PLAYER1_TENS_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH - 88;
const PLAYER1_TENS_PLACE_NUMBER_POSITION_Y = 50;
const PLAYER1_ONES_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH - 70;
const PLAYER1_ONES_PLACE_NUMBER_POSITION_Y = 50;

const PLAYER2_TENS_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH - 31;
const PLAYER2_TENS_PLACE_NUMBER_POSITION_Y = 50;
const PLAYER2_ONES_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH - 13;
const PLAYER2_ONES_PLACE_NUMBER_POSITION_Y = 50;

const TIMER_MIN_TENS_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH-76;
const TIMER_Y = 16;
const TIMER_MIN_ONES_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH-63;
const TIMER_SEC_TENS_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH-37;
const TIMER_SEC_ONES_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH-24
var min = 0;
var sec = 30;
var frameNumber= 0;
var numberArray = [number0,number1,number2,number3,number4,number5,number6,number7,number8,number9];

function drawScoreboard(){
  //console.log(numberArray[1]);
  var player1TensPlace =  Math.floor(character1.score/10);
  var player1OnesPlace = character1.score % 10;
  //console.log(player1TensPlace);

  var player2TensPlace = Math.floor(character2.score/10);
  var player2OnesPlace = character2.score % 10;
  frameNumber++;
  if (frameNumber % 30 == 0) {
    frameNumber = 0;
    if (sec == 0 && min == 0) {
      min = 0;
      sec = 0;
      mainStates.inGame = false;
      mainStates.gameOver = true;
      console.log("time is up");
    }
    else {
      sec--;
    }
  }
  //console.log(sec);
 //console.log(min);
  if (sec <= 0 && min>= 1) {
    sec = 59;
    min--;
  }


  var minuteTensPlace =  Math.floor(min/10);
  var minuteOnesPlace = min % 10;
  //console.log(player1TensPlace);

  var secondTensPlace = Math.floor(sec/10);
  var secondOnesPlace = sec % 10;
  drawBitmapCenteredWithRotation(scoreboard,SCOREBOARD_X,SCOREBOARD_Y,0);

  drawBitmapCenteredWithRotation(numberArray[player1TensPlace],PLAYER1_TENS_PLACE_NUMBER_POSITION_X,PLAYER1_TENS_PLACE_NUMBER_POSITION_Y,0);
  drawBitmapCenteredWithRotation(numberArray[player1OnesPlace],PLAYER1_ONES_PLACE_NUMBER_POSITION_X,PLAYER1_ONES_PLACE_NUMBER_POSITION_Y,0);

  drawBitmapCenteredWithRotation(numberArray[player2TensPlace],PLAYER2_TENS_PLACE_NUMBER_POSITION_X,PLAYER2_TENS_PLACE_NUMBER_POSITION_Y,0);
  drawBitmapCenteredWithRotation(numberArray[player2OnesPlace],PLAYER2_ONES_PLACE_NUMBER_POSITION_X,PLAYER2_ONES_PLACE_NUMBER_POSITION_Y,0);

  drawBitmapCenteredWithRotation(numberArray[minuteTensPlace],TIMER_MIN_TENS_PLACE_NUMBER_POSITION_X,TIMER_Y,0);
  drawBitmapCenteredWithRotation(numberArray[minuteOnesPlace],TIMER_MIN_ONES_PLACE_NUMBER_POSITION_X,TIMER_Y,0);

  drawBitmapCenteredWithRotation(numberArray[secondTensPlace],TIMER_SEC_TENS_PLACE_NUMBER_POSITION_X,TIMER_Y,0);
  drawBitmapCenteredWithRotation(numberArray[secondOnesPlace],TIMER_SEC_ONES_PLACE_NUMBER_POSITION_X,TIMER_Y,0);
 }
