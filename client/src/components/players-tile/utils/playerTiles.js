import { PLAYERS_COUNT } from '../../../constants'
import { PlayerTile } from './playerTile'

export class PlayerTiles {
    constructor(ctx, width, height, players = []) {
        this.ctx = ctx
        this.width = width
        this.height = height
        const sides = Math.ceil(Math.sqrt(PLAYERS_COUNT))
        this.rows = sides
        this.cols = sides
        this.tileWidth = width / this.rows
        this.tileHeight = height / this.cols
        this.fpu = 30
        this.currentFrame = 0
        this.isUpdating = false
        this.players = players
        this.playerTile = new PlayerTile(ctx, this.tileWidth, this.tileHeight)
        this.initialDelay = 800
        this.timeStamp = Date.now()
    }
    draw() {
        if (this.isUpdating && this.fpu === this.currentFrame) {
            this.currentFrame = 0
            this.isUpdating = false
        }
        if (this.isUpdating && this.currentFrame == 0) {
            const audio = document.getElementById('notify')
            audio.volume = 0.1
            audio?.play()
        }

        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                const id = this.rows * x + y

                const player = this.players?.[id] ? this.players?.[id] : {}

                this.playerTile.draw(x, y, id, player)
            }
        }

        this.ctx.lineWidth = 5
        this.ctx.strokeStyle = '#db0f3c'
        this.ctx.strokeRect(0, 0, this.width, this.height)
    }
    update(players = []) {
        if (Date.now() - this.timeStamp <= this.initialDelay) return
        if (this.isUpdating) {
            this.currentFrame++
            return
        }

        for (let i = 0; i < players.length; i++) {
            if (
                JSON.stringify(players[i]) !== JSON.stringify(this.players[i])
            ) {
                this.players[i] = players[i]
                this.isUpdating = true
                break
            }
        }
    }
}
