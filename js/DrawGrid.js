
function drawQuadrilateralZone(x1,y1, x2,y2, x3,y3, x4,y4, zoneNumber) {
  canvasContext.beginPath();
  canvasContext.moveTo(x1,y1);
  canvasContext.lineTo(x2,y2);
  canvasContext.lineTo(x3,y3);
  canvasContext.lineTo(x4,y4);
  canvasContext.lineTo(x1,y1);
  canvasContext.stroke();
  let centerX = (x2-x1)/2 + x1;
  let centerY = (y3-y2)/2 + y1;
  canvasContext.fillStyle = "blue";
  canvasContext.fillText("Zone " + zoneNumber, (x2-x1)/2 - 20 + x1, y1 + 10);
  canvasContext.fillText(centerX + ", " + centerY, centerX - 15,centerY);
}

function drawPentagonalZone(x1,y1, x2,y2, x3,y3, x4,y4, x5,y5, zoneNumber) {
  canvasContext.beginPath();
  canvasContext.moveTo(x1,y1);
  canvasContext.lineTo(x2,y2);
  canvasContext.lineTo(x3,y3);
  canvasContext.lineTo(x4,y4);
  canvasContext.lineTo(x5,y5);
  canvasContext.lineTo(x1,y1);
  canvasContext.stroke();
  let centerX = (x2-x1)/2 + x1;
  let centerY = (y4-y1)/2 + y1;
  canvasContext.fillStyle = "blue";
  canvasContext.fillText("Zone " + zoneNumber, (x2-x1)/2 - 20 + x1, y1 + 10);
  canvasContext.fillText(centerX + ", " + centerY, centerX - 15,centerY);
}

function drawGrid() {
canvasContext.fillText(mouseX + " " + mouseY, mouseX, mouseY); //drawing mouse coordinates on the screen to map out zones

drawQuadrilateralZone(0,203, 72,203, 45,278, 0,278, 1);
drawQuadrilateralZone(72,203, 190,203, 190,278, 45,278, 0);
drawQuadrilateralZone(190,203, 322,203, 310,278, 190,278, 3);
drawQuadrilateralZone(322,203, 400,203, 400,278, 310,278, 4);
drawQuadrilateralZone(400,203, 480,203, 490,278, 400,278, 5);
drawQuadrilateralZone(480,203, 602,203, 602,278, 490,278, 6);
drawQuadrilateralZone(602,203, 730,203, 760,278, 602,278, 7);
drawQuadrilateralZone(730,203, 800,203, 800,278, 760,278, 8);
drawPentagonalZone(0,278, 45,278, 40,315, 55,350, 0,350, 9);
drawPentagonalZone(45,278, 190,278, 190,350, 55,350, 40,315, 10);
drawQuadrilateralZone(190,278, 310,278, 300,350, 190,350, 11);
drawQuadrilateralZone(310,278, 400,278, 400,350, 300,350, 12);
drawQuadrilateralZone(400,278, 490,278, 502,350, 400,350, 13);
drawQuadrilateralZone(490,278, 602,278, 602,350, 502,350, 14);
drawPentagonalZone(602,278, 760,278, 760,315, 750,350, 602,350, 15);
drawPentagonalZone(760,278, 800,278, 800,350, 750,350, 760,315, 16);
drawPentagonalZone(0,350, 50,350, 115,412, 190,450, 0,450, 17);
drawQuadrilateralZone(50,350, 190,350, 190,450, 115,412, 18);
drawQuadrilateralZone(190,350, 300,350, 280,468, 190,450, 19);
//drawQuadrilateralZone(300,350, 502,350, 517,468, 280,468, 20);
drawPentagonalZone(300,350, 502,350, 517,468, 400,478, 280,468, 20);
drawQuadrilateralZone(502,350, 602,350, 602,448, 517,468, 21);
drawQuadrilateralZone(602,350, 750,350, 693,408, 602,448, 22);
drawPentagonalZone(750,350, 800,350, 800,448, 602,448, 693,408, 23);
drawQuadrilateralZone(190,450, 280,468, 280,520, 190,520, 24);//labels are off, obviously, haha
// drawQuadrilateralZone(280,468, 494,470, 494,520, 280,520, 25);
drawPentagonalZone(280,468, 400,478, 517,468, 517,520, 280,520, 25);
drawQuadrilateralZone(517,468, 602,448, 602,520, 517,520, 26);//labels are off
}
