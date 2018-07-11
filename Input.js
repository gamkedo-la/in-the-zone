const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

const KEY_SPACE = 32;

var mouseX = 0;
var mouseY = 0;

function setupInput() {
	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

	character1.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_SPACE);
}


function keySet(keyEvent, setTo) {
	if(keyEvent.keyCode == character1.controlKeyLeft) {
		character1.keyHeld_West = setTo;
	}
	if(keyEvent.keyCode == character1.controlKeyRight) {
		character1.keyHeld_East = setTo;
	}
	if(keyEvent.keyCode == character1.controlKeyUp) {
		character1.keyHeld_North = setTo;
	}
	if(keyEvent.keyCode == character1.controlKeyDown) {
		character1.keyHeld_South = setTo;
	}
	if(keyEvent.keyCode == character1.controlShootKey) {
		character1.keyHeld_Shoot = setTo;
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
