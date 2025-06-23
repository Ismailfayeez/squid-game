import { Background } from "./background";
import { Doll } from "./doll";
import { EndLine } from "./endLine";
import { InputHandler } from "./input";
import { Notification } from "./notification";
import { Players } from "./players";
import { Shooters } from "./shooters";
import { Sound } from "./sound";
import { Timer } from "./timer";

export class GameArena {
  constructor(
    ctx,
    frameRate,
    width,
    height,
    data = {},
    inputMode,
    handleInput,
    handleFinish
  ) {
    this.ctx = ctx;
    this.frameRate = frameRate;
    this.width = width;
    this.height = height;
    this.boundary = 193;
    this.finishArea = 150;
    this.data = data;
    this.background = new Background(this);
    this.endLine = new EndLine(this);
    this.timer = new Timer(this);
    this.doll = new Doll(this);
    this.shooters = new Shooters(this);
    this.players = new Players(this);
    this.input = new InputHandler(this, inputMode, handleInput);
    this.sound = new Sound(this);
    this.notification = new Notification(this);
    this.handleFinish = handleFinish;
  }
  draw() {
    this.background.draw();
    this.endLine.draw();
    this.notification.draw();
    this.timer.draw();

    this.players.draw();
    this.doll.draw();
    this.shooters.draw();
  }
  update(frameRate, data) {
    this.frameRate = frameRate;
    this.data = data;
    this.timer.update();
    this.doll.update();
    this.input.validate();
    this.players.update();
    this.checkCollision();
    this.notification.update();
  }
  checkCollision() {
    const me = this.data.me.name;
    const currentPlayer = this.players.players[me];

    const { frameX, frameY, bodyWidth: width, status } = currentPlayer;
    const footStartPoint = 10;
    if (status === "ALIVE")
      for (let i = frameX + width - footStartPoint; i >= frameX; i--) {
        const isFinished = this.ctx.isPointInStroke(
          this.endLine.path,
          i,
          frameY
        );

        if (isFinished) {
          this.handleFinish();
          break;
        }
      }
  }
}
