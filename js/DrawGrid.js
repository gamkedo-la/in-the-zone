
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

drawQuadrilateralZone(2,205, 72,205, 45,278, 2,278, 1);
drawQuadrilateralZone(79,205, 190,205, 190,278, 54,278, 2);
drawQuadrilateralZone(190,205, 322,205, 310,278, 190,278, 3);
drawQuadrilateralZone(330,205, 400,205, 400,278, 320,278, 4);
drawQuadrilateralZone(400,205, 471,205, 481,278, 400,278, 5);
drawQuadrilateralZone(481,205, 602,205, 602,278, 490,278, 6);
drawQuadrilateralZone(602,205, 724,205, 752,278, 602,278, 7);
drawQuadrilateralZone(732,205, 798,205, 798,278, 761,278, 8);
drawPentagonalZone(2,278, 45,278, 40,315, 55,350, 2,350, 9);
drawPentagonalZone(55,278, 190,278, 190,350, 65,350, 50,315, 10);
drawQuadrilateralZone(190,278, 310,278, 300,350, 190,350, 11);
drawQuadrilateralZone(318,278, 400,278, 400,350, 307,350, 12);
drawQuadrilateralZone(400,278, 481,278, 491,350, 400,350, 13);
drawQuadrilateralZone(490,278, 602,278, 602,350, 502,350, 14);
drawPentagonalZone(602,278, 752,278, 755,315, 740,350, 600,350, 15);
drawPentagonalZone(761,278, 798,278, 798,350, 752,350, 764,318, 16);
drawPentagonalZone(2,350, 50,350, 115,415, 200,455, 2,455, 17);
drawQuadrilateralZone(65,350, 190,350, 190,438, 117,400, 18);
drawQuadrilateralZone(190,350, 300,350, 287,438, 190,438, 19);
drawQuadrilateralZone(307,350, 491,350, 494,470, 304,470, 20);
drawQuadrilateralZone(502,350, 602,350, 602,440, 525,460, 21);
drawQuadrilateralZone(600,350, 740,350, 690,395, 602,440, 22);
drawPentagonalZone(752,350, 798,350, 798,460, 602,457, 705,410, 23);
drawQuadrilateralZone(130,430, 310,480, 310,520, 130,520, 24);//labels are off, obviously, haha
drawQuadrilateralZone(310,480, 494,470, 494,520, 310,520, 25);
drawQuadrilateralZone(494,470, 680,430, 680,520, 494,520, 26);//labels are off
}
