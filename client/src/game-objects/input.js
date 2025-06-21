export class InputHandler {
  constructor(game, inputMode, handleInput) {
    this.game = game;
    this.currentPlayer = game.players.players[game.data.me.name];
    this.handleInput = handleInput;
    this.inputMode = inputMode;
    this.previousX;
    this.touch = false;

    this.triggerAction = () => {
      const {
        status: playerStatus,
        playerMoving,
        hidePlayer,
        x,
      } = this.currentPlayer || {};

      const isSameInput = x === this.previousX;

      const isActivePlayer =
        game.data.status === "STARTED" && playerStatus !== "DEAD";

      if (isActivePlayer && !isSameInput && !playerMoving && !hidePlayer) {
        const response = handleInput(this.inputMode);
        if (response) this.previousX = x;
      }
    };

    if (inputMode === "keys")
      addEventListener("keydown", () => this.triggerAction());
    addEventListener("touchstart", () => {
      this.touch = true;
      function handleTouch() {
        if (this.touch) {
          this.triggerAction();
          setTimeout(() => {
            handleTouch();
          }, 50);
        }
      }
      handleTouch();
    });
    addEventListener("touchend", () => {
      this.touch = false;
    });
  }

  validate() {
    if (this.inputMode === "camera") this.triggerAction();
  }
}
