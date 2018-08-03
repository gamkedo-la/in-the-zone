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
	canvasContext.textAlign = "center";
}

//Used to draw text for Main Menu screen
function colorText(showWords, textX, textY, fillColor, textSize) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
	canvasContext.textAlign = "center";
	canvasContext.font = textSize + 'px' + ' Fjalla One';
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
function SpriteSheetClass(sheetIn, widthIn, heightIn) {
	var sheet = sheetIn;
	var width = widthIn;
	var height = heightIn;

	this.draw = function (col, row, atX, atY, ang) {
		canvasContext.save();
		canvasContext.translate(atX, atY);
		canvasContext.rotate(ang);
		canvasContext.drawImage(sheet,
			col * width,//x coordinate to where you start clipping
			row * height,//y coordinate to where you start clipping
			width,//width of the clipped image
			height,// height of the clipped image
			-width / 2,//x coordinate where to place image on canvas
			-height / 2,//y coordinate where to place image on canvas
			width,//width of the image to use
			height);//height of the image to use
		canvasContext.restore();
	}
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

// rotates and stretches a bitmap to go from point A to point B, used by Woosh Lines FX
function drawBitmapLine(useBitmap, startX, startY, endX, endY) {
	var lineLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
	var lineAngle = Math.atan2(endY - startY, endX - startX);
	// edge case: avoid floating point imprecision flickering of angle on small values
	if (lineLength < 1) {
		// we COULD just not render, but this leaves gaps in the effect
		// if we are drawing multiple lines close together
		// return; 
		lineAngle = 0;
		lineLength = 1;
	}
	canvasContext.save();
	canvasContext.translate(startX, startY);
	canvasContext.rotate(lineAngle);
	canvasContext.translate(0, - useBitmap.height / 2);
	canvasContext.drawImage(useBitmap,
		0, 0, useBitmap.width, useBitmap.height, // src 
		0, 0, lineLength, useBitmap.height);     // dest
	canvasContext.restore();
}
