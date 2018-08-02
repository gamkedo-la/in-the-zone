const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

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

var mouseX = 0;
var mouseY = 0;

var escKey;

//used with Main Menu
var enterKey;

function setupInput() {
	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);
	if (!character1.isAI && !character2.isAI) {
		console.log("both are not ai");
		character1.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_SPACE);
		character2.setupInput(KEY_W, KEY_D, KEY_S, KEY_A, KEY_X);
	} else if (character1.isAI) {
		character2.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_SPACE);
	} else if (character2.isAI) {
		character1.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_SPACE);
	}
}


function keySet(keyEvent, setTo) {
	if (keyEvent.keyCode == KEY_ESC) {
		escKey = setTo;
	}
	if (keyEvent.keyCode == KEY_ENTER) {
		enterKey = setTo;
	}
	if (keyEvent.keyCode == KEY_P) {
		if (setTo === true) {
			mainStates.isPaused = !mainStates.isPaused;
		}
	}
	if (keyEvent.keyCode == character1.controlKeyLeft) {
		character1.keyHeld_West = setTo;
	}
	if (keyEvent.keyCode == character1.controlKeyRight) {
		character1.keyHeld_East = setTo;
	}
	if (keyEvent.keyCode == character1.controlKeyUp) {
		character1.keyHeld_North = setTo;
	}
	if (keyEvent.keyCode == character1.controlKeyDown) {
		character1.keyHeld_South = setTo;
	}
	if (keyEvent.keyCode == character1.controlShootKey) {
		character1.keyHeld_Shoot = setTo;
	}

	if (keyEvent.keyCode == character2.controlKeyLeft) {
		character2.keyHeld_West = setTo;
	}
	if (keyEvent.keyCode == character2.controlKeyRight) {
		character2.keyHeld_East = setTo;
	}
	if (keyEvent.keyCode == character2.controlKeyUp) {
		character2.keyHeld_North = setTo;
	}
	if (keyEvent.keyCode == character2.controlKeyDown) {
		character2.keyHeld_South = setTo;
	}
	if (keyEvent.keyCode == character2.controlShootKey) {
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