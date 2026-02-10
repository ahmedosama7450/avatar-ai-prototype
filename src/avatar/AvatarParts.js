/**
 * Individual drawing functions for each avatar part.
 * All functions take a Canvas 2D context and a params object with normalized values.
 * Drawing coordinates are based on a 512x640 canvas.
 */

const CX = 256; // canvas center X
const CY_HEAD = 240; // head center Y
const CY_BODY = 480; // body center Y

export function drawBackground(ctx, w, h) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#fdf6ee");
  grad.addColorStop(1, "#f5ece0");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

export function drawBody(ctx, params) {
  const bounce = (params.bodyBounce || 0) * 20;
  const bodyY = CY_BODY - bounce;

  ctx.save();
  ctx.translate(CX + params.headX * 8, bodyY);

  // Neck
  ctx.fillStyle = "#f5d0a9";
  ctx.beginPath();
  ctx.moveTo(-20, -80);
  ctx.lineTo(20, -80);
  ctx.lineTo(18, -40);
  ctx.lineTo(-18, -40);
  ctx.closePath();
  ctx.fill();

  // Shirt body
  const shirtGrad = ctx.createLinearGradient(0, -45, 0, 120);
  shirtGrad.addColorStop(0, "#6db3d2");
  shirtGrad.addColorStop(1, "#5a9ab8");
  ctx.fillStyle = shirtGrad;

  ctx.beginPath();
  ctx.moveTo(-65, -35);
  ctx.bezierCurveTo(-70, 0, -75, 60, -70, 160);
  ctx.lineTo(70, 160);
  ctx.bezierCurveTo(75, 60, 70, 0, 65, -35);
  ctx.closePath();
  ctx.fill();

  // Collar
  ctx.fillStyle = "#5fa8c6";
  ctx.beginPath();
  ctx.moveTo(-30, -40);
  ctx.bezierCurveTo(-15, -25, 0, -20, 0, -20);
  ctx.bezierCurveTo(0, -20, 15, -25, 30, -40);
  ctx.bezierCurveTo(20, -30, -20, -30, -30, -40);
  ctx.fill();

  // Left arm (always at side)
  ctx.fillStyle = "#6db3d2";
  ctx.beginPath();
  ctx.moveTo(-65, -25);
  ctx.bezierCurveTo(-85, 0, -90, 50, -80, 100);
  ctx.bezierCurveTo(-70, 100, -60, 95, -55, 50);
  ctx.bezierCurveTo(-55, 20, -55, 0, -58, -20);
  ctx.closePath();
  ctx.fill();

  // Left hand
  ctx.fillStyle = "#f5d0a9";
  ctx.beginPath();
  ctx.arc(-78, 105, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawRightArm(ctx, params) {
  const bounce = (params.bodyBounce || 0) * 20;
  const bodyY = CY_BODY - bounce;
  const angle = (params.armRightAngle || 0) * (Math.PI / 180);
  const wave = params.armRightWave || 0;

  ctx.save();
  ctx.translate(CX + params.headX * 8 + 65, bodyY - 25);
  ctx.rotate(-angle + Math.sin(wave * Math.PI * 2) * 0.15);

  // Arm
  ctx.fillStyle = "#6db3d2";
  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.bezierCurveTo(20, 25, 25, 60, 18, 110);
  ctx.bezierCurveTo(8, 110, -2, 105, 0, 55);
  ctx.bezierCurveTo(-2, 25, -5, 5, -7, -5);
  ctx.closePath();
  ctx.fill();

  // Hand
  ctx.fillStyle = "#f5d0a9";
  ctx.beginPath();
  ctx.arc(16, 115, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawHead(ctx, params) {
  const bounce = (params.bodyBounce || 0) * 20;
  const headX = CX + (params.headX || 0) * 15;
  const headY = CY_HEAD + (params.headY || 0) * 12 - bounce;
  const tilt = (params.headTilt || 0) * (Math.PI / 180);

  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(tilt);

  // Head shape - oval
  const skinGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 100);
  skinGrad.addColorStop(0, "#fce0c4");
  skinGrad.addColorStop(0.7, "#f5d0a9");
  skinGrad.addColorStop(1, "#ebb98a");
  ctx.fillStyle = skinGrad;

  ctx.beginPath();
  ctx.ellipse(0, 0, 90, 105, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle outline
  ctx.strokeStyle = "rgba(180, 140, 100, 0.2)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Ears
  drawEar(ctx, -85, -5, false);
  drawEar(ctx, 85, -5, true);

  ctx.restore();
}

function drawEar(ctx, x, y, flip) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);

  ctx.fillStyle = "#f5d0a9";
  ctx.beginPath();
  ctx.ellipse(0, 0, 14, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner ear
  ctx.fillStyle = "#eec4a0";
  ctx.beginPath();
  ctx.ellipse(-2, 0, 8, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawEyes(ctx, params) {
  const bounce = (params.bodyBounce || 0) * 20;
  const headX = CX + (params.headX || 0) * 15;
  const headY = CY_HEAD + (params.headY || 0) * 12 - bounce;
  const tilt = (params.headTilt || 0) * (Math.PI / 180);
  const openness = params.eyeOpenness ?? 1;
  const scale = params.eyeScale ?? 1;
  const pupilX = params.pupilX || 0;
  const pupilY = params.pupilY || 0;

  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(tilt);

  const eyeSpacing = 38;
  const eyeY = -12;

  for (const side of [-1, 1]) {
    const ex = side * eyeSpacing;
    const ey = eyeY;

    const eyeW = 24 * scale;
    const eyeH = 28 * scale * Math.max(openness, 0.05);

    // White of eye
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.ellipse(ex, ey, eyeW, eyeH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(90, 60, 40, 0.25)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    if (openness > 0.15) {
      const irisR = 15 * scale;
      const px = ex + pupilX * 7;
      const py = ey + pupilY * 5;

      // Iris with gradient
      const irisGrad = ctx.createRadialGradient(
        px - 2,
        py - 2,
        1,
        px,
        py,
        irisR,
      );
      irisGrad.addColorStop(0, "#4a3222");
      irisGrad.addColorStop(0.5, "#7b5236");
      irisGrad.addColorStop(1, "#5c3a24");
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.arc(px, py, irisR, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = "#1a0e06";
      ctx.beginPath();
      ctx.arc(px, py, 6 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Main highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
      ctx.beginPath();
      ctx.arc(px - 5, py - 5, 4.5 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Small secondary highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(px + 3, py + 3, 2 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

export function drawEyebrows(ctx, params) {
  const bounce = (params.bodyBounce || 0) * 20;
  const headX = CX + (params.headX || 0) * 15;
  const headY = CY_HEAD + (params.headY || 0) * 12 - bounce;
  const tilt = (params.headTilt || 0) * (Math.PI / 180);
  const raise = (params.eyebrowRaise || 0) * 8;

  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(tilt);

  ctx.strokeStyle = "#6b4c35";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  for (const side of [-1, 1]) {
    const bx = side * 38;
    const by = -45 - raise;

    ctx.beginPath();
    ctx.moveTo(bx - side * 18, by + 3);
    ctx.quadraticCurveTo(bx, by - 4, bx + side * 18, by + 1);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawNose(ctx, params) {
  const bounce = (params.bodyBounce || 0) * 20;
  const headX = CX + (params.headX || 0) * 15;
  const headY = CY_HEAD + (params.headY || 0) * 12 - bounce;
  const tilt = (params.headTilt || 0) * (Math.PI / 180);

  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(tilt);

  ctx.strokeStyle = "rgba(160, 120, 80, 0.35)";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(-2, 10);
  ctx.quadraticCurveTo(0, 22, 5, 18);
  ctx.stroke();

  ctx.restore();
}

export function drawMouth(ctx, params) {
  const bounce = (params.bodyBounce || 0) * 20;
  const headX = CX + (params.headX || 0) * 15;
  const headY = CY_HEAD + (params.headY || 0) * 12 - bounce;
  const tilt = (params.headTilt || 0) * (Math.PI / 180);
  const openAmount = params.mouthOpen || 0;
  const smile = params.mouthSmile ?? 0.5;
  const width = (params.mouthWidth ?? 0.5) * 60;

  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(tilt);

  const my = 40;
  const smileCurve = smile * 18;

  if (openAmount > 0.1) {
    // Open mouth (talking or expressing)
    const openH = openAmount * 18;

    ctx.fillStyle = "#c44040";
    ctx.beginPath();
    ctx.moveTo(-width, my);
    ctx.quadraticCurveTo(0, my + smileCurve + openH, width, my);
    ctx.quadraticCurveTo(0, my + smileCurve - openH * 0.2, -width, my);
    ctx.closePath();
    ctx.fill();

    // Tongue hint for wider openings
    if (openAmount > 0.4) {
      ctx.fillStyle = "#d66060";
      ctx.beginPath();
      ctx.ellipse(
        0,
        my + smileCurve * 0.5 + openH * 0.3,
        width * 0.4,
        openH * 0.35,
        0,
        0,
        Math.PI,
      );
      ctx.fill();
    }

    // Teeth for bigger openings
    if (openAmount > 0.3) {
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(-width * 0.7, my + 1);
      ctx.quadraticCurveTo(0, my + 4, width * 0.7, my + 1);
      ctx.lineTo(width * 0.7, my + 5);
      ctx.quadraticCurveTo(0, my + 7, -width * 0.7, my + 5);
      ctx.closePath();
      ctx.fill();
    }
  } else {
    // Closed mouth - smile line
    ctx.strokeStyle = "#b07060";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(-width, my);
    ctx.quadraticCurveTo(0, my + smileCurve, width, my);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawBlush(ctx, params) {
  const bounce = (params.bodyBounce || 0) * 20;
  const headX = CX + (params.headX || 0) * 15;
  const headY = CY_HEAD + (params.headY || 0) * 12 - bounce;
  const tilt = (params.headTilt || 0) * (Math.PI / 180);
  const opacity = params.blushOpacity || 0;

  if (opacity < 0.01) return;

  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(tilt);

  for (const side of [-1, 1]) {
    const bx = side * 55;
    const by = 15;
    const blushGrad = ctx.createRadialGradient(bx, by, 2, bx, by, 18);
    blushGrad.addColorStop(0, `rgba(255, 150, 150, ${opacity})`);
    blushGrad.addColorStop(1, `rgba(255, 150, 150, 0)`);
    ctx.fillStyle = blushGrad;
    ctx.beginPath();
    ctx.ellipse(bx, by, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawHair(ctx, params) {
  const bounce = (params.bodyBounce || 0) * 20;
  const headX = CX + (params.headX || 0) * 15;
  const headY = CY_HEAD + (params.headY || 0) * 12 - bounce;
  const tilt = (params.headTilt || 0) * (Math.PI / 180);

  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(tilt);

  const hairGrad = ctx.createLinearGradient(-80, -120, 80, -40);
  hairGrad.addColorStop(0, "#6b4226");
  hairGrad.addColorStop(0.5, "#7a5033");
  hairGrad.addColorStop(1, "#5c3820");

  ctx.fillStyle = hairGrad;

  // Main hair shape
  ctx.beginPath();
  ctx.moveTo(-80, -20);
  ctx.bezierCurveTo(-92, -60, -85, -100, -55, -110);
  ctx.bezierCurveTo(-30, -120, -10, -118, 0, -115);
  ctx.bezierCurveTo(10, -118, 40, -120, 60, -108);
  ctx.bezierCurveTo(85, -95, 92, -55, 82, -15);
  ctx.bezierCurveTo(85, -40, 80, -80, 55, -92);
  ctx.bezierCurveTo(35, -100, 10, -100, 0, -98);
  ctx.bezierCurveTo(-10, -100, -40, -98, -58, -90);
  ctx.bezierCurveTo(-78, -75, -82, -45, -80, -20);
  ctx.closePath();
  ctx.fill();

  // Bangs - left swooping section
  ctx.fillStyle = "#7a5033";
  ctx.beginPath();
  ctx.moveTo(-60, -60);
  ctx.bezierCurveTo(-45, -85, -20, -95, 10, -90);
  ctx.bezierCurveTo(-5, -80, -25, -65, -40, -55);
  ctx.closePath();
  ctx.fill();

  // Bangs - right tuft
  ctx.beginPath();
  ctx.moveTo(20, -80);
  ctx.bezierCurveTo(35, -95, 55, -85, 60, -65);
  ctx.bezierCurveTo(50, -70, 35, -70, 25, -65);
  ctx.closePath();
  ctx.fill();

  // Hair highlight
  ctx.strokeStyle = "rgba(160, 110, 70, 0.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-30, -95);
  ctx.quadraticCurveTo(-10, -105, 15, -92);
  ctx.stroke();

  ctx.restore();
}
