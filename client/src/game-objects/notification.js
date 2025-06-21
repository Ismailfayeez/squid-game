import { MESSAGES } from '../constants'

export class Notification {
    constructor(game) {
        this.ctx = game.ctx
        this.game = game
        this.status = game.data.status
        this.frame = 0
        this.maxFrame = 50
    }
    draw() {
        this.ctx.save()
        this.ctx.translate(this.game.width / 2, this.game.height / 2)

        // drawing image notification
        const instructImg = document.getElementById('instruct')
        if (this.status === 'INSTRUCT')
            this.ctx.drawImage(instructImg, -945 / 2, -442 / 2, 945, 400)

        // writing text notfication
        if (this.frame >= this.maxFrame) {
            this.ctx.restore()
            return
        }
        if (this.frame === 0) {
            let song = ''
            if (this.status === 'INSTRUCT') song = 'doll-song'
            if (['STARTED', 'ENDED'].includes(this.status)) song = 'buzzer'
            if (song) {
                const audio = document.getElementById(song)
                audio.volume = song == 'buzzer' ? 0.1 : 0.5
                audio?.play()
            }
        }
        this.ctx.font = '80px VT323'
        this.ctx.fontStyle = 'black'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'top'

        const text = MESSAGES[this.status] || ''

        this.ctx.fillText(text, 0, 0)
        this.ctx.restore()
    }
    update() {
        if (this.frame < this.maxFrame) this.frame++
        if (this.game.data.status !== this.status) {
            this.frame = 0
            this.status = this.game.data.status
        }
    }
}
