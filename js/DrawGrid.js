var claimColor = [undefined,"#233663","#309c63","#c93038","#51c43f","#417291"];

function drawAnyZone(points, zoneNumber, claimedByPlayerNumber) {
  canvasContext.strokeStyle = "#383542";
  canvasContext.beginPath();
  canvasContext.moveTo(points[0].x, points[0].y);
  
  for(let i = 1; i < points.length; i++) {
    canvasContext.lineTo(points[i].x,points[i].y);
  }
  canvasContext.lineTo(points[0].x,points[0].y);

  canvasContext.stroke();
  
  if (claimedByPlayerNumber > 0) {
    canvasContext.fillStyle = claimColor[claimedByPlayerNumber];
    canvasContext.fill();
  }
  
  let centerX = (points[1].x - points[0].x)/2 + points[0].x;
  let centerY = (points[points.length - 1].y - points[0].y)/2 + points[0].y;
  canvasContextFillStyle = "blue";
}
