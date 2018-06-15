const PLAYER_MOVE_SPEED = 5.0;
const PLAYER_MOVE_SPEED_CHANGE = 3.0
var currentFrame = 0;

function playerClass(startingX,startingY,isAI) {
	this.x = startingX;
	this.y = startingY;
	this.myWarriorPic; // which picture to use
  this.facingDirection= 2;//0 = north, 1 = east, 2 = south, 3 = west,4=ne, 5 = se, 6 = sw, 7 = nw
  this.ang;
  this.isAI = isAI;
  this.ballToHold;
  this.inShootingMotion = false;
  this.shootingTime = 0;
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

    this.setupInput = function(upKey, rightKey, downKey, leftKey, shootKey) {
  		this.controlKeyUp = upKey;
  		this.controlKeyRight = rightKey;
  		this.controlKeyDown = downKey;
  		this.controlKeyLeft = leftKey;
  		this.controlShootKey = shootKey;
  	}

  }


	this.move = function() {
    // console.log(this.ballToHold);
		var nextX = this.x;
		var nextY = this.y;
    // currentFrame++;
    // console.log(currentFrame);
    if (!this.isAI) {
      if(this.keyHeld_North) {
  			nextY -= PLAYER_MOVE_SPEED;
        this.facingDirection = 0;

  		}
  		if(this.keyHeld_East) {
  			nextX += PLAYER_MOVE_SPEED;
        this.facingDirection = 1;
  		}
  		if(this.keyHeld_South) {
  			nextY += PLAYER_MOVE_SPEED;
        this.facingDirection = 2;
  		}
  		if(this.keyHeld_West) {
  			nextX -= PLAYER_MOVE_SPEED;
        this.facingDirection = 3;
  		}
  		if(this.keyHeld_West && this.keyHeld_North) {
        this.facingDirection = 7;
  		}
  		if(this.keyHeld_West && this.keyHeld_South) {
        this.facingDirection = 6;
  		}
  		if(this.keyHeld_East && this.keyHeld_North) {
        this.facingDirection = 4;
  		}
  		if(this.keyHeld_East && this.keyHeld_South) {
        this.facingDirection = 5;
  		}
    }

    //0 = north, 1 = east, 2 = south, 3 = west,4=ne, 5 = se, 6 = sw, 7 = nw

    if (this.x == nextX && this.y == nextY) {
      currentPic = player1;
    }
    // TODO:
		if (this.keyHeld_Shoot && this.ballToHold != null) {
      this.shootingTime++;
    }
    else {
      if (this.shootingTime>0) {
        if (this.shootingTime > 10 && this.shootingTime < 15) {
          this.ballToHold.beingShot = true;
          this.ballToHold.isHeld = false;
          this.ballToHold.isHeldBy = null;
          // console.log(this.ballToHold.x);
          // console.log(HOOP_X);
					var a = HOOP_X-this.x;
          var b = HOOP_Y-this.y;
          this.ballToHold.startingDistanceFromHoop =Math.sqrt(a*a + b*b);
          var direction = Math.atan2(HOOP_Y - this.y, HOOP_X - this.x);
          // console.log(direction);
          this.ballToHold.shootingX = Math.cos(direction) * this.ballToHold.startingDistanceFromHoop/30;
          this.ballToHold.shootingY = Math.sin(direction) * this.ballToHold.startingDistanceFromHoop/30;

          this.ballToHold.ballPower = -16;
          // console.log(this.ballToHold.shootingX);
          this.ballToHold = null;
          console.log("success");
        }
        else {
          // console.log("not a good shot");
          this.ballToHold.beingShot = true;
          this.ballToHold.isHeld = false;
          this.ballToHold.isHeldBy = null;
          // console.log(this.ballToHold.x);
          // console.log(HOOP_X);
          var direction = Math.atan2(HOOP_Y+20 - this.y, HOOP_X+20 - this.x);
          // console.log(direction);
          this.ballToHold.shootingX = Math.cos(direction) * BALL_SHOOT_SPEED;
          this.ballToHold.shootingY = Math.sin(direction) * BALL_SHOOT_SPEED;
          var a = HOOP_X-this.x;
          var b = HOOP_Y-this.y;
          this.ballToHold.startingDistanceFromHoop =Math.sqrt(a*a + b*b);
          // console.log(this.ballToHold.shootingX);
          this.ballToHold = null;
        }
      }
      this.shootingTime = 0;
    }
    this.x = nextX;
    this.y = nextY;

    // TODO:
    // if (this.x < canvas.width-10 && this.y < canvas.height-10 &&
    //     this.x > 0               && this.y >0) {
    //   this.x = nextX;
    //   this.y = nextY;
    //   console.log(this.x);
    //     }

    for (var i = 0; i < ballArray.length; i++) {
      if (ballArray[i].x - this.x <30 && this.x - ballArray[i].x < 30 &&
          ballArray[i].y - this.y <30 && this.y - ballArray[i].y < 30 && !ballArray[i].beingShot) {
            this.isHoldingBall = true;
            ballArray[i].isHeld = true;
            ballArray[i].isHeldBy = this;
            this.ballToHold = ballArray[i];
      }
    }
  }

	this.draw = function() {
    switch (this.facingDirection) {//0 = north, 1 = east, 2 = south, 3 = west,4=ne, 5 = se, 6 = sw, 7 = nw
      case 0:
        this.ang =Math.PI;
        break;
      case 1:
        this.ang = 3*Math.PI/2;
        break;
      case 2:
        this.ang = 0;
        break;
      case 3:
        this.ang = Math.PI/2;
        break;
      case 4:
        this.ang = Math.PI/4;
        break;
      case 5:
        this.ang = 3*Math.PI/4;
        break;
      case 6:
        this.ang = 5*Math.PI/4;
        break;
      case 7:
        this.ang = 7*Math.PI/4;
        break;
    }
		drawBitmapCenteredWithRotation(currentPic, this.x,this.y, this.ang);

    if (this.shootingTime > 0) {
      colorRect(this.x,this.y+20,this.shootingTime,10,"red");
      colorRect(this.x+10,this.y+20,5,10,"green");
    }
	}
}
