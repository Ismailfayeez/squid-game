import { Shooter } from './shooter'

export class Shooters {
    constructor(game) {
        this.game = game
        this.ctx = game.ctx
        this.shooter = new Shooter(game)
        this.endArea = game.width - game.endLine.lineStart
        const shooterPosX = game.endLine.lineStart + this.endArea * 0.5
        const playArea = game.height - game.boundary
        const midArea = Math.round(playArea * 0.5)

        this.leftShooter = {
            x: shooterPosX,
            y: game.boundary + midArea + midArea * 0.5,
            position: 'bottom',
        }
        this.rightShooter = {
            x: shooterPosX,
            y: game.boundary + midArea - midArea * 0.5,
            position: 'top',
        }
    }
    draw() {
        this.shooter.draw(this.leftShooter)
        this.shooter.draw(this.rightShooter)
    }
}
