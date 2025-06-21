export class EndLine {
    constructor(game) {
        this.ctx = game.ctx
        this.boundary = game.boundary
        this.lineStart = game.width - game.finishArea
        this.height = game.height
        this.path = new Path2D()
    }
    draw() {
        this.path.moveTo(this.lineStart, this.boundary)
        this.path.lineTo(this.lineStart - 10, this.height)

        this.ctx.strokeStyle = 'rgb(168, 6, 3)'
        this.ctx.lineWidth = 10.0
        this.ctx.stroke(this.path)
    }
}
