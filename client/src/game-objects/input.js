export class InputHandler {
  constructor(game, inputMode, handleInput) {
    this.game = game;
    this.currentPlayer = game.players.players[game.data.me.name];
    this.handleInput = handleInput;
    this.inputMode = inputMode;
    this.previousX;

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
    addEventListener("touchstart", () => this.triggerAction());
  }

  validate() {
    if (this.inputMode === "camera") this.triggerAction();
  }
}
