import { PlayerDead } from "./playerDead";

export class Bullet {
  constructor(game) {
    this.globalGame = game.game;
    this.game = game;
    this.ctx = game.ctx;
    this.shooters = game.shooters;

    this.getStartPoint = (_x, y) =>
      y > this.shooters.rightShooter.y
        ? this.shooters.leftShooter
        : this.shooters.rightShooter;

    this.currentX = 0;
    this.currentY = 0;
  }
  draw(destX, destY) {
    const { frameRate } = this.globalGame;
    const { x: srcX, y, position } = this.getStartPoint(destX, destY);
    const srcY = position === "top" ? y - 60 : y + 60;

    const distX = Math.abs(destX - srcX);
    const distY = Math.abs(destY - srcY);

    const divisor = distX > distY ? distX : distY;
    const frameX = (distX / divisor) * 40;
    const frameY = (distY / divisor) * 40;

    this.currentX += frameX + frameRate;
    this.currentY += frameY + frameRate;

    const drawX = destX > srcX ? srcX + this.currentX : srcX - this.currentX;
    const drawY = destY > srcY ? srcY + this.currentY : srcY - this.currentY;

    if (
      !((destX <= drawX && drawX <= srcX) || (srcX <= drawX && drawX <= destX))
    )
      return (this.game.deadStatus = "SHOTED");

    this.ctx.save();
    this.ctx.fillStyle = "black";
    this.ctx.translate(drawX + 10, drawY + 2.5);
    this.ctx.rotate(Math.atan2(destY - srcY, destX - srcX));
    this.ctx.fillRect(-10, -2.5, 20, 5);
    this.ctx.restore();

    this.currentX += frameX + frameRate;
    this.currentY += frameY + frameRate;
  }
  play() {
    if (!(this.currentX && this.currentY))
      this.globalGame.sound.play("pistol", 0.5);
  }
}
