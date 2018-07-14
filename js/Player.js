const PLAYER_MOVE_SPEED = 5.0;
const PLAYER_MOVE_SPEED_CHANGE = 3.0;
var currentFrame = 0;
var distanceToTheClosestBall;
//

function playerClass(startingX, startingY, isAI) {
	this.x = startingX;
	this.y = startingY;
	this.leftEdgeOfFeet = this.x + 19;
	this.topEdgeOfFeet = this.y + 59;
	this.rightEdgeOfFeet = this.x + 39;
	this.bottomEdgeOfFeet = this.y + 61;
	this.myWarriorPic; // which picture to use
	// this.facingDirection= 2;//0 = north, 1 = east, 2 = south, 3 = west,4=ne, 5 = se, 6 = sw, 7 = nw
	this.ang;
	this.isAI = isAI;
	this.ballToHold;
	this.inShootingMotion = false;
	this.shootingTime = 0;
	this.ballToChase; // it is for ai
	this.score = 0;

	this.currentZone;
	this.jumpingHeight = 0;
	this.DistanceFromHoopWhileDunking;

	this.width = 64;
	this.height = 64;
	this.tickCount = 0;
	this.ticksPerFrame = 5;
	this.frameRow = 0;
	this.framesAnim = 10;
	this.walkSprite = new SpriteSheetClass(currySpriteSheet,this.width, this.height);

	this.states = {
		isIdle: true,
		isShooting: false,
		isDunking: false
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
		//console.log(this.currentZone);
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

		if (this.states.isIdle) {
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
				if (this.keyHeld_Shoot && this.ballToHold != null){
					if (this.currentZone == 4 || this.currentZone == 5 || this.currentZone == 12 || this.currentZone == 13) {
						this.states.isIdle = false;
						this.states.isDunking = true;
						var a = HOOP_X - this.x;
						var b = HOOP_Y - this.y;
						this.startingDistanceFromHoop = Math.sqrt(a * a + b * b);
					}
					else {
						this.states.isIdle = false;
						this.states.isShooting = true;
					}
				}
			}
			else {		//AI movement
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

			if (this.previousfacingDirection != this.facingDirection) {
				//console.log("just changed directions");
				if (Math.random() > 0.5) { // not every time
					// play a random sound from this list (see Audio.js)
					var randomSound = shoeSounds[Math.floor(Math.random() * shoeSounds.length)];
					randomSound.volume = 0.3;
					randomSound.play();
				}
			}
		}

		if (this.states.isShooting) {
			if (this.keyHeld_Shoot && this.ballToHold != null) {
	      this.shootingTime++;
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
						twoPointsFX(this.ballToHold.x, this.ballToHold.y);
						this.tickCount = 35;
						this.ballToHold.goingIn = true;
						this.ballToHold.isShotBy = this;
						this.ballToHold.gotShotFrom = this.currentZone;
						var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
						this.ballToHold.ballPower = -16;
						console.log("perfect");
						updateZones();
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
							updateZones();
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
							updateZones();
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



		if (this.states.isDunking) {
			var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
		 	var dunkingX= Math.cos(direction) * this.startingDistanceFromHoop / 30;
			var dunkingY= Math.sin(direction) * this.startingDistanceFromHoop / 30;
			var dunkingHeight = 5;
			nextX += dunkingX;
			nextY += dunkingY;
			if (this.jumpingHeight < HOOP_H) {
				this.jumpingHeight += dunkingHeight;
			}
			if (this.jumpingHeight+ 10 > HOOP_H) {
				this.jumpingHeight -= dunkingHeight;
			}
			this.z = this.y - this.jumpingHeight;
			if (this.x < HOOP_X + 10 && this.y < HOOP_Y + 10 &&
        this.x > HOOP_X - 10 && this.y > HOOP_Y - 10 &&
				this.jumpingHeight< HOOP_H +30 && this.jumpingHeight > HOOP_H -30) {
				console.log(this.ballToHold.jumpingHeight);
				this.jumpingHeight = 0;
				this.ballToHold.jumpingHeight = HOOP_H;
				this.ballToHold.shootingX = 0;
				this.ballToHold.shootingY = 0;
				this.ballToHold.height = HOOP_H;
				this.ballToHold.isHeld = false;
				this.ballToHold.isHeldBy = null;
				this.ballToHold = null;
				this.isHoldingBall = false;
				this.states.isDunking = false;
				this.states.isIdle = true;
			}
		}


		if (this.x == nextX && this.y == nextY) {
			currentPic = player1;
		}

		this.x = nextX;
		this.y = nextY;

	}

	this.updateEdgesOfFeet = function() {
		this.leftEdgeOfFeet = this.x + 19;
		this.topEdgeOfFeet = this.y + 59;
		this.rightEdgeOfFeet = this.x + 39;
		this.bottomEdgeOfFeet = this.y + 61;
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
		if (this.states.isDunking) {
			drawBitmapCenteredWithRotation(dunkingPic, this.x,this.z, this.ang);
		}

		if (this.shootingTime > 0) {
			colorRect(this.x, this.y + 20, this.shootingTime, 10, "red");
			colorRect(this.x + 10, this.y + 20, 5, 10, "green");
		}
	}
}
