export class Doll {
    constructor(game) {
        this.game = game
        this.ctx = game.ctx
        this.size = 2
        const playAreaY = game.height - game.boundary
        const midAreaY = Math.round(playAreaY * 0.5)
        this.x = game.width - 110
        this.y = game.boundary + midAreaY
        this.isDollWatching = game.data?.gameStat?.dollWatching
        this.dollUpdating = false
    }
    draw() {
        const audio = this.isDollWatching ? 'redLight' : 'greenLight'
        if (this.dollUpdating) this.game.sound.play(audio)

        const dollImg = document.getElementById('doll')
        const dollBackImg = document.getElementById('doll-back')
        const treeImg = document.getElementById('tree')
        const doll = this.isDollWatching ? dollBackImg : dollImg

        this.ctx.drawImage(
            doll,
            this.x,
            this.y - 500 / (this.size * 2),
            188 / this.size,
            500 / this.size
        )
        this.ctx.drawImage(
            treeImg,
            this.x + 60,
            this.y - 800 / (this.size * 2),
            233 / this.size,
            640 / this.size
        )
    }
    update() {
        const isDollWatching = this.game.data?.gameStat?.dollWatching || false
        if (this.isDollWatching !== isDollWatching) {
            this.isDollWatching = isDollWatching
            this.dollUpdating = true
        } else this.dollUpdating = false
    }
}
