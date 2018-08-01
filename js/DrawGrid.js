var claimColor = [undefined,"blue","green","red","green","blue"];
function drawQuadrilateralZone(x1,y1, x2,y2, x3,y3, x4,y4, zoneNumber, claimedByPlayerNumber) {
  canvasContext.beginPath();
  canvasContext.moveTo(x1,y1);
  canvasContext.lineTo(x2,y2);
  canvasContext.lineTo(x3,y3);
  canvasContext.lineTo(x4,y4);
  canvasContext.lineTo(x1,y1);
  canvasContext.stroke();
  if (claimedByPlayerNumber > 0) {
    canvasContext.fillStyle = claimColor[claimedByPlayerNumber];
    canvasContext.fill();
  }
  let centerX = (x2-x1)/2 + x1;
  let centerY = (y3-y2)/2 + y1;
  canvasContext.fillStyle = "blue";
  //canvasContext.fillText("Zone " + zoneNumber, (x2-x1)/2 - 20 + x1, y1 + 10);
  //canvasContext.fillText(centerX + ", " + centerY, centerX - 15,centerY);
}

function drawPentagonalZone(x1,y1, x2,y2, x3,y3, x4,y4, x5,y5, zoneNumber, claimedByPlayerNumber) {
  canvasContext.beginPath();
  canvasContext.moveTo(x1,y1);
  canvasContext.lineTo(x2,y2);
  canvasContext.lineTo(x3,y3);
  canvasContext.lineTo(x4,y4);
  canvasContext.lineTo(x5,y5);
  canvasContext.lineTo(x1,y1);
  canvasContext.stroke();
  if (claimedByPlayerNumber > 0) {
    canvasContext.fillStyle = claimColor[claimedByPlayerNumber];
    canvasContext.fill();
  }
  let centerX = (x2-x1)/2 + x1;
  let centerY = (y4-y1)/2 + y1;
  canvasContext.fillStyle = "blue";
  //canvasContext.fillText("Zone " + zoneNumber, (x2-x1)/2 - 20 + x1, y1 + 10);
  //canvasContext.fillText(centerX + ", " + centerY, centerX - 15,centerY);
}
