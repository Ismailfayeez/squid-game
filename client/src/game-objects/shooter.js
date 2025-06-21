export class Shooter {
    constructor(game) {
        this.ctx = game.ctx
        this.size = 4
    }
    draw({ x, y, position }) {
        const shooterImg = document.getElementById('shooter')

        const posX = x - 267 / (this.size * 2)
        const posY = position === 'top' ? y - 360 / this.size : y

        this.ctx.drawImage(
            shooterImg,
            posX,
            posY,
            267 / this.size,
            360 / this.size
        )
    }
}
