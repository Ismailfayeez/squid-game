export class Background {
    constructor(game) {
        this.game = game
        this.ctx = game.ctx
        this.boundary = game.boundary
    }

    draw() {
        const img = document.getElementById('play-area')
        this.ctx.drawImage(img, 0, 0, this.game.width, this.game.height)
    }
}
