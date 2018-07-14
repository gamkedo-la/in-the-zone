const HOOP_X = 400;
const HOOP_Y = 200;
const HOOP_H = 100;
const BALL_SHOOT_SPEED = 8;
const GRAVITY_MULTIPLIER = 0.8;
var ballRiseValue = 0;
var ballShootingStartingX;
var ballShootingStartingY;

function ballClass(startingX, startingY) {
  this.x = startingX;
  this.y = startingY;
  this.isHeld = false;
  this.isHeldBy;
  this.beingShot = false;
  this.shootingX = 0;
  this.shootingY = 0;
  this.height = 10;
  this.ballPower = -10;
  this.startingDistanceFromHoop;
  this.goingIn;
  this.isShotBy;// which player shot the ball
  this.gotShotFrom;// zone

  ballArray.push(this);

  this.move = function () {
    // console.log(this.x);
    //console.log(this.shootingY);
    // console.log(this.ballPower);
    this.ballPower = this.ballPower + GRAVITY_MULTIPLIER;
    this.height = this.height - this.ballPower;
    this.x += this.shootingX;
    this.y += this.shootingY;
    this.z = this.y - this.height;
    if (this.isHeld) {
      this.x = this.isHeldBy.x;
      this.y = this.isHeldBy.y;
      this.z = this.y;
      this.ballPower = 0;
    }
    if (this.height < 0) {
      //console.log(this.ballPower);
      this.height = 0;
      this.ballPower = -this.ballPower * GRAVITY_MULTIPLIER;


      if (this.ballPower < -0.5) {
        ballBouncing2.play();
        bounceFX(this.x, this.y);
      }

      if (this.y < HOOP_Y || this.y > canvas.height) {
        this.beingShot = false;
        this.shootingY = -this.shootingY / 2;
      }
      if (this.x < 0 || this.x > canvas.width) {
        this.beingShot = false;
        this.shootingX = - this.shootingX;
      }

    }
    if (this.beingShot) {
      if (this.goingIn) {
        twoPointsFX(this.x, this.z);
      }

      if (this.x < HOOP_X + 5 && this.y < HOOP_Y + 5 &&
        this.x > HOOP_X - 5 && this.y > HOOP_Y - 5 &&
        this.z < HOOP_H + 10 && this.z > HOOP_H - 10 && this.goingIn) {
        if (this.gotShotFrom ==1 || this.gotShotFrom ==9 || this.gotShotFrom ==17 ||
            this.gotShotFrom ==24 || this.gotShotFrom ==25 || this.gotShotFrom ==26 ||
             this.gotShotFrom ==23 || this.gotShotFrom ==16 || this.gotShotFrom ==8) {
          this.isShotBy.score += 3;
        }
        else {
          this.isShotBy.score += 2;
        }
        this.goingIn = false;
        this.shootingX = 0;
        this.shootingY = 0;
        this.beingShot = false;
        console.log("Yay!");



      }
      else if (this.x < HOOP_X + 15 && this.y < HOOP_Y + 15 &&
        this.x > HOOP_X - 15 && this.y > HOOP_Y - 15 &&
        this.z < HOOP_H + 10 && this.z > HOOP_H - 10 && !this.goingIn) {
        this.shootingX = (this.x - HOOP_X) / 3;
        this.shootingY = (this.y - HOOP_Y) / 3;
        this.ballPower = Math.abs(this.z - HOOP_H);
        this.beingShot = false;
        var random = Math.random();
        if (random > 0.5) {
          ballRebound1.play();
        }
        else {
          ballRebound2.play();
        }

        reboundFX(HOOP_X, HOOP_Y);

      }
    }
  }
  this.draw = function () {
    colorCircle(this.x, this.z, 6, "yellow");
  }
  this.drawShadow = function () {
    colorCircle(this.x, this.y, 6, "black");
  }
}

function drawBalls(ballArray) {
  for (var i = 0; i < ballArray.length; i++) {
    if (!ballArray[i].isHeld) {
      ballArray[i].draw();
    }
    else {
      //ballArray[i].drawShadow();
    }
  }
}

function drawBallShadows(ballArray) {
  for (var i = 0; i < ballArray.length; i++) {
    if (!ballArray[i].isHeld) {
      ballArray[i].drawShadow();
    }
    else {
      //ballArray[i].drawShadow();
    }
  }
}

function moveBalls(ballArray) {
  for (var i = 0; i < ballArray.length; i++) {
    ballArray[i].move();
  }
}
