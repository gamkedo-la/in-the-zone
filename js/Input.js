const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;
const KEY_BACKSPACE = 8;

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

const KEY_SPACE = 32;
const KEY_X = 88;
const KEY_P = 80;

const KEY_ESC = 27;

//used with Main Menu
const KEY_ENTER = 13;

//used on Options Screen
const KEY_PLUS = 187;
const KEY_MINUS = 189;

var mouseX = 0;
var mouseY = 0;

var escKey;

//used with Main Menu
var enterKey;
var backspaceKey;
var upArrowKey;
var downArrowKey;

function setupInput() {
	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);
	if (!character1.isAI && !character2.isAI) {
		console.log("both are not ai");
		character1.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_SPACE);
		character2.setupInput(KEY_W, KEY_D, KEY_S, KEY_A, KEY_X);
	} else if ((character1.isAI) && (!character2.isAI)) {
		character2.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_SPACE);
	} else if ((character2.isAI) && (!character1.isAI)) {
		character1.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_SPACE);
	}
}


function keySet(keyEvent, setTo) {
	if((mainStates.menuOpen) && (setTo)) {
		if(keyEvent.keyCode == KEY_RIGHT_ARROW) {
			moveSelectionRight();
		} else if(keyEvent.keyCode == KEY_DOWN_ARROW) {
			moveSelectionDown();
		} else if(keyEvent.keyCode == KEY_LEFT_ARROW) {
			moveSelectionLeft();
		} else if(keyEvent.keyCode == KEY_UP_ARROW) {
			moveSelectionUp();
		} else if(keyEvent.keyCode == KEY_ENTER) {
			enterKey = setTo;
		}
	} else if((mainStates.optionsOpen) && (setTo)) {
		if((keyEvent.keyCode == KEY_RIGHT_ARROW) || (keyEvent.keyCode == KEY_DOWN_ARROW)) {
			nextOption();
		} else if((keyEvent.keyCode == KEY_LEFT_ARROW) || (keyEvent.keyCode == KEY_UP_ARROW)) {
			previousOption();
		} else if(keyEvent.keyCode == KEY_ENTER) {
			enterKey = setTo;
		} else if(keyEvent.keyCode == KEY_PLUS) {
			incrementOption();
		} else if(keyEvent.keyCode == KEY_MINUS) {
			decrementOption();
		} else if(keyEvent.keyCode == KEY_BACKSPACE) {
			backspaceKey = setTo;
		}
	} else if(mainStates.creditsOpen) {
		if(keyEvent.keyCode == KEY_BACKSPACE && setTo) {
			backspaceKey = setTo;
		} else if(keyEvent.keyCode == KEY_UP_ARROW) {
			upArrowKey = setTo;
		} else if(keyEvent.keyCode == KEY_DOWN_ARROW) {
			downArrowKey = setTo;
		}
	} else if((mainStates.gameOver) && (setTo)){
		if((keyEvent.keyCode == KEY_RIGHT_ARROW) || (keyEvent.keyCode == KEY_DOWN_ARROW)) {
			nextOption();
		} else if((keyEvent.keyCode == KEY_LEFT_ARROW) || (keyEvent.keyCode == KEY_UP_ARROW)) {
			previousOption();
		} else if(keyEvent.keyCode == KEY_ENTER) {
			enterKey = setTo;
		}
	} else if((mainStates.isPaused) && (setTo)) {
		if((keyEvent.keyCode == KEY_RIGHT_ARROW) || (keyEvent.keyCode == KEY_DOWN_ARROW)) {
			nextOption();
		} else if((keyEvent.keyCode == KEY_LEFT_ARROW) || (keyEvent.keyCode == KEY_UP_ARROW)) {
			previousOption();
		} else if(keyEvent.keyCode == KEY_ENTER) {
			enterKey = setTo;
		}
	} else if (keyEvent.keyCode == KEY_ESC) {
		escKey = setTo;
	} else if (keyEvent.keyCode == KEY_ENTER) {
		enterKey = setTo;
	} else if (keyEvent.keyCode == KEY_P) {
		if (setTo === true) {
			setPaused(!mainStates.isPaused);
		}
	} else if (keyEvent.keyCode == character1.controlKeyLeft) {
		character1.keyHeld_West = setTo;
	} else if (keyEvent.keyCode == character1.controlKeyRight) {
		character1.keyHeld_East = setTo;
	} else if (keyEvent.keyCode == character1.controlKeyUp) {
		character1.keyHeld_North = setTo;
	} else if (keyEvent.keyCode == character1.controlKeyDown) {
		character1.keyHeld_South = setTo;
	} else if (keyEvent.keyCode == character1.controlShootKey) {
		character1.keyHeld_Shoot = setTo;
	} else if (keyEvent.keyCode == character2.controlKeyLeft) {
		character2.keyHeld_West = setTo;
	} else if (keyEvent.keyCode == character2.controlKeyRight) {
		character2.keyHeld_East = setTo;
	} else if (keyEvent.keyCode == character2.controlKeyUp) {
		character2.keyHeld_North = setTo;
	} else if (keyEvent.keyCode == character2.controlKeyDown) {
		character2.keyHeld_South = setTo;
	} else if (keyEvent.keyCode == character2.controlShootKey) {
		character2.keyHeld_Shoot = setTo;
	}
}

function keyPressed(evt) {
	// console.log("Key pressed: "+evt.keyCode);
	keySet(evt, true);

	evt.preventDefault();
}

function keyReleased(evt) {
	// console.log("Key pressed: "+evt.keyCode);
	keySet(evt, false);
}