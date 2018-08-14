function pointClass(x, y) {
	this.x = x;
	this.y = y;
}

let zonePoints = new Array();
let arrayOfZones = new Array();
initializeZonePoints();
let initializeArrayOfZones;
let drawZones;
const ZONE_CLAIM_POINT = 1;
let aroundTheWorldIsOver = false;

const ClaimStatus = {
	Neither:0,
	Player1:1,
	Player2:2,
	Both:3,
	OwnedPlayer1: 5,
	OwnedPlayer2: 4
}

const FIXED_STREAK_BONUS = 1; //in GameMode.AroundTheWorld, a rising bonus results in scores > 100 pretty frequently => use this instead to prevent that.

function zoneClass(points, zoneNumber, score) {//points is an array of indexes referring to the index of elements in the zonePoints array

  this.points = [];
  for (let i = 0; i < points.length; i++) {
	  this.points.push(zonePoints[points[i]]);
  }

  this.zoneNumber = zoneNumber;
  this.score = score;
  this.unclaimed = true;

  this.claimStatus = 0;
  this.character1InTheZone = false;
  this.character2InTheZone = false;
  this.isClaimedBy;
  this.claimDanger = false;

  let minX = this.points[0].x;
  let maxX = this.points[0].x;
  let minY = this.points[0].y;
  let maxY = this.points[0].y;

  this.middle;
  for(let i = 1; i < this.points.length; i++) {
	   minX = Math.min(minX, this.points[i].x);
	   maxX = Math.max(maxX, this.points[i].x);
	   minY = Math.min(minY, this.points[i].y);
	   maxY = Math.max(maxY, this.points[i].y);
  }

  const midX = minX + (maxX - minX) / 2;
  const midY = minY + (maxY - minY) / 2;
  this.middle = new pointClass(midX, midY);

  this.draw = function() {
  	drawAnyZone(this.points, this.zoneNumber, this.claimStatus);
  }
}

//establish position of each character relative to the zones and set the appropriate zone status
function updateZoneStatus(zoneIndex) {
	if(GameMode.Shootaround) {
		updateShootAroundZoneStatus(zoneIndex);
	} else if(GameMode.OneOnOne) {

	} else if(GameMode.AroundTheWorld) {
		updateAroundTheWorldZoneStatus(zoneIndex);
	}
}

function updateAroundTheWorldZoneStatus(zoneIndex) {
	var player1Here = false;
    var player2Here = false;

    //if both of Player1's feet are in a zone, the associated zone status
    if(pointInPolygon(character1.centerOfFeet, arrayOfZones[zoneIndex].points)) {
	    player1Here = true;
        character1.currentZone = arrayOfZones[zoneIndex].zoneNumber;
    }

    //if both of Player2's feet are in a zone, the associated zone status
    if(pointInPolygon(character2.centerOfFeet, arrayOfZones[zoneIndex].points)) {
	    player2Here = true;
        character2.currentZone = arrayOfZones[zoneIndex].zoneNumber;
    }

	if ((arrayOfZones[zoneIndex].isClaimedBy == character1) && (player2Here)){
	    arrayOfZones[zoneIndex].claimStatus = ClaimStatus.Both;//if both players are in the zone or if either zone is already claimed while other player is in that zone, zone is colored red
    } else if ((arrayOfZones[zoneIndex].isClaimedBy == character2) && (player1Here)) {
	    arrayOfZones[zoneIndex].claimStatus = ClaimStatus.Both;//if both players are in the zone or if either zone is already claimed while other player is in that zone, zone is colored red
    } else if(arrayOfZones[zoneIndex].isClaimedBy == character1) {
	    arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer1;
    } else if(arrayOfZones[zoneIndex].isClaimedBy == character2) {
	    arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer2;
    } else if (player1Here) {
        arrayOfZones[zoneIndex].claimStatus = ClaimStatus.Player1;//if only player1 is here, zone is blue
    } else if (player2Here) {
        arrayOfZones[zoneIndex].claimStatus = ClaimStatus.Player2;//if only player 2 is here, zone is green
    } else {
	    arrayOfZones[zoneIndex].claimStatus = ClaimStatus.Neither;//if neither player is here, zone has no fillStyle
    }

    if(arrayOfZones[zoneIndex].unclaimed == false) {return;}//once a zone is claimed, it can't be reclaimed in this mode of gameplay

    //checks zone status and change to appropriate color
    if (character1.ballToHold != null) {
	    //Player1 is dunking the ball
		if (character1.startedDunking && player1Here) {
		  character1.score += (arrayOfZones[zoneIndex].score + FIXED_STREAK_BONUS);

		  arrayOfZones[zoneIndex].isClaimedBy = character1;
		  arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer1;
		  arrayOfZones[zoneIndex].unclaimed = false;
		}

		//Player1 is successfully shooting the ball
		if (player1Here && character1.ballToHold.goingIn) {
		  character1.score += (arrayOfZones[zoneIndex].score + FIXED_STREAK_BONUS);
			crowdCheer.play();
		  arrayOfZones[zoneIndex].isClaimedBy = character1;
		  arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer1;//if player1 is in the zone and the ball goes in, zone is claimed by player1 and colored blue;
		  arrayOfZones[zoneIndex].unclaimed = false;
		}
    }

    if (character2.ballToHold != null) {
	    //Player2 is dunking the ball
		if (character2.startedDunking && player2Here) {
			character2.score += (arrayOfZones[zoneIndex].score + ZONE_CLAIM_POINT + character2.streak++);

			arrayOfZones[zoneIndex].isClaimedBy = character2;
			arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer2;//if player2 is in the zone ond the ball goes in, zone is claimed by player2 and colored green;
		  arrayOfZones[zoneIndex].unclaimed = false;
		}

		if (player2Here && character2.ballToHold.goingIn) {
		  character2.score += (arrayOfZones[zoneIndex].score + ZONE_CLAIM_POINT + character2.streak++);

		  arrayOfZones[zoneIndex].isClaimedBy = character2;
		  arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer2;//if player2 is in the zone ond the ball goes in, zone is claimed by player2 and colored green;
		  arrayOfZones[zoneIndex].unclaimed = false;
		}
    }
}

//establish position of each character relative to the zones and set the appropriate zone status
function updateShootAroundZoneStatus(zoneIndex) {
    var player1Here = false;
    var player2Here = false;

    //if both players' feet are in a zone, the associated zone status
    if(pointInPolygon(character1.centerOfFeet, arrayOfZones[zoneIndex].points)) {
	    player1Here = true;
        character1.currentZone = arrayOfZones[zoneIndex].zoneNumber;
    }

    if(pointInPolygon(character2.centerOfFeet, arrayOfZones[zoneIndex].points)) {
	    player2Here = true;
        character2.currentZone = arrayOfZones[zoneIndex].zoneNumber;
    }

        //checks zone status and changes to appropriate color
        if (character1.ballToHold != null) {
          if (character1.startedDunking && player1Here) {
            character1.score += arrayOfZones[zoneIndex].score;
            if (arrayOfZones[zoneIndex].claimStatus == ClaimStatus.OwnedPlayer2) {
              character2.score -= ZONE_CLAIM_POINT;
            }
            if (arrayOfZones[zoneIndex].claimStatus != ClaimStatus.OwnedPlayer1) {
              //character1.score += (ZONE_CLAIM_POINT + arrayOfZones[zoneIndex].score + character1.streak++);
              character1.score += (ZONE_CLAIM_POINT + character1.streak++);
              arrayOfZones[zoneIndex].isClaimedBy = character1;
              arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer1;
            }
          }
          if (player1Here && character1.ballToHold.goingIn) {
            //console.log(character1.ballToHold.goingIn);
            character1.score += arrayOfZones[zoneIndex].score;
            if (arrayOfZones[zoneIndex].claimStatus == ClaimStatus.OwnedPlayer2) {
              character2.score -= ZONE_CLAIM_POINT;
            }
            if (arrayOfZones[zoneIndex].claimStatus != ClaimStatus.OwnedPlayer1) {
              //character1.score += (ZONE_CLAIM_POINT + arrayOfZones[zoneIndex].score + character1.streak++);
              character1.score += (ZONE_CLAIM_POINT + character1.streak++);
              arrayOfZones[zoneIndex].isClaimedBy = character1;
              arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer1;//if player1 is in the zone and the ball goes in, zone is claimed by player1 and colored blue;
              //console.log(arrayOfZones[zoneIndex].claimStatus);
            }
          }
        }
        if (character2.ballToHold != null) {
          if (character2.startedDunking && player2Here) {
            character2.score += arrayOfZones[zoneIndex].score;
            //console.log("ai dunking");
            if (arrayOfZones[zoneIndex].claimStatus == ClaimStatus.OwnedPlayer1) {
              character1.score -= ZONE_CLAIM_POINT;
            }
            if (arrayOfZones[zoneIndex].claimStatus != ClaimStatus.OwnedPlayer2){
              //character2.score += (ZONE_CLAIM_POINT + arrayOfZones[zoneIndex].score + character2.streak++);
              character2.score += (ZONE_CLAIM_POINT + character2.streak++);
              arrayOfZones[zoneIndex].isClaimedBy = character2;
              arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer2;//if player2 is in the zone ond the ball goes in, zone is claimed by player2 and colored green;
            }
          }
          if (player2Here && character2.ballToHold.goingIn) {
            character2.score += arrayOfZones[zoneIndex].score;
            //console.log("ai shooting");
            if (arrayOfZones[zoneIndex].claimStatus == ClaimStatus.OwnedPlayer1) {
              character1.score -= ZONE_CLAIM_POINT;
            }
            if (arrayOfZones[zoneIndex].claimStatus != ClaimStatus.OwnedPlayer2){
              //character2.score += (ZONE_CLAIM_POINT + arrayOfZones[zoneIndex].score + character2.streak++);
              character2.score += (ZONE_CLAIM_POINT +character2.streak++);
              arrayOfZones[zoneIndex].isClaimedBy = character2;
              arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer2;//if player2 is in the zone ond the ball goes in, zone is claimed by player2 and colored green;
            }
          }
        }

        //this part would be added the red zone condition, claimStatus 3
        //|| (player1Here && arrayOfZones[zoneIndex].claimStatus === 4) || (player2Here && arrayOfZones[zoneIndex].claimStatus === 5) )

        if (arrayOfZones[zoneIndex].claimStatus != ClaimStatus.OwnedPlayer1 && arrayOfZones[zoneIndex].claimStatus != ClaimStatus.OwnedPlayer2) {
          if (player1Here && player2Here)  {
            arrayOfZones[zoneIndex].claimStatus = ClaimStatus.Both;//if both players are in the zone or if either zone is already claimed while other player is in that zone, zone is colored red
          } else if (player1Here) {
            arrayOfZones[zoneIndex].claimStatus = ClaimStatus.Player1;//if only player1 is here, zone is blue
          } else if (player2Here) {
            arrayOfZones[zoneIndex].claimStatus = ClaimStatus.Player2;//if only player 2 is here, zone is green
          } else {
            arrayOfZones[zoneIndex].claimStatus = ClaimStatus.Neither;//if neither player is here, zone has no fillStyle
          }
        }


  }

  /*[Log] Mouse Click: (947, 427) (Main.js, line 43)
[Log] Mouse Click: (877, 483) (Main.js, line 43)*/

function initializeZonePoints() {
	zonePoints.push(new pointClass(57,675));  //0
	zonePoints.push(new pointClass(75,585));  //1
	zonePoints.push(new pointClass(90,502));  //2
	zonePoints.push(new pointClass(110,388)); //3
	zonePoints.push(new pointClass(125,313)); //4
	zonePoints.push(new pointClass(139,238)); //5
	zonePoints.push(new pointClass(182,350)); //6
	zonePoints.push(new pointClass(188,313)); //7
	zonePoints.push(new pointClass(189,388)); //8
	zonePoints.push(new pointClass(215,238)); //9
	zonePoints.push(new pointClass(244,453)); //10
	zonePoints.push(new pointClass(332,238)); //11
	zonePoints.push(new pointClass(332,313)); //12
	zonePoints.push(new pointClass(332,388)); //13
	zonePoints.push(new pointClass(332,502)); //14
	zonePoints.push(new pointClass(332,585)); //15
	zonePoints.push(new pointClass(332,675)); //16
	zonePoints.push(new pointClass(448,532)); //17
	zonePoints.push(new pointClass(448,585)); //18
	zonePoints.push(new pointClass(448,675)); //19
	zonePoints.push(new pointClass(469,388)); //20
	zonePoints.push(new pointClass(491,238)); //21
	zonePoints.push(new pointClass(480,313)); //22
	zonePoints.push(new pointClass(572,542)); //23
	zonePoints.push(new pointClass(580,238)); //24
	zonePoints.push(new pointClass(580,313)); //25
	zonePoints.push(new pointClass(580,388)); //26
	zonePoints.push(new pointClass(664,238)); //27
	zonePoints.push(new pointClass(676,313)); //28
	zonePoints.push(new pointClass(688,388)); //29
	zonePoints.push(new pointClass(707,532)); //30
	zonePoints.push(new pointClass(707,585)); //31
	zonePoints.push(new pointClass(707,675)); //32
	zonePoints.push(new pointClass(814,238)); //33
	zonePoints.push(new pointClass(814,313)); //34
	zonePoints.push(new pointClass(814,388)); //35
	zonePoints.push(new pointClass(814,505)); //36
	zonePoints.push(new pointClass(814,585)); //37
	zonePoints.push(new pointClass(814,675)); //38
	zonePoints.push(new pointClass(880,476)); //39
	zonePoints.push(new pointClass(940,238)); //40
	zonePoints.push(new pointClass(969,388)); //41
	zonePoints.push(new pointClass(970,313)); //42
	zonePoints.push(new pointClass(975,350)); //43
	zonePoints.push(new pointClass(1018,238));//44
	zonePoints.push(new pointClass(1032,313));//45
	zonePoints.push(new pointClass(1046,388));//46
	zonePoints.push(new pointClass(1067,505));//47
	zonePoints.push(new pointClass(1082,585));//48
	zonePoints.push(new pointClass(1098,675));//49

	zonePoints.push(new pointClass(949, 420));//50
	zonePoints.push(new pointClass(921, 447));//51
	zonePoints.push(new pointClass(975, 365));//52
	zonePoints.push(new pointClass(975, 334));//53
	zonePoints.push(new pointClass(207, 417));//54
	zonePoints.push(new pointClass(223, 435));//55
	zonePoints.push(new pointClass(274, 472));//56
	zonePoints.push(new pointClass(183, 334));//57
	zonePoints.push(new pointClass(184, 369));//58
	zonePoints.push(new pointClass(392, 520));//59
	zonePoints.push(new pointClass(504, 539));//60
	zonePoints.push(new pointClass(640, 540));//61
	zonePoints.push(new pointClass(761, 520));//61
}

initializeArrayOfZones = () => {//142 35
	arrayOfZones.push(new zoneClass([5, 9, 7, 4], 1, 3));
	arrayOfZones.push(new zoneClass([9, 11, 12, 7], 2, 2));
	arrayOfZones.push(new zoneClass([11, 21, 22, 12], 3, 2));
	arrayOfZones.push(new zoneClass([21, 24, 25, 22], 4, 2));
	arrayOfZones.push(new zoneClass([24, 27, 28, 25], 5, 2));
	arrayOfZones.push(new zoneClass([27, 33, 34, 28], 6, 2));
	arrayOfZones.push(new zoneClass([33, 40, 42, 34], 7, 2));
	arrayOfZones.push(new zoneClass([40, 44, 45, 42], 8, 3));
	arrayOfZones.push(new zoneClass([4, 7, 57, 6, 58, 8, 3], 9, 3));
	arrayOfZones.push(new zoneClass([7, 12, 13, 8, 58, 6, 57], 10, 2));
	arrayOfZones.push(new zoneClass([12, 22, 20, 13], 11, 2));
	arrayOfZones.push(new zoneClass([22, 25, 26, 20], 12, 2));
	arrayOfZones.push(new zoneClass([25, 28, 29,26], 13, 2));
	arrayOfZones.push(new zoneClass([28, 34, 35, 29], 14, 2));
	arrayOfZones.push(new zoneClass([34, 42, 53, 43, 52, 41, 35], 15, 2));
	arrayOfZones.push(new zoneClass([42, 45, 46, 41, 52, 43, 53], 16, 3));
	arrayOfZones.push(new zoneClass([3, 8, 54, 55, 10, 56, 14, 2], 17, 3));
	arrayOfZones.push(new zoneClass([8, 13, 14, 56, 10, 55, 54], 18, 2));
	arrayOfZones.push(new zoneClass([13, 20, 17, 59, 14], 19, 2));
	arrayOfZones.push(new zoneClass([20, 29, 30, 61, 23, 60, 17], 20, 2));
	arrayOfZones.push(new zoneClass([29, 35, 36, 62, 30], 21, 2));
	arrayOfZones.push(new zoneClass([35, 41, 50, 51, 39, 36], 22, 2));
	arrayOfZones.push(new zoneClass([41, 46, 47, 36, 39, 51, 50], 23, 3));
	arrayOfZones.push(new zoneClass([14, 59, 17, 18, 15], 24, 3));
	arrayOfZones.push(new zoneClass([17, 60, 23, 61, 30, 31, 18], 25, 3));
	arrayOfZones.push(new zoneClass([30, 62, 36, 37, 31], 26, 3));
	arrayOfZones.push(new zoneClass([2, 14, 15, 1], 27, 3));
	arrayOfZones.push(new zoneClass([36, 47, 48, 37], 28, 3));
	arrayOfZones.push(new zoneClass([1, 15, 16, 0], 29, 3));
	arrayOfZones.push(new zoneClass([15, 18, 19, 16], 30, 3));
	arrayOfZones.push(new zoneClass([18, 31, 32, 19], 31, 3));
	arrayOfZones.push(new zoneClass([31, 37, 38, 32], 32, 3));
	arrayOfZones.push(new zoneClass([37, 48, 49, 38], 33, 3));
}

drawZones = () => {
	let anyUnclaimed = false;
  for (let zoneIndex = 0; zoneIndex<arrayOfZones.length; zoneIndex++) {
    updateZoneStatus(zoneIndex);
    arrayOfZones[zoneIndex].draw();
    if(arrayOfZones[zoneIndex].isClaimedBy == null) {
	    anyUnclaimed = true;
    }
  }

  if((GameMode.AroundTheWorld) && (anyUnclaimed == false)) {
	    aroundTheWorldIsOver = true;
  }
}
updateZones = () => {
  for (let zoneIndex = 0; zoneIndex<arrayOfZones.length; zoneIndex++) {
    updateZoneStatus(zoneIndex);
  }
}

function resetZones() {
	for (let zoneIndex = 0; zoneIndex<arrayOfZones.length; zoneIndex++) {
    arrayOfZones[zoneIndex].isClaimedBy = null;
    arrayOfZones[zoneIndex].claimStatus = ClaimStatus.Neither;
    arrayOfZones[zoneIndex].unclaimed = true;
  }
}

function pointInPolygon(target, polygon) {

  	var tempX;
  	var tempY;

  	/* How many times the ray crosses a line-segment */
  	var crossings = 0;

  	/* Iterate through each line */
  	for ( var i = 0; i < polygon.length; i++) {
  		if( polygon[i].x < polygon[(i + 1) % polygon.length].x) {
			tempX = polygon[i].x;
			tempY = polygon[(i + 1) % polygon.length].x;
		} else {
			tempX = polygon[(i + 1) % polygon.length].x;
			tempY = polygon[i].x;
		}

		//First check if the ray is possible to cross the line
		if (target.x > tempX && target.x <= tempY && (target.y < polygon[i].y || target.y <= polygon[(i + 1) % polygon.length].y)) {
			var eps = 0.000001;

			//Calculate the equation of the line
			var dx = polygon[(i + 1) % polygon.length].x - polygon[i].x;
			var dy = polygon[(i + 1) % polygon.length].y - polygon[i].y;
			var k;

			if (Math.abs(dx) < eps) {
				k = Number.MAX_VALUE;
			} else {
				k = dy / dx;
			}

			var m = polygon[i].y - k * polygon[i].x;
			//Find if the ray crosses the line
			var y2 = k * target.x + m;
			if (target.y <= y2) {
				crossings++;
			}
		}
	}

	if (crossings % 2 == 1) {
		return true;
	} else {
		return false;
	}
}
