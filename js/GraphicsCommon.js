function drawBitmapCenteredWithRotation(useBitmap, atX, atY, withAng) {
	canvasContext.save();
	canvasContext.translate(atX, atY);
	canvasContext.rotate(withAng);
	canvasContext.drawImage(useBitmap, -useBitmap.width / 2, -useBitmap.height / 2);
	canvasContext.restore();
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}
function colorTriangle(aX, aY, bX, bY, cX, cY, color) {
	canvasContext.beginPath();
	canvasContext.moveTo(aX, aY);
	canvasContext.lineTo(bX, bY);
	canvasContext.lineTo(cX, cY);
	canvasContext.closePath();

	canvasContext.lineWidth = 2;
	canvasContext.strokeStyle = color;
	canvasContext.stroke();
}

function drawBitmapWithRotation(useBitmap, atX, atY, withAng) {

	canvasContext.save();
	canvasContext.translate(atX, atY);
	canvasContext.rotate(-withAng);
	canvasContext.drawImage(useBitmap, -useBitmap.width / 2, -useBitmap.height / 2);
	canvasContext.restore();

}

// Accepted formats for fillColorAlpha: standard named color string (alpha = 1) or [r,g,b,a] 
//Used in conjunction with the ParticleRenderer
function colorCircleAlpha(centerX, centerY, radius, fillColorAlpha) {

	// Support for the default named colors like "purple"
	if (Array.isArray(fillColorAlpha) === false) {
		canvasContext.fillStyle = fillColorAlpha;
	} else {
		canvasContext.fillStyle = "rgba(" + fillColorAlpha[0] + "," + fillColorAlpha[1] + "," + fillColorAlpha[2] + "," + fillColorAlpha[3] + ")";
	} //generate the color from the rgba array

	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true); //Début, fin, horaire ou anti horaire
	canvasContext.fill();

}
