export class PlayerTile {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
        this.defaultWidth = 94
        const currentSize = Math.ceil(width) / this.defaultWidth
        this.avatarWidth = 60 * currentSize
        this.avatarHeight = 80 * currentSize
        this.fontSize = 16 * currentSize
        this.fontPos = 30 * currentSize
    }
    draw(x, y, id, player) {
        const headsImg = document.getElementById('heads-front')
        const headsImg2 = document.getElementById('heads-front2')
        this.ctx.save()
        this.ctx.translate(this.width * x, this.height * y)

        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = 'black'
        this.ctx.strokeRect(0, 0, this.width, this.height)

        this.ctx.fillStyle = '#333233'
        this.ctx.fillRect(0, 0, this.width, this.height)

        if (player?.status == 'ALIVE' || player?.status == 'FINISHED') {
            this.ctx.save()
            this.ctx.translate(this.width / 2, this.height / 2)
            this.ctx.rotate((-45 * Math.PI) / 180)

            const imgId = id % 8
            const image = id < 8 ? headsImg : headsImg2
            const imageWidth = image.naturalWidth / 8
            const imageHeight = image.naturalHeight

            this.ctx.drawImage(
                image,
                imageWidth * imgId,
                0,
                imageWidth,
                imageHeight,
                -this.avatarWidth / 2,
                -this.avatarHeight / 2,
                this.avatarWidth,
                this.avatarHeight
            )
            this.ctx.fillStyle = 'black'
            this.ctx.fillRect(-100, this.fontPos, 200, 25)

            this.ctx.font = `${this.fontSize}px Play`
            this.ctx.textBaseline = 'top'
            this.ctx.textAlign = 'center'
            this.ctx.fillStyle = '#b0f207'
            this.ctx.fillText(player?.name, 0, this.fontPos)
            this.ctx.restore()
        }

        this.ctx.restore()
    }
}
