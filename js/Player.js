const PLAYER_MOVE_SPEED = 5.0;
const PLAYER_MOVE_SPEED_CHANGE = 3.0
var currentFrame = 0;
var distanceToTheClosestBall;
//

function playerClass(startingX, startingY, isAI) {
	this.x = startingX;
	this.y = startingY;
	this.myWarriorPic; // which picture to use
	// this.facingDirection= 2;//0 = north, 1 = east, 2 = south, 3 = west,4=ne, 5 = se, 6 = sw, 7 = nw
	this.ang;
	this.isAI = isAI;
	this.ballToHold;
	this.inShootingMotion = false;
	this.shootingTime = 0;
	this.ballToChase; // it is for ai

	this.width = 64;
	this.height = 64;
	this.tickCount = 0;
	this.ticksPerFrame = 5;
	this.frameRow = 0;
	this.framesAnim = 10;
	this.walkSprite = new SpriteSheetClass(currySpriteSheet,this.width, this.height);

	this.states = {
		isIdle: true,
		isShooting: false
	};

	if (!this.isAI) {
		this.keyHeld_North = false;
		this.keyHeld_South = false;
		this.keyHeld_West = false;
		this.keyHeld_East = false;
		this.keyHeld_Shoot = false;

		this.controlKeyUp;
		this.controlKeyRight;
		this.controlKeyDown;
		this.controlKeyLeft;
		this.controlShootKey;

		this.setupInput = function (upKey, rightKey, downKey, leftKey, shootKey) {
			this.controlKeyUp = upKey;
			this.controlKeyRight = rightKey;
			this.controlKeyDown = downKey;
			this.controlKeyLeft = leftKey;
			this.controlShootKey = shootKey;
		}

	}

	this.incrementTick = function () {

		this.tickCount++;

		if (this.tickCount / this.ticksPerFrame >= this.framesAnim) {
			this.tickCount = 0;
		}
	};


	this.move = function () {
		// console.log(this.ballToHold);
		var nextX = this.x;
		var nextY = this.y;
		// currentFrame++;
		// console.log(currentFrame);

		if (nextX > canvas.width) {
			nextX = canvas.width;
		}
		if (nextX < 0) {
			nextX = 0;
		}
		if (nextY > canvas.height) {
			nextY = canvas.height;
		}
		if (nextY < 0) {
			nextY = 0;
		}

		this.previousfacingDirection = this.facingDirection;

		if (!this.isAI) {

			if (this.keyHeld_North) {
				nextY -= PLAYER_MOVE_SPEED;
				this.facingDirection = 0;
			}
			if (this.keyHeld_East) {
				nextX += PLAYER_MOVE_SPEED;
				this.facingDirection = 1;
			}
			if (this.keyHeld_South) {
				nextY += PLAYER_MOVE_SPEED;
				this.facingDirection = 2;
			}
			if (this.keyHeld_West) {
				nextX -= PLAYER_MOVE_SPEED;
				this.facingDirection = 3;
			}
			// if(this.keyHeld_West && this.keyHeld_North) {
			//   this.facingDirection = 7;
			// }
			// if(this.keyHeld_West && this.keyHeld_South) {
			//   this.facingDirection = 6;
			// }
			// if(this.keyHeld_East && this.keyHeld_North) {
			//   this.facingDirection = 4;
			// }
			// if(this.keyHeld_East && this.keyHeld_South) {
			//   this.facingDirection = 5;
			// }

			if (this.keyHeld_Shoot && this.ballToHold != null) {
	      this.shootingTime++;
				this.states.isShooting = true;
				this.states.isIdle = false;
				if (this.shootingTime > 25) {
					this.shootingTime = 25;
				}
				if (this.shootingTime > 15) {
					this.tickCount = 25;
				}
	    }
			else {
				if (this.tickCount == 0) {
					this.states.isShooting = false;
					this.states.isIdle = true;
				}
				if (this.shootingTime > 0) {
					this.ballToHold.beingShot = true;
					this.ballToHold.isHeld = false;
					this.ballToHold.isHeldBy = null;
					// console.log(this.ballToHold.x);
					// console.log(HOOP_X);
					var a = HOOP_X - this.x;
					var b = HOOP_Y - this.y;
					this.ballToHold.startingDistanceFromHoop = Math.sqrt(a * a + b * b);
					var random = Math.floor(Math.random() * 10) + 1;
					if (this.shootingTime >= 10 && this.shootingTime <= 15) {
						this.tickCount = 35;
						this.ballToHold.goingIn = true;
						var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
						this.ballToHold.ballPower = -16;
						console.log("perfect");
					}
					else if (this.shootingTime < 10) {
						// console.log(this.shootingTime);
						// console.log(random);
						this.tickCount = 35;
						if (random < this.shootingTime) {
							this.ballToHold.goingIn = true;
							var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
							this.ballToHold.ballPower = -16;
							console.log("short but lucky");
						}
						else {
							this.ballToHold.goingIn = false;
							var direction = Math.atan2(HOOP_Y - this.y, HOOP_X + (Math.floor(Math.random() * 51) - 25) - this.x);
							this.ballToHold.ballPower = Math.floor(Math.random() * 2) - 16;
						}
					}
					else if (this.shootingTime > 15) {
						// console.log(this.shootingTime);
						// console.log(random);
						if (random < this.shootingTime - 15) {
							this.ballToHold.goingIn = true;
							var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
							this.ballToHold.ballPower = -16;
							console.log("long but lucky");
						}
						else {
							this.ballToHold.goingIn = false;
							var direction = Math.atan2(HOOP_Y - this.y, HOOP_X + (Math.floor(Math.random() * 51) - 25) - this.x);
							this.ballToHold.ballPower = Math.floor(Math.random() * 2) - 17;
						}
					}
					// console.log(direction);
					this.ballToHold.shootingX = Math.cos(direction) * this.ballToHold.startingDistanceFromHoop / 30;
					this.ballToHold.shootingY = Math.sin(direction) * this.ballToHold.startingDistanceFromHoop / 30;
					// console.log(this.ballToHold.shootingX);
					this.ballToHold = null;
					this.isHoldingBall = false;
				}
				this.shootingTime = 0;
			}
		}
		//AI movement
		else {
			if (!this.isHoldingBall) {//movement towards the ball
				for (var i = 0; i < ballArray.length; i++) {
					if (!ballArray[i].beingShot) {
						var a = ballArray[i].x - this.x;
						var b = ballArray[i].y - this.y;
						var distance = Math.sqrt(a * a + b * b);
						if (distance < distanceToTheClosestBall || distanceToTheClosestBall == null) {
							distanceToTheClosestBall = distance;
							this.ballToChase = ballArray[i];
						}
					}
				}
				if (nextX != this.x && nextY != this.y) {
					if (this.x < this.ballToChase.x) {
						nextX += PLAYER_MOVE_SPEED * Math.cos(45);
					}
					if (this.y < this.ballToChase.y) {
						nextY += PLAYER_MOVE_SPEED * Math.cos(45);
					}
					if (this.x > this.ballToChase.x) {
						nextX -= PLAYER_MOVE_SPEED * Math.cos(45);
					}
					if (this.y > this.ballToChase.y) {
						nextY -= PLAYER_MOVE_SPEED * Math.cos(45);
					}
				}
				else {
					if (this.x < this.ballToChase.x) {
						nextX += PLAYER_MOVE_SPEED;
					}
					if (this.y < this.ballToChase.y) {
						nextY += PLAYER_MOVE_SPEED;
					}
					if (this.x > this.ballToChase.x) {
						nextX -= PLAYER_MOVE_SPEED;
					}
					if (this.y > this.ballToChase.y) {
						nextY -= PLAYER_MOVE_SPEED;
					}
				}
			}
		}

		//0 = north, 1 = east, 2 = south, 3 = west,4=ne, 5 = se, 6 = sw, 7 = nw

		if (this.previousfacingDirection != this.facingDirection) {
			//console.log("just changed directions");
			if (Math.random() > 0.5) { // not every time
				// play a random sound from this list (see Audio.js)
				var randomSound = shoeSounds[Math.floor(Math.random() * shoeSounds.length)];
				randomSound.volume = 0.3;
				randomSound.play();
			}
		}

		if (this.x == nextX && this.y == nextY) {
			currentPic = player1;
		}

		this.x = nextX;
		this.y = nextY;


		for (var i = 0; i < ballArray.length; i++) {
			if (ballArray[i].x - this.x < 30 && this.x - ballArray[i].x < 30 &&
				ballArray[i].y - this.y < 30 && this.y - ballArray[i].y < 30 &&
				ballArray[i].height < 10 && !ballArray[i].beingShot && !this.isHoldingBall) {
				this.isHoldingBall = true;
				ballArray[i].isHeld = true;
				ballArray[i].isHeldBy = this;
				this.ballToHold = ballArray[i];
			}
		}
	}

	this.draw = function () {
		// switch (this.facingDirection) {//0 = north, 1 = east, 2 = south, 3 = west,4=ne, 5 = se, 6 = sw, 7 = nw
		//   case 0:
		//     this.ang =Math.PI;
		//     break;
		//   case 1:
		//     this.ang = 3*Math.PI/2;
		//     break;
		//   case 2:
		//     this.ang = 0;
		//     break;
		//   case 3:
		//     this.ang = Math.PI/2;
		//     break;
		//   case 4:
		//     this.ang = Math.PI/4;
		//     break;
		//   case 5:
		//     this.ang = 3*Math.PI/4;
		//     break;
		//   case 6:
		//     this.ang = 5*Math.PI/4;
		//     break;
		//   case 7:
		//     this.ang = 7*Math.PI/4;
		//     break;
		// }
		if (this.states.isShooting) {
			this.incrementTick();
			this.walkSprite.draw(Math.floor(this.tickCount / this.ticksPerFrame), this.frameRow, this.x, this.y, this.ang);
		}
		if (this.states.isIdle) {
			drawBitmapCenteredWithRotation(currentPic, this.x,this.y, this.ang);
		}

		if (this.shootingTime > 0) {
			colorRect(this.x, this.y + 20, this.shootingTime, 10, "red");
			colorRect(this.x + 10, this.y + 20, 5, 10, "green");
		}
	}
}
