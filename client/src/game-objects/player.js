import { COLORS } from '../constants'
import { PlayerDead } from './playerDead'

export class Player {
    constructor(game, { name, x = 0, y = 0, posX = 0, posY, status, id }) {
        // size per players
        this.game = game
        this.ctx = game.ctx
        this.boundary = game.boundary
        this.me = game.data.me
        this.groundHeight = game.height - this.boundary
        this.rowCount = parseInt(game.data.rowCount)
        this.hpr = this.groundHeight / parseInt(this.rowCount)

        // player
        this.id = id
        this.name = name
        this.size = 4
        this.fontHeight = 15
        this.fontColor = COLORS[Math.floor(Math.random() * COLORS.length)]

        this.bodyWidth = 174 / this.size
        this.bodyHeight = 340 / this.size
        this.totalHeight = this.fontHeight + this.headHeight + this.bodyHeight

        // position
        this.fpm = 8
        this.x = parseInt(x)
        this.y = y * this.hpr
        this.posX = parseInt(posX)
        this.posY = parseInt(posY) + this.boundary
        this.frameX = this.posX + this.x * this.fpm
        this.frameY = this.posY + this.y
        this.status = status
        this.playerMoving = false
        this.hidePlayer = false
        this.playerDead = new PlayerDead(game, id)

        if (this.frameY + this.totalHeight > game.height)
            this.frameY = game.height - this.totalHeight
        else if (this.frameY < this.boundary) this.frameY = this.boundary
    }

    draw() {
        if (this.hidePlayer) return
        if (this.status === 'DEAD')
            return this.playerDead.draw(this.frameX, this.frameY)

        const heads1 = document.getElementById('heads1')
        const heads2 = document.getElementById('heads2')
        const body = document.getElementById('player')
        const currentX = this.posX + this.x * this.fpm

        this.ctx.save()
        this.ctx.translate(this.frameX, this.frameY)

        // write player name

        const itsMe = this.name === this.me?.name
        const name = itsMe ? 'you' : this.name
        this.ctx.font = `${itsMe ? 14 : 12}px Verdana`

        this.ctx.fillStyle = itsMe ? '#02e63f' : this.fontColor
        this.ctx.textBaseline = 'top'
        this.ctx.textAlign = 'right'
        this.ctx.lineWidth = itsMe ? 0.4 : 0.3
        this.ctx.strokeStyle = 'black'

        this.ctx.fillText(name, this.bodyWidth, 0)
        this.ctx.strokeText(name, this.bodyWidth, 0)
        this.ctx.translate(0, this.fontHeight)

        // draw player head
        const imageId = this.id % 8
        const head = this.id < 8 ? heads1 : heads2
        const headImgWidth = head.naturalWidth / 8
        const headImgHeight = head.naturalHeight

        this.headDrawWidth = 75 / this.size
        this.headDrawHeight = 100 / this.size
        this.ctx.drawImage(
            head,
            imageId * headImgWidth,
            0,
            headImgWidth,
            headImgHeight,
            this.bodyWidth - this.headDrawWidth,
            0,
            this.headDrawWidth,
            this.headDrawHeight
        )
        this.ctx.translate(0, this.headDrawWidth)

        const completedFrames = this.fpm - (currentX - this.frameX)
        const currentBodyPos =
            completedFrames === this.fpm ? 0 : Math.floor(completedFrames / 4)

        // draw player body
        this.ctx.drawImage(
            body,
            174 * currentBodyPos,
            0,
            174,
            393,
            0,
            0,
            this.bodyWidth,
            this.bodyHeight
        )
        this.ctx.restore()
    }
    update({ x, y, status }) {
        this.x = parseInt(x)
        this.y = parseInt(y)
        this.status = status
        const newX = this.posX + this.x * this.fpm
        const { lineStart } = this.game.endLine

        if (newX > lineStart + 20) this.hidePlayer = true

        if (this.frameX < newX) {
            this.playerMoving = true
            this.frameX += 1
        } else this.playerMoving = false
    }
}
