let arrayOfZones = new Array();
let initializeArrayOfZones;
let drawZones;

function zoneClass(x1,y1, x2,y2, x3,y3, x4,y4, x5,y5, zoneNumber) {

  this.zoneNumber = zoneNumber;
  this.unclaimed = true;

  this.claimStatus = "empty";
  this.character1InTheZone = false;
  this.character2InTheZone = false;
  this.character1Claimed = false;
  this.character2Claimed = false;
  this.claimDanger = false;

  this.x1 = x1; this.x2 = x2; this.x3 = x3; this.x4 = x4; this.x5 = x5;
  this.y1 = y1; this.y2 = y2; this.y3 = y3, this.y4 = y4; this.y5 = y5;
  this.topEdge = this.y1; this.rightEdge = this.x2; this.bottomEdge = this.y4; this.leftEdge = this.x1;

  this.draw = function() {

    console.log(this.claimStatus, this.zoneNumber);
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
    if (character1.leftEdgeOfFeet - 20 >= arrayOfZones[zoneIndex].leftEdge && character1.rightEdgeOfFeet - 27 <= arrayOfZones[zoneIndex].rightEdge &&
        character1.topEdgeOfFeet - 25 >= arrayOfZones[zoneIndex].topEdge && character1.bottomEdgeOfFeet - 29 <= arrayOfZones[zoneIndex].bottomEdge) {
          arrayOfZones[zoneIndex].character1InTheZone = true;
        }
        //console.log(arrayOfZones[0].claimStatus);
    //if either of character 1's feet are outside a zone, establish they are not in that zone, mainly for exiting zones
    /*if (character1.leftEdgeOfFeet - 20 <= arrayOfZones[i].leftEdge || character1.rightEdgeOfFeet - 27 || arrayOfZones[i].rightEdge &&
        character1.topEdgeOfFeet - 25 || arrayOfZones[i].topEdge || character1.bottomEdgeOfFeet - 29 || arrayOfZones[i].bottomEdge) {
          arrayOfZones[i].character1InTheZone = false;
        }

    //same as above for character 2
    if (character2.leftEdgeOfFeet -20 >= arrayOfZones[i].leftEdge && character2.rightEdgeOfFeet -27 <= arrayOfZones[i].rightEdge &&
        character2.topEdgeOfFeet - 25 >= arrayOfZones[i].topEdge && character2.bottomEdgeOfFeet - 29 <= arrayOfZones[i].bottomEdge) {
          arrayOfZones[i].character2InTheZone = true;
        }
    else if (character2.leftEdgeOfFeet -20 >= arrayOfZones[i].leftEdge && character2.rightEdgeOfFeet -27 <= arrayOfZones[i].rightEdge &&
        character2.topEdgeOfFeet - 25 >= arrayOfZones[i].topEdge && character2.bottomEdgeOfFeet - 29 <= arrayOfZones[i].bottomEdge) {
          arrayOfZones[i].character2InTheZone = false;
        }*/

    //set appropriate zone status
    if ( arrayOfZones[zoneIndex].character1InTheZone === true ) {
      arrayOfZones[zoneIndex].claimStatus = "character1IntheZone";
    }
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
    arrayOfZones.push(new zoneClass(2,205, 72,205, 45,278, 2,278, undefined,undefined, 1));
    arrayOfZones.push(new zoneClass(79,205, 190,205, 190,278, 54,278, undefined,undefined, 2));
    arrayOfZones.push(new zoneClass(190,205, 322,205, 310,278, 190,278, undefined,undefined, 3));
    arrayOfZones.push(new zoneClass(330,205, 400,205, 400,278, 320,278, undefined,undefined, 4));
    arrayOfZones.push(new zoneClass(400,205, 471,205, 481,278, 400,278, undefined,undefined,5));
    arrayOfZones.push(new zoneClass(481,205, 602,205, 602,278, 490,278, undefined,undefined, 6));
    arrayOfZones.push(new zoneClass(602,205, 724,205, 752,278, 602,278, undefined,undefined,7));
    arrayOfZones.push(new zoneClass(732,205, 798,205, 798,278, 761,278, undefined,undefined,8));
    arrayOfZones.push(new zoneClass(2,278, 45,278, 40,315, 55,350, 2,350, 9));
    arrayOfZones.push(new zoneClass(55,278, 190,278, 190,350, 65,350, 50,315, 10));
    arrayOfZones.push(new zoneClass(190,278, 310,278, 300,350, 190,350, undefined,undefined, 11));
    arrayOfZones.push(new zoneClass(318,278, 400,278, 400,350, 307,350, undefined,undefined, 12));
    arrayOfZones.push(new zoneClass(400,278, 481,278, 491,350, 400,350, undefined,undefined, 13));
    arrayOfZones.push(new zoneClass(490,278, 602,278, 602,350, 502,350, undefined,undefined, 14));
    arrayOfZones.push(new zoneClass(602,278, 752,278, 755,315, 740,350, 600,350, 15));
    arrayOfZones.push(new zoneClass(761,278, 798,278, 798,350, 752,350, 764,318, 16));
    arrayOfZones.push(new zoneClass(2,350, 50,350, 115,415, 200,455, 2,455, 17));
    arrayOfZones.push(new zoneClass(65,350, 190,350, 190,438, 117,400, undefined,undefined, 18));
    arrayOfZones.push(new zoneClass(190,350, 300,350, 287,438, 190,438, undefined,undefined, 19));
    arrayOfZones.push(new zoneClass(307,350, 491,350, 494,470, 304,470, undefined,undefined, 20));
    arrayOfZones.push(new zoneClass(502,350, 602,350, 602,440, 525,460, undefined,undefined, 21));
    arrayOfZones.push(new zoneClass(600,350, 740,350, 690,395, 602,440, undefined,undefined, 22));
    arrayOfZones.push(new zoneClass(752,350, 798,350, 798,460, 602,457, 705,410, 23));
    arrayOfZones.push(new zoneClass(130,430, 310,480, 310,520, 130,520, undefined,undefined, 24));
    arrayOfZones.push(new zoneClass(310,480, 494,470, 494,520, 310,520, undefined,undefined, 25));
    arrayOfZones.push(new zoneClass(494,470, 680,430, 680,520, 494,520, undefined,undefined, 26));
}

drawZones = () => {
  for (let zoneIndex = 0; zoneIndex<26; zoneIndex++) {
    //console.log(canvasContext.fillStyle);
    updateZoneStatus(zoneIndex);
    arrayOfZones[zoneIndex].draw();
  }
  canvasContext.fillStyle = "blue";
	canvasContext.fillRect(canvas.width/2,canvas.height/2, 100,100);
}
