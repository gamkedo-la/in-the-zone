const CANVAS_WIDTH = 1152;
const CANVAS_HEIGHT = 720;

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

const TIMER_MIN_TENS_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH - 76;
const TIMER_Y = 16;
const TIMER_MIN_ONES_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH - 63;
const TIMER_SEC_TENS_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH - 37;
const TIMER_SEC_ONES_PLACE_NUMBER_POSITION_X = CANVAS_WIDTH - 24;

const SUDDEN_DEATH_MAX_TIME_TO_SHOW_TEXT = 90; // 3 Seconds

var min = 1;
var sec = 0;

var frameNumber = 0;
var numberArray = [number0, number1, number2, number3, number4, number5, number6, number7, number8, number9];
var player1Score = 0;
var player2Score = 0;
var suddenDeathOvertime = false;
var suddenDeathTextCounter = 0;

function drawScoreboard() {
  var player1TensPlace = Math.floor(player1Score / 10);
  var player1OnesPlace = player1Score % 10;

  var player2TensPlace = Math.floor(player2Score / 10);
  var player2OnesPlace = player2Score % 10;
  if (!mainStates.inGame) {
    mainStates.demo = true;
  }
  else {
    mainStates.demo = false;
  }

  if (player1Score >= 100 || player2Score >= 100) {
    mainStates.gameOver = true;
    //console.log("GameOver 1");
    suddenDeathOvertime = false;
    mainStates.demo = false;
    mainStates.inGame = false;
    setPaused(false);
    mainStates.menuOpen = false;
  }

  if (mainStates.isPaused === false) {
    frameNumber++;
    if (frameNumber % 30 == 0) {
      frameNumber = 0;
      if ((sec == 0 && min == 0) && (!GameMode.AroundTheWorld) && !mainStates.demo && mainStates.inGame) {
        min = 0;
        sec = 0;

        if (player1Score == player2Score) {
          suddenDeathOvertime = true;
        } else {
          mainStates.inGame = false;
          mainStates.gameOver = true;
		  //console.log("GameOver 2");
          suddenDeathOvertime = false;
          setPaused(false);
        }

      } else if(GameMode.AroundTheWorld) {
	      sec++;

	      if(sec > 59) {
		      sec = 0;
		      min++;
	      }
      } else {
        sec--;

	    if (sec <= 0 && min >= 1) {
			sec = 59;
	    	min--;
		}
      }
    }
  }

  if(mainStates.demo && sec == 0) {
    sec = 30;
  }

  var minuteTensPlace = Math.floor(min / 10);
  var minuteOnesPlace = min % 10;

  var secondTensPlace = Math.floor(sec / 10);
  var secondOnesPlace = sec % 10;
  drawBitmapCenteredWithRotation(scoreboard, SCOREBOARD_X, SCOREBOARD_Y, 0);

  if (player1Score < 100 && player2Score < 100) {
    drawBitmapCenteredWithRotation(numberArray[player1TensPlace], PLAYER1_TENS_PLACE_NUMBER_POSITION_X, PLAYER1_TENS_PLACE_NUMBER_POSITION_Y, 0);
    drawBitmapCenteredWithRotation(numberArray[player1OnesPlace], PLAYER1_ONES_PLACE_NUMBER_POSITION_X, PLAYER1_ONES_PLACE_NUMBER_POSITION_Y, 0);

    drawBitmapCenteredWithRotation(numberArray[player2TensPlace], PLAYER2_TENS_PLACE_NUMBER_POSITION_X, PLAYER2_TENS_PLACE_NUMBER_POSITION_Y, 0);
    drawBitmapCenteredWithRotation(numberArray[player2OnesPlace], PLAYER2_ONES_PLACE_NUMBER_POSITION_X, PLAYER2_ONES_PLACE_NUMBER_POSITION_Y, 0);
  }

  drawBitmapCenteredWithRotation(numberArray[minuteTensPlace], TIMER_MIN_TENS_PLACE_NUMBER_POSITION_X, TIMER_Y, 0);
  drawBitmapCenteredWithRotation(numberArray[minuteOnesPlace], TIMER_MIN_ONES_PLACE_NUMBER_POSITION_X, TIMER_Y, 0);

  drawBitmapCenteredWithRotation(numberArray[secondTensPlace], TIMER_SEC_TENS_PLACE_NUMBER_POSITION_X, TIMER_Y, 0);
  drawBitmapCenteredWithRotation(numberArray[secondOnesPlace], TIMER_SEC_ONES_PLACE_NUMBER_POSITION_X, TIMER_Y, 0);
}

function drawSuddenDeathText() {
  var whereToPutText1X = (canvas.width / 2) - 170;
  var whereToPutText1Y = canvas.height / 2;
  var whereToPutText2X = (canvas.width / 2) - 120;
  var whereToPutText2Y = canvas.height / 2 + 50;

  if (suddenDeathTextCounter < SUDDEN_DEATH_MAX_TIME_TO_SHOW_TEXT) {
    suddenDeathTextCounter++;
    colorText("Sudden Death Overtime:", whereToPutText1X, whereToPutText1Y, 'white', '40');
    colorText("Next Basket Wins!", whereToPutText2X, whereToPutText2Y, 'white', '40');
  } else {
    return;
  }
}
