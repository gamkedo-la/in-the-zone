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

    //console.log(this.claimStatus, this.zoneNumber);
    if (this.x5 === undefined && this.y5 === undefined) {
      drawQuadrilateralZone(this.x1,this.y1, this.x2,this.y2, this.x3,this.y3, this.x4,this.y4, zoneNumber, this.claimStatus);
    } else {
      drawPentagonalZone(this.x1,this.y1, this.x2,this.y2, this.x3,this.y3, this.x4,this.y4, this.x5,this.y5, zoneNumber, this.claimStatus);
    }
  }
}

//establish position of each character relative to the zones and set the appropriate zone status
function updateZoneStatus(zoneIndex) {
  //for (let i = 0; i < 26; i++) {

    //if the character 1's feet are both within the edges, they are in that zone and draw associated color
    var player1Here = false;
    var player2Here = false;
    if (character1.leftEdgeOfFeet - 20 >= arrayOfZones[zoneIndex].leftEdge && character1.rightEdgeOfFeet - 27 <= arrayOfZones[zoneIndex].rightEdge &&
        character1.topEdgeOfFeet - 25 >= arrayOfZones[zoneIndex].topEdge && character1.bottomEdgeOfFeet - 29 <= arrayOfZones[zoneIndex].bottomEdge) {
        //  arrayOfZones[zoneIndex].claimStatus = 1;
        player1Here = true;
        if (player1Here) {
          console.log(arrayOfZones[zoneIndex]);
          character1.currentZone = arrayOfZones[zoneIndex].zoneNumber;
        }
        if (player2Here) {
          character2.currentZone = arrayOfZones[zoneIndex].zoneNumber;
        }
        }
        //console.log(arrayOfZones[0].claimStatus);
    //if either of character 1's feet are outside a zone, establish they are not in that zone, mainly for exiting zones
    //if (character1.leftEdgeOfFeet - 20 <= arrayOfZones[i].leftEdge || character1.rightEdgeOfFeet - 27 || arrayOfZones[i].rightEdge &&
    //    character1.topEdgeOfFeet - 25 || arrayOfZones[i].topEdge || character1.bottomEdgeOfFeet - 29 || arrayOfZones[i].bottomEdge) {
    //      arrayOfZones[i].character1InTheZone = false;
    //    }

    //same as above for character 2
    if (character2.leftEdgeOfFeet -20 >= arrayOfZones[zoneIndex].leftEdge && character2.rightEdgeOfFeet -27 <= arrayOfZones[zoneIndex].rightEdge &&
        character2.topEdgeOfFeet - 25 >= arrayOfZones[zoneIndex].topEdge && character2.bottomEdgeOfFeet - 29 <= arrayOfZones[zoneIndex].bottomEdge) {
          player2Here = true;
        }
        if (player1Here && player2Here) {
          arrayOfZones[zoneIndex].claimStatus = 3;
        } else if (player1Here) {
          arrayOfZones[zoneIndex].claimStatus = 1;
        } else if (player2Here) {
          arrayOfZones[zoneIndex].claimStatus = 2;
        } else {
          arrayOfZones[zoneIndex].claimStatus = 0;
        }
    //else if (character2.leftEdgeOfFeet -20 >= arrayOfZones[i].leftEdge && character2.rightEdgeOfFeet -27 <= arrayOfZones[i].rightEdge &&
    //    character2.topEdgeOfFeet - 25 >= arrayOfZones[i].topEdge && character2.bottomEdgeOfFeet - 29 <= arrayOfZones[i].bottomEdge) {
    //      arrayOfZones[i].character2InTheZone = false;
    //    }*/

    //set appropriate zone status

    /*if ( arrayOfZones[i].character2InTheZone === true ) {
      arrayOfZones[i].claimStatus = "character2InTheZone";
    }
    if ( arrayOfZones[i].character1InTheZone === true && arrayOfZones[i].character2InTheZone === true ) {
      arrayOfZones[i].claimStatus = "claimDanger";
    }
    if ( arrayOfZones[i].character1InTheZone !== true && arrayOfZones[i].character2InTheZone !== true) {
      arrayOfZones[i].claimStatus = "empty";
    }

    //if ( arrayOfZones[i].character1InTheZone === false && arrayOfZones[i].character2InTheZone === false) {
    //     arrayOfZones[i].claimStatus = "empty";
    //}
    //else {
    //    arrayOfZones[i].character1IntheZone = false;
    //    arrayOfZones[i].character2IntheZone = false;
    //    arrayOfZones[i].claimStatus = "empty";
    //}

    /*if ( (arrayOfZones[i].character1InTheZone === true && arrayOfZones[i].character2InTheZone === true) ||
         (arrayOfZones[i].character1InTheZone === true && arrayOfZones[i].character2Claimed === true) ||
         (arrayOfZones[i].character2InTheZone === true && arrayOfZones[i].character1Claimed === true) ) {

         arrayOfZones[i].claimDanger = true;
         arrayOfZones[i].claimStatus = "claimDanger";*/
//    }
  }
//}

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
    //console.log(canvasContext.fillStyle);
    updateZoneStatus(zoneIndex);
    arrayOfZones[zoneIndex].draw();
  }
}
