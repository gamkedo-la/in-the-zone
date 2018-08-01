const PLAYER_MOVE_SPEED = 7; // original speed was 5.0;
const PLAYER_MOVE_SPEED_CHANGE = 3.0;
var currentFrame = 0;
var distanceToTheClosestBall;
var zoneCounter = 0;
var randomNumberOfZones;
var zonesWithPriority = [];
var isDunkingEnded = false;

function playerClass(startingX, startingY, isAI) {
	this.x = startingX;
	this.y = startingY;
	this.leftEdgeOfFeet = this.x + 19;
	this.topEdgeOfFeet = this.y + 59;
	this.rightEdgeOfFeet = this.x + 39;
	this.bottomEdgeOfFeet = this.y + 61;

	this.centerOfFeet = {"centerOfFeetX": this.x-4,"centerOfFeetY": this.y+30};

	this.markCenterOfFeet = () => {
		canvasContext.font = "20px Arial";
		canvasContext.fillStyle = "black";
		canvasContext.fillText(this.centerOfFeet.centerOfFeetX + "," + this.centerOfFeet.centerOfFeetY,
		 											 this.x - 4,this.y + 30);
	}
	this.myWarriorPic; // which picture to use
	// this.facingDirection= 2;//0 = north, 1 = east, 2 = south, 3 = west,4=ne, 5 = se, 6 = sw, 7 = nw
	this.ang;
	this.isAI = isAI;
	this.ballToHold;
	this.inShootingMotion = false;
	this.shootingTime = 0;
	this.distanceFromHoop;

	//for ai
	this.ballToChase;
	this.distanceToClosestZone;
	this.zonesToGo = [];
	this.randomShootingTime;
	this.closeEnoughToDefend = false;

	this.score = 0;

	this.shootingStartingX;
	this.shootingStartingY;
	this.shootingRandom;
	this.shootingDifficulty = 0;// 0: easiest, 3: hardest
	this.longPressedShotGoingInLimit = 19;
	this.shortPressedShotGoingInLimit = 10;

	this.currentZone;
	this.jumpingHeight = 0;
	this.DistanceFromHoopWhileDunking;

	this.startedDunking = false;

	this.width = 64;
	this.height = 64;
	this.tickCount = 0;
	this.ticksPerFrame = 5;
	this.frameRow = 0;
	this.framesAnim = 10;
	this.walkSprite = new SpriteSheetClass(currySpriteSheet, this.width, this.height);
	this.dunkSprite = new SpriteSheetClass(player1DunkingSpriteSheet, this.width, this.height);

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
		this.distanceFromHoop = Math.sqrt((HOOP_X - this.x) * (HOOP_X - this.x) + (HOOP_Y - this.y) * (HOOP_Y - this.y))
		//console.log(this.keyHeld_East);
		// console.log(this.ballToHold);
		//console.log(this.currentZone);
		//console.log(this.shootingDifficulty);
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
		if (this.ballToHold != null) {
			if (this.ballToHold.x != this.x) {
				this.ballToHold = null;
				this.isHoldingBall = false;
			}
		}

		this.previousfacingDirection = this.facingDirection;

		if (this.states.isIdle) {
			if (this.ballToHold == null && gameMode.oneOnOne) {//defending. Being close to the other player makes his shots harder
				if (this.x != character1.x) {
					var distanceFromEachOther = Math.sqrt((character1.x - this.x) * (character1.x - this.x) + (character1.y - this.y) * (character1.y - this.y));
				}
				else {
					var distanceFromEachOther = Math.sqrt((character2.x - this.x) * (character2.x - this.x) + (character2.y - this.y) * (character2.y - this.y));
				}
				if (this.isAI) {
					console.log(this.distanceFromHoop < character1.distanceFromHoop);
					if ((this.distanceFromHoop > character1.distanceFromHoop - 50 && ball1.isHeldBy == character1) || (this.distanceFromHoop > character2.distanceFromHoop - 50 && ball1.isHeldBy == character2)) {// only works with the ball1 since in one-on-one gamemode only ball1 will exist
						console.log("i am not close enough to the rim to defend");
						if (nextX != this.x && nextY != this.y) {
							if (this.x < HOOP_X + 5) {
								nextX += PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.y < HOOP_Y + 5) {
								nextY += PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.x > HOOP_X - 5) {
								nextX -= PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.y > HOOP_Y - 5) {
								nextY -= PLAYER_MOVE_SPEED * Math.cos(45);
							}
						} else {
							if (this.x < HOOP_X + 5) {
								nextX += PLAYER_MOVE_SPEED;
							}
							if (this.y < HOOP_Y + 5) {
								nextY += PLAYER_MOVE_SPEED;
							}
							if (this.x > HOOP_X - 5) {
								nextX -= PLAYER_MOVE_SPEED;
							}
							if (this.y > HOOP_Y - 5) {
								nextY -= PLAYER_MOVE_SPEED;
							}
						}
					}
					if (this.distanceFromHoop < character1.distanceFromHoop && ball1.isHeldBy == character1 && !this.closeEnoughToDefend) {
						console.log("ses");
						if (nextX != this.x && nextY != this.y) {
							if (this.x < character1.x + 5) {
								nextX += PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.y < character1.y + 5) {
								nextY += PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.x > character1.x - 5) {
								nextX -= PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.y > character1.y - 5) {
								nextY -= PLAYER_MOVE_SPEED * Math.cos(45);
							}
						} else {
							if (this.x < character1.x + 5) {
								nextX += PLAYER_MOVE_SPEED;
							}
							if (this.y < character1.y + 5) {
								nextY += PLAYER_MOVE_SPEED;
							}
							if (this.x > character1.x - 5) {
								nextX -= PLAYER_MOVE_SPEED;
							}
							if (this.y > character1.y - 5) {
								nextY -= PLAYER_MOVE_SPEED;
							}
						}
					}
					if (distanceFromEachOther < 50) {
						console.log("hi");
						this.closeEnoughToDefend = true;
					}
					if (distanceFromEachOther > 100) {
						this.closeEnoughToDefend = false;
					}
				}
				if (this.distanceFromHoop < character1.distanceFromHoop) {
					if (distanceFromEachOther < 50) {
						character1.shootingDifficulty = 3;
					}
					else if (distanceFromEachOther < 100) {
						character1.shootingDifficulty = 2;
					}
					else if (distanceFromEachOther < 150) {
						character1.shootingDifficulty = 1;
					}
					else {
						character1.shootingDifficulty = 0;
					}
				}
				else if (this.distanceFromHoop < character2.distanceFromHoop) {
					if (distanceFromEachOther < 50) {
						character2.shootingDifficulty = 3;
					}
					else if (distanceFromEachOther < 100) {
						character2.shootingDifficulty = 2;
					}
					else if (distanceFromEachOther < 150) {
						character2.shootingDifficulty = 1;
					}
					else {
						character2.shootingDifficulty = 0;
					}
				}
				else {
					this.shootingDifficulty = 0;
				}
			}

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
				if (this.keyHeld_Shoot && this.ballToHold != null) {
					if (this.currentZone == 4 || this.currentZone == 5 || this.currentZone == 12 || this.currentZone == 13) {
						this.states.isIdle = false;
						this.states.isDunking = true;
						this.tickCount = 0;
						this.startedDunking = true;
						this.ballToHold.beingDunked = true;
						var a = HOOP_X - this.x;
						var b = HOOP_Y - this.y;
						this.startingDistanceFromHoop = Math.sqrt(a * a + b * b);
					} else {
						// start a regular shot - begin the wind up
						switch (this.shootingDifficulty) {
							case 0:
								this.longPressedShotGoingInLimit = 19;
								this.shortPressedShotGoingInLimit = 10;
								break;
							case 1:
								this.longPressedShotGoingInLimit = 18;
								this.shortPressedShotGoingInLimit = 11;
								break;
							case 2:
								this.longPressedShotGoingInLimit = 17;
								this.shortPressedShotGoingInLimit = 12;
								break;
							case 3:
								this.longPressedShotGoingInLimit = 16;
								this.shortPressedShotGoingInLimit = 13;
								break;
							default:
						}
						this.states.isIdle = false;
						this.states.isShooting = true;
						this.shootingStartingX = this.x;
						this.shootingStartingY = this.y;
						startThrowBallFX(this.x, this.y);
					}
					updateZones();
				}
			}
			else { //AI movement
				if (!this.isHoldingBall) { //movement towards the ball
					distanceToTheClosestBall = null;
					zonesWithPriority = [];//cleaning up the variable. When player holds the ball with variable gets sets to some value but it should be resetted when player does not hold the ball anymore.
					var isThereAnyBallToChase = false;
					for (var i = 0; i < ballArray.length; i++) {
						if (!ballArray[i].beingShot && !ballArray[i].isHeld) {
							var a = ballArray[i].x - this.x;
							var b = ballArray[i].y - this.y;
							var distance = Math.sqrt(a * a + b * b);
							if (distance < distanceToTheClosestBall || distanceToTheClosestBall == null) {
								distanceToTheClosestBall = distance;
								isThereAnyBallToChase = true;
								this.ballToChase = ballArray[i];
							}
						}
						if (!isThereAnyBallToChase) {
							this.ballToChase = null;
						}
					}
					if (this.ballToChase != null) {
						if (nextX != this.x && nextY != this.y) {
							if (this.x < this.ballToChase.x + 5) {
								nextX += PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.y < this.ballToChase.y + 5) {
								nextY += PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.x > this.ballToChase.x - 5) {
								nextX -= PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.y > this.ballToChase.y - 5) {
								nextY -= PLAYER_MOVE_SPEED * Math.cos(45);
							}
						} else {
							if (this.x < this.ballToChase.x + 5) {
								nextX += PLAYER_MOVE_SPEED;
							}
							if (this.y < this.ballToChase.y + 5) {
								nextY += PLAYER_MOVE_SPEED;
							}
							if (this.x > this.ballToChase.x - 5) {
								nextX -= PLAYER_MOVE_SPEED;
							}
							if (this.y > this.ballToChase.y - 5) {
								nextY -= PLAYER_MOVE_SPEED;
							}
						}
					}
				} else { //if ai holds the ball
					if (this.zonesToGo.length == 0) {
						zoneCounter = 0;
						randomNumberOfZones = Math.floor(Math.random() * 5) + 1;
						//console.log(randomNumberOfZones);
						for (var i = 0; i < randomNumberOfZones; i++) {
							var randomSelection = Math.floor(Math.random() * 25) + 1;
							//console.log(randomSelection);
							//console.log(arrayOfZones[randomSelection]);
							this.zonesToGo.push(arrayOfZones[randomSelection]);
						}
						for (var i = 0; i < arrayOfZones.length; i++) {
							if (arrayOfZones[i].isClaimedBy != this && arrayOfZones[i].isClaimedBy != null) {
								console.log(arrayOfZones[i].zoneNumber);
								zonesWithPriority.push(arrayOfZones[i]);// zones that other player holds.
							}
						}
						if (zonesWithPriority.length != 0) {
							//console.log(zonesWithPriority);
							//console.log("hi");
							randomNumberOfZones++;
							var finalZoneToGo;
							var distanceBetweenFinalAndLastZone;// the distance between the random selected zone and the zone with priority(the zone to go)
							for (var i = 0; i < zonesWithPriority.length; i++) {
								var a = this.zonesToGo[this.zonesToGo.length - 1].middle[0] - zonesWithPriority[i].middle[0];
								var b = this.zonesToGo[this.zonesToGo.length - 1].middle[1] - zonesWithPriority[i].middle[1];
								var distance = Math.sqrt(a * a + b * b);
								if (distanceBetweenFinalAndLastZone == null || distance < distanceBetweenFinalAndLastZone) {
									finalZoneToGo = zonesWithPriority[i];
								}
							}
							this.zonesToGo.push(finalZoneToGo);
						}
					}
					if (zoneCounter != this.zonesToGo.length) {
						//console.log(this.zonesToGo);
						//console.log(this.zonesToGo);
						//console.log(this.currentZone);
						if (nextX != this.x && nextY != this.y) {
							if (this.x < this.zonesToGo[zoneCounter].middle[0] + 3) {
								nextX += PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.y < this.zonesToGo[zoneCounter].middle[1 + 3]) {
								nextY += PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.x > this.zonesToGo[zoneCounter].middle[0] - 3) {
								nextX -= PLAYER_MOVE_SPEED * Math.cos(45);
							}
							if (this.y > this.zonesToGo[zoneCounter].middle[1] - 3) {
								nextY -= PLAYER_MOVE_SPEED * Math.cos(45);
							}
						}
						else {
							if (this.x < this.zonesToGo[zoneCounter].middle[0] + 3) {
								nextX += PLAYER_MOVE_SPEED;
							}
							if (this.y < this.zonesToGo[zoneCounter].middle[1] + 3) {
								nextY += PLAYER_MOVE_SPEED;
							}
							if (this.x > this.zonesToGo[zoneCounter].middle[0] - 3) {
								nextX -= PLAYER_MOVE_SPEED;
							}
							if (this.y > this.zonesToGo[zoneCounter].middle[1] - 3) {
								nextY -= PLAYER_MOVE_SPEED;
							}
						}
						if (this.currentZone == this.zonesToGo[zoneCounter].zoneNumber) {
							zoneCounter++;
						}
					}
					else {
						this.zonesToGo = [];
						if (this.currentZone == 4 || this.currentZone == 5 || this.currentZone == 12 || this.currentZone == 13) {
							//console.log("duncking");
							this.states.isIdle = false;
							this.states.isDunking = true;
							this.tickCount = 0;
							this.startedDunking = true;
							this.ballToHold.beingDunked = true;
							var a = HOOP_X - this.x;
							var b = HOOP_Y - this.y;
							this.startingDistanceFromHoop = Math.sqrt(a * a + b * b);
						} else {
							switch (this.shootingDifficulty) {
								case 0:
									this.longPressedShotGoingInLimit = 19;
									this.shortPressedShotGoingInLimit = 10;
									break;
								case 1:
									this.longPressedShotGoingInLimit = 18;
									this.shortPressedShotGoingInLimit = 11;
									break;
								case 2:
									this.longPressedShotGoingInLimit = 17;
									this.shortPressedShotGoingInLimit = 12;
									break;
								case 3:
									this.longPressedShotGoingInLimit = 16;
									this.shortPressedShotGoingInLimit = 13;
									break;
								default:
							}
							this.states.isIdle = false;
							this.states.isShooting = true;
							this.shootingStartingX = this.x;
							this.shootingStartingY = this.y;
						}
						updateZones();
					}
				}
			}

			// pick up ball if we are touching it
			for (var i = 0; i < ballArray.length; i++) {
				if (ballArray[i].x - this.x < 30 && this.x - ballArray[i].x < 30 &&
					ballArray[i].y - this.y < 30 && this.y - ballArray[i].y < 30 &&
					ballArray[i].height < 10 && !ballArray[i].beingShot && !this.isHoldingBall && !ballArray[i].isHeld) {

					this.isHoldingBall = true;
					ballArray[i].isHeld = true;
					ballArray[i].isHeldBy = this;
					this.ballToHold = ballArray[i];

					gainPossessionFX(this.x, this.y);
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
			if (this.currentZone == 1 || this.currentZone == 9 || this.currentZone == 17 ||
				this.currentZone == 24 || this.currentZone == 25 || this.currentZone == 26 ||
				this.currentZone == 23 || this.currentZone == 16 || this.currentZone == 8) {
				var random = Math.floor(Math.random() * 6) + 3;
			}
			else {
				var random = Math.floor(Math.random() * 10) + 1;
			}

			if (!this.isAI) {
				if (this.keyHeld_Shoot && this.ballToHold != null) {
					this.shootingTime++;
					if (this.shootingTime > 25) {
						this.shootingTime = 25;
					}
					if (this.shootingTime > 15) {
						this.tickCount = 25;
					}
				} else {
					if (this.tickCount == 0) {
						this.states.isShooting = false;
						this.states.isIdle = true;
					}
					if (this.shootingTime > 0) {
						this.ballToHold.isShotBy = this;
						this.ballToHold.beingShot = true;
						this.ballToHold.isHeld = false;
						this.ballToHold.isHeldBy = null;
						// console.log(this.ballToHold.x);
						// console.log(HOOP_X);
						var a = HOOP_X - this.x;
						var b = HOOP_Y - this.y;
						this.ballToHold.startingDistanceFromHoop = Math.sqrt(a * a + b * b);
						if (this.shootingTime >= 14 && this.shootingTime <= 15) { //if player menages to hits the green area. His shot will go in
							twoPointsFX(this.ballToHold.x, this.ballToHold.y);
							this.tickCount = 35;
							this.ballToHold.goingIn = true;
							this.ballToHold.isShotBy = this;
							this.ballToHold.gotShotFrom = this.currentZone;
							var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
							this.ballToHold.ballPower = -16.5;
							console.log("perfect");
							updateZones();
						} else if (this.shootingTime < 14) { //player did not press enough
							// console.log(this.shootingTime);
							// console.log(random);
							this.tickCount = 35; //increasing the tickCount to be end of the animation.
							if (this.shootingTime >= this.shortPressedShotGoingInLimit) {
								if (this.shootingDifficulty + 9 <= this.shootingTime) {
									this.ballToHold.goingIn = true;
									var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
									this.ballToHold.ballPower = -16.5;
									console.log("short,yellow and lucky");
									updateZones();
								} else {
									this.ballToHold.goingIn = false;
									var direction = Math.atan2(HOOP_Y - this.y, HOOP_X + (Math.floor(Math.random() * 51) - 25) - this.x);
									this.ballToHold.ballPower = Math.floor(Math.random() * 2) - 16;
									console.log("yellow and unlucky");
								}
							} else {
								this.ballToHold.goingIn = false;
								var direction = Math.atan2(HOOP_Y - this.y, HOOP_X + (Math.floor(Math.random() * 51) - 25) - this.x);
								this.ballToHold.ballPower = Math.floor(Math.random() * 2) - 16;
								console.log("way off");
							}


						} else if (this.shootingTime > 15) {
							// console.log(this.shootingTime);
							// console.log(random);
							if (this.shootingTime <= this.longPressedShotGoingInLimit) {
								if (this.shootingTime <= this.shootingDifficulty + 9) {
									this.ballToHold.goingIn = true;
									var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
									this.ballToHold.ballPower = -16.5;
									console.log("long,yellow and lucky");
									updateZones();
								} else {
									this.ballToHold.goingIn = false;
									var direction = Math.atan2(HOOP_Y - this.y, HOOP_X + (Math.floor(Math.random() * 51) - 25) - this.x);
									this.ballToHold.ballPower = Math.floor(Math.random() * 2) - 16;
									console.log("yellow and unlucky");
								}
							} else {
								this.ballToHold.goingIn = false;
								var direction = Math.atan2(HOOP_Y - this.y, HOOP_X + (Math.floor(Math.random() * 51) - 25) - this.x);
								this.ballToHold.ballPower = Math.floor(Math.random() * 2) - 16;
								console.log("way off");
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

				chargingUpThrowBallFX(this.x, this.y);

			} else {
				if (this.score > character2.score || this.score > character1.score) {
					this.randomShootingTime = Math.floor(Math.random() * 15) + 14;
					//console.log("hello world");
				}
				else {
					this.randomShootingTime = Math.floor(Math.random() * 10) + 11;
				}
				if (this.ballToHold != null && this.shootingTime < this.randomShootingTime) {
					this.shootingTime++;
				} else {
					if (this.tickCount == 0) {
						this.states.isShooting = false;
						this.states.isIdle = true;
					}
					if (this.shootingTime > 0) {
						endThrowBallFX(this.x, this.y); // release the ball: throw some fx too
						this.ballToHold.isShotBy = this;
						this.ballToHold.beingShot = true;
						this.ballToHold.isHeld = false;
						this.ballToHold.isHeldBy = null;
						// console.log(this.ballToHold.x);
						// console.log(HOOP_X);
						var a = HOOP_X - this.x;
						var b = HOOP_Y - this.y;
						this.ballToHold.startingDistanceFromHoop = Math.sqrt(a * a + b * b);
						if (this.shootingTime >= 14 && this.shootingTime <= 15) { //if player menages to hits the green area. His shot will go in
							twoPointsFX(this.ballToHold.x, this.ballToHold.y);
							this.tickCount = 35;
							this.ballToHold.goingIn = true;
							this.ballToHold.isShotBy = this;
							this.ballToHold.gotShotFrom = this.currentZone;
							var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
							this.ballToHold.ballPower = -16;
							console.log("perfect");
							updateZones();
						} else if (this.shootingTime < 14) { //player did not press enough
							// console.log(this.shootingTime);
							// console.log(random);
							this.tickCount = 35; //increasing the tickCount to be end of the animation.
							if (this.shootingTime >= 10) {
								if (random + 9 <= this.shootingTime) {
									this.ballToHold.goingIn = true;
									var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
									this.ballToHold.ballPower = -16;
									console.log("short,yellow and lucky");
									updateZones();
								} else {
									this.ballToHold.goingIn = false;
									var direction = Math.atan2(HOOP_Y - this.y, HOOP_X + (Math.floor(Math.random() * 51) - 25) - this.x);
									this.ballToHold.ballPower = Math.floor(Math.random() * 2) - 16;
									console.log("yellow and unlucky");
								}
							} else {
								this.ballToHold.goingIn = false;
								var direction = Math.atan2(HOOP_Y - this.y, HOOP_X + (Math.floor(Math.random() * 51) - 25) - this.x);
								this.ballToHold.ballPower = Math.floor(Math.random() * 2) - 16;
								console.log("way off");
							}


						} else if (this.shootingTime > 15) {
							// console.log(this.shootingTime);
							// console.log(random);
							if (this.shootingTime <= 19) {
								if (this.shootingTime <= random + 9) {
									this.ballToHold.goingIn = true;
									var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
									this.ballToHold.ballPower = -16;
									console.log("long,yellow and lucky");
									updateZones();
								} else {
									this.ballToHold.goingIn = false;
									var direction = Math.atan2(HOOP_Y - this.y, HOOP_X + (Math.floor(Math.random() * 51) - 25) - this.x);
									this.ballToHold.ballPower = Math.floor(Math.random() * 2) - 16;
									console.log("yellow and unlucky");
								}
							} else {
								this.ballToHold.goingIn = false;
								var direction = Math.atan2(HOOP_Y - this.y, HOOP_X + (Math.floor(Math.random() * 51) - 25) - this.x);
								this.ballToHold.ballPower = Math.floor(Math.random() * 2) - 16;
								console.log("way off");
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
		}


		if (this.states.isDunking) {
			this.startedDunking = false;
			var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
			var dunkingX = Math.cos(direction) * this.startingDistanceFromHoop / 30;
			var dunkingY = Math.sin(direction) * this.startingDistanceFromHoop / 30;
			var dunkingHeight = 5;
			nextX += dunkingX;
			nextY += dunkingY;
			if (this.jumpingHeight < HOOP_H && !isDunkingEnded) {
				this.jumpingHeight += dunkingHeight;
			}
			if (this.jumpingHeight + 10 > HOOP_H && !isDunkingEnded) {
				this.jumpingHeight -= dunkingHeight;
				this.tickCount = 40;
			}
			this.z = this.y - this.jumpingHeight;
			if (this.x < HOOP_X + 10 && this.y < HOOP_Y + 10 &&
				this.x > HOOP_X - 10 && this.y > HOOP_Y - 10 &&
				this.jumpingHeight < HOOP_H + 30 && this.jumpingHeight > HOOP_H - 30 && !isDunkingEnded) {
				this.ballToHold.ballPower = 5;
				this.ballToHold.beingDunked = false;
				this.ballToHold.jumpingHeight = HOOP_H;
				this.ballToHold.shootingX = 0;
				this.ballToHold.shootingY = 0;
				this.ballToHold.height = HOOP_H;
				this.ballToHold.isHeld = false;
				this.ballToHold.isHeldBy = null;
				isDunkingEnded = true;
			}
			if (isDunkingEnded) {
				console.log(this.jumpingHeight);
				this.tickCount = 45;
				this.jumpingHeight -= 5;
				dunkingX = 0;
				dunkingY = 0;
				if (this.y == this.z) {;
					this.ballToHold = null
					this.isHoldingBall = false;
					this.states.isDunking = false;
					this.states.isIdle = true;
					isDunkingEnded = false;
				}
			}
		}


		if (this.x == nextX && this.y == nextY) {
			currentPic = player1;
		}

		var isMoving = ((this.x != nextX) || (this.y != nextY));
		if (isMoving) walkFX(this.x, this.y); // dust on the floor / footsteps

		this.x = nextX;
		this.y = nextY;

	}

	this.updateEdgesOfFeet = function () {
		this.leftEdgeOfFeet = this.x + 19;
		this.topEdgeOfFeet = this.y + 59;
		this.rightEdgeOfFeet = this.x + 39;
		this.bottomEdgeOfFeet = this.y + 61;
	}

	this.updateCenterOfFeet = function () {
		this.centerOfFeet.centerOfFeetX = this.x - 4;
		this.centerOfFeet.centerOfFeetY = this.y + 30;
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
			if (mainStates.isPaused === false) {
				this.incrementTick();
			}
			this.walkSprite.draw(Math.floor(this.tickCount / this.ticksPerFrame), this.frameRow, this.x, this.y, this.ang);
		}
		if (this.states.isIdle) {
			drawBitmapCenteredWithRotation(currentPic, this.x, this.y, this.ang);
		}
		if (this.states.isDunking) {
			if (mainStates.isPaused === false) {
				this.tickCount += 2;
				if (this.tickCount / this.ticksPerFrame >= this.framesAnim) {
					this.tickCount = 0;
				}
			}
			this.dunkSprite.draw(Math.floor(this.tickCount / this.ticksPerFrame), this.frameRow, this.x, this.z, this.ang);
		}

		if (this.shootingTime > 0) {
			colorRect(this.x + this.shortPressedShotGoingInLimit, this.y + 20, this.longPressedShotGoingInLimit - this.shortPressedShotGoingInLimit, 10, "yellow");
			colorRect(this.x + 14, this.y + 20, 1, 10, "green");
			colorRect(this.x, this.y + 20, this.shootingTime, 10, "red");
		}
		//this.markCenterOfFeet();
	}
}
