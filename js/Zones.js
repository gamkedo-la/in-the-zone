let arrayOfZones = new Array();
let initializeArrayOfZones;
let drawZones;

const ClaimStatus = {
	Neither:0,
	Player1:1,
	Player2:2,
	Both:3,
	OwnedPlayer1: 5,
	OwnedPlayer2: 4
}

function pointClass(x, y) {
	this.x = x;
	this.y = y;
}

function zoneClass(x1,y1, x2,y2, x3,y3, x4,y4, x5,y5, zoneNumber) {

  this.zoneNumber = zoneNumber;
  this.unclaimed = true;

  this.claimStatus = 0;
  this.character1InTheZone = false;
  this.character2InTheZone = false;
  this.isClaimedBy;
  this.claimDanger = false;

  this.x1 = x1; this.x2 = x2; this.x3 = x3; this.x4 = x4; this.x5 = x5;
  this.y1 = y1; this.y2 = y2; this.y3 = y3, this.y4 = y4; this.y5 = y5;
  this.topEdge = this.y1; this.rightEdge = this.x2; this.bottomEdge = this.y4; this.leftEdge = this.x1;
  this.middle = [(this.x2-this.x1)/2 + this.x1,(this.y3-this.y2)/2 + this.y1];
  this.points = [new pointClass(this.x1, this.y1), new pointClass(this.x2, this.y2), new pointClass(this.x3, this.y3), new pointClass(this.x4, this.y4)];
  if(this.x5 !== undefined) {
	  this.points.push(new pointClass(this.x5, this.y5));
  }

  this.draw = function() {
  	drawAnyZone(this.points, this.zoneNumber, this.claimStatus);
  }
}

//establish position of each character relative to the zones and set the appropriate zone status
function updateZoneStatus(zoneIndex) {

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
            if (arrayOfZones[zoneIndex].claimStatus == ClaimStatus.OwnedPlayer2) {
              character2.score -= 4;
            }
            if (arrayOfZones[zoneIndex].claimStatus != ClaimStatus.OwnedPlayer1) {
              character1.score += 4;
              arrayOfZones[zoneIndex].isClaimedBy = character1;
              arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer1;
            }
          }
          if (player1Here && character1.ballToHold.goingIn) {
            //console.log(character1.ballToHold.goingIn);
            if (arrayOfZones[zoneIndex].claimStatus == ClaimStatus.OwnedPlayer2) {
              character2.score -= 4;
            }
            if (arrayOfZones[zoneIndex].claimStatus != ClaimStatus.OwnedPlayer1) {
              character1.score += 4;
              arrayOfZones[zoneIndex].isClaimedBy = character1;
              arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer1;//if player1 is in the zone and the ball goes in, zone is claimed by player1 and colored blue;
              //console.log(arrayOfZones[zoneIndex].claimStatus);
            }
          }
        }
        if (character2.ballToHold != null) {
          if (character2.startedDunking && player2Here) {
            //console.log("ai dunking");
            if (arrayOfZones[zoneIndex].claimStatus == ClaimStatus.OwnedPlayer1) {
              character1.score -= 4;
            }
            if (arrayOfZones[zoneIndex].claimStatus != ClaimStatus.OwnedPlayer2){
              character2.score += 4;
              arrayOfZones[zoneIndex].isClaimedBy = character2;
              arrayOfZones[zoneIndex].claimStatus = ClaimStatus.OwnedPlayer2;//if player2 is in the zone ond the ball goes in, zone is claimed by player2 and colored green;
            }
          }
          if (player2Here && character2.ballToHold.goingIn) {
            //console.log("ai shooting");
            if (arrayOfZones[zoneIndex].claimStatus == ClaimStatus.OwnedPlayer1) {
              character1.score -= 4;
            }
            if (arrayOfZones[zoneIndex].claimStatus != ClaimStatus.OwnedPlayer2){
              character2.score += 4;
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


initializeArrayOfZones = () => {//142 35
    arrayOfZones.push(new zoneClass(140,238, 214,238, 187,313, 125,313, undefined,undefined, 1));
    arrayOfZones.push(new zoneClass(214,238, 332,238, 332,313, 187,313, undefined,undefined, 2));
    arrayOfZones.push(new zoneClass(332,238, 491,238, 480,313, 332,313, undefined,undefined, 3));
    arrayOfZones.push(new zoneClass(491,238, 580,238, 580,313, 480,313, undefined,undefined, 4));
    arrayOfZones.push(new zoneClass(580,238, 664,238, 676,313, 580,313, undefined,undefined,5));
    arrayOfZones.push(new zoneClass(664,238, 814,238, 814,313, 676,313, undefined,undefined, 6));
    arrayOfZones.push(new zoneClass(814,238, 940,238, 972,313, 814,313, undefined,undefined,7));
    arrayOfZones.push(new zoneClass(940,238, 1018,238, 1032,313, 972,313, undefined,undefined,8));
    arrayOfZones.push(new zoneClass(125,313, 187,313, 182,350, 187,388, 110,388, 9));
    arrayOfZones.push(new zoneClass(187,313, 332,313, 332,388, 187,388, 182,350, 10));
    arrayOfZones.push(new zoneClass(332,313, 480,313, 469,388, 332,388, undefined,undefined, 11));
    arrayOfZones.push(new zoneClass(480,313, 580,313, 580,388, 469,388, undefined,undefined, 12));
    arrayOfZones.push(new zoneClass(580,313, 676,313, 688,388, 580,388, undefined,undefined, 13));
    arrayOfZones.push(new zoneClass(676,313, 814,313, 814,388, 688,388, undefined,undefined, 14));
    arrayOfZones.push(new zoneClass(814,313, 972,313, 977,350, 970,388, 814,388, 15));
    arrayOfZones.push(new zoneClass(972,313, 1032,313, 1045,388, 970,388, 977,350, 16));
    arrayOfZones.push(new zoneClass(110,388, 187,388, 240,455, 332,502, 90,502, 17));
    arrayOfZones.push(new zoneClass(187,388, 332,388, 332,502, 240,455, undefined,undefined, 18));
    arrayOfZones.push(new zoneClass(332,388, 469,388, 453,532, 332,502, undefined,undefined, 19));
    arrayOfZones.push(new zoneClass(469,388, 688,388, 707,532, 572,542, 453,532, 20));
    arrayOfZones.push(new zoneClass(688,388, 814,388, 814,505, 707,532, undefined,undefined, 21));
    arrayOfZones.push(new zoneClass(814,388, 970,388, 920,453, 814,505, undefined,undefined, 22));
    arrayOfZones.push(new zoneClass(970,388, 1045,388, 1065,505, 814,505, 920,453, 23));
    arrayOfZones.push(new zoneClass(332,502, 453,532, 453,585, 332,585, undefined,undefined, 24));
    arrayOfZones.push(new zoneClass(453,532, 572,542, 707,532, 707,585, 453,585, 25));
    arrayOfZones.push(new zoneClass(707,532, 814,505, 814,585, 707,585, undefined,undefined, 26));
    arrayOfZones.push(new zoneClass(90,502, 332,502, 332,585, 75,585, undefined,undefined, 27));
    arrayOfZones.push(new zoneClass(814,505, 1065,505, 1080,585, 814,585, undefined,undefined, 28));
    arrayOfZones.push(new zoneClass(75,585, 332,585, 332,675, 57,675, undefined,undefined, 29));
    arrayOfZones.push(new zoneClass(332,585, 453,585, 453,675, 332,675, undefined,undefined, 30));
    arrayOfZones.push(new zoneClass(453,585, 707,585, 707,675, 453,675, undefined,undefined, 31));
    arrayOfZones.push(new zoneClass(707,585, 814,585, 814,675, 707,675, undefined,undefined, 32));
    arrayOfZones.push(new zoneClass(814,585, 1080,585, 1098,675, 814,675, undefined,undefined, 33));
}

drawZones = () => {
  for (let zoneIndex = 0; zoneIndex<arrayOfZones.length; zoneIndex++) {
    updateZoneStatus(zoneIndex);
    arrayOfZones[zoneIndex].draw();
    //console.log(arrayOfZones[19]);
  }
}
updateZones = () => {
  for (let zoneIndex = 0; zoneIndex<arrayOfZones.length; zoneIndex++) {
    updateZoneStatus(zoneIndex);
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