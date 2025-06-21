import React, { useEffect, useRef } from 'react'
import { PlayerTiles } from './utils/playerTiles'
import HeadsFront from '../../assets/frontFace1.png'
import HeadsFront2 from '../../assets/frontFace2.png'

export const PlayersTile = ({ initialPlayers, players = [] }) => {
    const canvaRef = useRef(null)
    const playersRef = useRef(players)
    const animeRef = useRef(null)

    useEffect(() => {
        playersRef.current = players
    }, [players])

    useEffect(() => {
        const ctx = canvaRef.current?.getContext('2d')

        const playerTiles = new PlayerTiles(
            ctx,
            canvaRef.current.width,
            canvaRef.current.height,
            initialPlayers
        )

        const drawPlayersTile = () => {
            ctx.clearRect(0, 0, 280, 280)
            playerTiles.draw()
            playerTiles.update(playersRef.current)
            animeRef.current = requestAnimationFrame(drawPlayersTile)
        }

        drawPlayersTile()
        return () => cancelAnimationFrame(animeRef.current)
    }, [])

    return (
        <>
            <div className="assets">
                <img src={HeadsFront} id="heads-front" />
                <img src={HeadsFront2} id="heads-front2" />
            </div>
            <canvas
                height={280}
                width={280}
                ref={canvaRef}
                className="player-tiles"
            />
        </>
    )
}
