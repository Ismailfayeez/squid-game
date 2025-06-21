function formatMilliseconds(ms) {
    if (ms < 0) return '00:00'
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)

    const mins = String(minutes).padStart(2, '0')
    const secs = String(seconds).padStart(2, '0')

    return `${mins}:${secs}`
}

export class Timer {
    constructor(game) {
        const { startTime, gameTime } = game.data
        this.game = game
        this.ctx = game.ctx
        this.width = 180
        this.height = 65
        this.gameTime = gameTime
        this.currentTime = startTime ? Date.now() - startTime : 0
        this.timerStarted = false
        this.intervalId = ''
    }
    draw() {
        this.ctx.save()
        this.ctx.translate(this.game.width / 2 - 50, 0)
        this.ctx.strokeStyle = 'grey'
        this.ctx.fillStyle = 'black'
        this.ctx.strokeRect(0, 0, this.width, this.height)
        this.ctx.fillRect(0, 0, this.width, this.height)
        this.ctx.save()
        this.ctx.translate(this.width / 2, this.height / 2)
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.font = '80px VT323'
        this.ctx.fillStyle = 'red'
        const time = formatMilliseconds(this.gameTime - this.currentTime)
        this.ctx.fillText(time, 0, 0)
        this.ctx.restore()
        this.ctx.restore()
    }
    update() {
        const { status, startTime } = this.game.data

        if (status === 'STARTED')
            if (this.timerStarted) {
                if (this.currentTime >= this.gameTime) {
                    clearInterval(this.intervalId)
                    this.timerStarted = false
                }
            } else {
                this.intervalId = setInterval(() => {
                    this.currentTime = Date.now() - startTime
                }, 1000)
                this.timerStarted = true
            }
        else clearInterval(this.intervalId)
    }
}
