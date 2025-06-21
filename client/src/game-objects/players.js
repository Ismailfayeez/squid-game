import { Player } from './player'

export class Players {
    constructor(game) {
        const { players = {} } = game.data?.gameStat || {}

        this.players = Object.keys(players).reduce(
            (acc, player, id) => ({
                ...acc,
                [player]: new Player(game, {
                    ...players[player],
                    name: player,
                    id,
                }),
            }),
            {}
        )
        this.game = game
    }
    draw() {
        const { players = {} } = this.game.data?.gameStat || {}

        const sortedPlayers = Object.keys(players)
            .map((name) => ({
                name,
                ...players[name],
            }))
            .sort((a, b) => a.y - b.y)

        sortedPlayers.map(({ name }) => this.players[name].draw())
    }

    update() {
        const { players = {} } = this.game.data?.gameStat || {}
        Object.keys(players).map((player) => {
            if (this.players[player])
                this.players[player].update(players[player])
            else this.players[player] = new Player(this.game, players[player])
        })
    }
}
