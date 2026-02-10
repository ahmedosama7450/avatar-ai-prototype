import {
  drawBackground,
  drawBody,
  drawRightArm,
  drawHead,
  drawHair,
  drawEyes,
  drawEyebrows,
  drawNose,
  drawMouth,
  drawBlush,
} from './AvatarParts.js';

export class AvatarRenderer {
  constructor(width = 512, height = 640) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.width = width;
    this.height = height;
  }

  render(params) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Draw back-to-front
    drawBackground(ctx, this.width, this.height);
    drawBody(ctx, params);
    drawHead(ctx, params);
    drawEyes(ctx, params);
    drawEyebrows(ctx, params);
    drawNose(ctx, params);
    drawMouth(ctx, params);
    drawBlush(ctx, params);
    drawHair(ctx, params);
    drawRightArm(ctx, params);
  }

  getCanvas() {
    return this.canvas;
  }
}
