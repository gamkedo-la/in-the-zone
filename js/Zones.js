let arrayOfZones = new Array();
let initializeArrayOfZones;
let drawZones;

function zoneClass(x1,y1, x2,y2, x3,y3, x4,y4, x5,y5, zoneNumber) {

  this.zoneNumber = zoneNumber;
  this.unclaimed = true;

  this.claimStatus = 0;
  this.character1InTheZone = false;
  this.character2InTheZone = false;
  this.character1Claimed = false;
  this.character2Claimed = false;
  this.claimDanger = false;

  this.x1 = x1; this.x2 = x2; this.x3 = x3; this.x4 = x4; this.x5 = x5;
  this.y1 = y1; this.y2 = y2; this.y3 = y3, this.y4 = y4; this.y5 = y5;
  this.topEdge = this.y1; this.rightEdge = this.x2; this.bottomEdge = this.y4; this.leftEdge = this.x1;

  this.draw = function() {


    if (this.x5 === undefined && this.y5 === undefined) {
      drawQuadrilateralZone(this.x1,this.y1, this.x2,this.y2, this.x3,this.y3, this.x4,this.y4, zoneNumber, this.claimStatus);
    } else {
      drawPentagonalZone(this.x1,this.y1, this.x2,this.y2, this.x3,this.y3, this.x4,this.y4, this.x5,this.y5, zoneNumber, this.claimStatus);
    }
  }
}

//establish position of each character relative to the zones and set the appropriate zone status
function updateZoneStatus(zoneIndex) {

    var player1Here = false;
    var player2Here = false;

    //if both players' feet are in a zone, the associated zone status
    if (character1.leftEdgeOfFeet - 20 >= arrayOfZones[zoneIndex].leftEdge && character1.rightEdgeOfFeet - 27 <= arrayOfZones[zoneIndex].rightEdge &&
        character1.topEdgeOfFeet - 25 >= arrayOfZones[zoneIndex].topEdge && character1.bottomEdgeOfFeet - 29 <= arrayOfZones[zoneIndex].bottomEdge) {
        player1Here = true;
    }


    if (character2.leftEdgeOfFeet -20 >= arrayOfZones[zoneIndex].leftEdge && character2.rightEdgeOfFeet -27 <= arrayOfZones[zoneIndex].rightEdge &&
        character2.topEdgeOfFeet - 25 >= arrayOfZones[zoneIndex].topEdge && character2.bottomEdgeOfFeet - 29 <= arrayOfZones[zoneIndex].bottomEdge) {
          player2Here = true;
        }
        //checks zone status and changes to appropriate color

        /* was thinking of adding these bits to upgrade zone status, but references to character1.ballToHold.isGoingIn comes back undefined
        if (player1Here  && character1.ballToHold.goingIn) {
          arrayOfZones[zoneIndex].claimStatus = 5;//if player1 is in the zone and the ball goes in, zone is claimed by player1 and colored blue;
        } else if (player2Here && character2.ballToHold.goingIn) {
          arrayOfZones[zoneIndex].claimStatus = 4;//if player2 is in the zone ond the ball goes in, zone is claimed by player2 and colored green;

        this part would be added the red zone condition, claimStatus 3
        || (player1Here && arrayOfZones[zoneIndex].claimStatus === 4) || (player2Here && arrayOfZones[zoneIndex].claimStatus === 5) )
        */

        if (player1Here && player2Here)  {
          arrayOfZones[zoneIndex].claimStatus = 3;//if both players are in the zone or if either zone is already claimed while other player is in that zone, zone is colored red
        } else if (player1Here) {
          arrayOfZones[zoneIndex].claimStatus = 1;//if only player1 is here, zone is blue
        } else if (player2Here) {
          arrayOfZones[zoneIndex].claimStatus = 2;//if only player 2 is here, zone is green
        } else {
          arrayOfZones[zoneIndex].claimStatus = 0;//if neither player is here, zone has no fillStyle
        }

  }


initializeArrayOfZones = () => {
    arrayOfZones.push(new zoneClass(0,203, 72,203, 45,278, 0,278, undefined,undefined, 1));
    arrayOfZones.push(new zoneClass(72,203, 190,203, 190,278, 45,278, undefined,undefined, 2));
    arrayOfZones.push(new zoneClass(190,203, 322,203, 310,278, 190,278, undefined,undefined, 3));
    arrayOfZones.push(new zoneClass(322,203, 400,203, 400,278, 310,278, undefined,undefined, 4));
    arrayOfZones.push(new zoneClass(400,203, 480,203, 490,278, 400,278, undefined,undefined,5));
    arrayOfZones.push(new zoneClass(480,205, 602,203, 602,278, 490,278, undefined,undefined, 6));
    arrayOfZones.push(new zoneClass(602,203, 730,203, 760,278, 602,278, undefined,undefined,7));
    arrayOfZones.push(new zoneClass(730,203, 800,203, 800,278, 760,278, undefined,undefined,8));
    arrayOfZones.push(new zoneClass(0,278, 45,278, 40,315, 55,350, 0,350, 9));
    arrayOfZones.push(new zoneClass(45,278, 190,278, 190,350, 55,350, 40,315, 10));
    arrayOfZones.push(new zoneClass(190,278, 310,278, 300,350, 190,350, undefined,undefined, 11));
    arrayOfZones.push(new zoneClass(310,278, 400,278, 400,350, 300,350, undefined,undefined, 12));
    arrayOfZones.push(new zoneClass(400,278, 490,278, 502,350, 400,350, undefined,undefined, 13));
    arrayOfZones.push(new zoneClass(490,278, 602,278, 602,350, 502,350, undefined,undefined, 14));
    arrayOfZones.push(new zoneClass(602,278, 760,278, 760,315, 750,350, 602,350, 15));
    arrayOfZones.push(new zoneClass(760,278, 800,278, 800,350, 750,350, 760,315, 16));
    arrayOfZones.push(new zoneClass(0,350, 50,350, 115,412, 190,450, 0,450, 17));
    arrayOfZones.push(new zoneClass(50,350, 190,350, 190,450, 115,412, undefined,undefined, 18));
    arrayOfZones.push(new zoneClass(190,350, 300,350, 280,468, 190,450, undefined,undefined, 19));
    arrayOfZones.push(new zoneClass(300,350, 502,350, 517,468, 400,478, 280,468, 20));
    arrayOfZones.push(new zoneClass(502,350, 602,350, 602,448, 517,468, undefined,undefined, 21));
    arrayOfZones.push(new zoneClass(602,350, 750,350, 693,408, 602,448, undefined,undefined, 22));
    arrayOfZones.push(new zoneClass(750,350, 800,350, 800,448, 602,448, 693,408, 23));
    arrayOfZones.push(new zoneClass(190,450, 280,468, 280,520, 190,520, undefined,undefined, 24));
    arrayOfZones.push(new zoneClass(280,468, 400,478, 517,468, 517,520, 280,520, 25));
    arrayOfZones.push(new zoneClass(517,468, 602,448, 602,520, 517,520, undefined,undefined, 26));
}

drawZones = () => {
  for (let zoneIndex = 0; zoneIndex<26; zoneIndex++) {
    updateZoneStatus(zoneIndex);
    arrayOfZones[zoneIndex].draw();
  }
}
