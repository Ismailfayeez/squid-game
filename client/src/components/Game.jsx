import React, { useEffect, useRef } from 'react'
import PlayArea from '../assets/playArea.svg'
import Instruct from '../assets/instruct.png'
import Heads1 from '../assets/heads1.png'
import Heads2 from '../assets/heads2.png'
import Player from '../assets/bodyCycle.png'
import Blood from '../assets/bloodCycle.png'
import PlayerDead from '../assets/deadCycle.png'
import Doll from '../assets/doll.png'
import DollBack from '../assets/dollBack.png'
import Tree from '../assets/tree.png'
import Branch from '../assets/branch.png'
import Shooter from '../assets/shooter.png'
import Walk from '../assets/walk.mp3'
import Pistol from '../assets/pistol.mp3'
import RedLight from '../assets/redLight.mp3'
import GreenLight from '../assets/greenLight.mp3'
import Buzzer from '../assets/buzzer.mp3'
import DollSong from '../assets/dollSong.mp3'
import { GameArena } from '../game-objects/game'

export const Game = ({ data, inputMode, handleInput, handleFinish }) => {
    const ref = useRef(null)
    const dataRef = useRef(data)
    const timeRef = useRef(0)
    const width = 1520
    const height = 855

    useEffect(() => {
        dataRef.current = data
    }, [data])

    useEffect(() => {
        const ctx = ref.current?.getContext('2d')
        const game = new GameArena(
            ctx,
            width,
            height,
            dataRef.current,
            inputMode,
            handleInput,
            handleFinish
        )

        function runGame(timestamp) {
            timeRef.current = timestamp
            ctx.clearRect(0, 0, height, width)
            game.draw()
            game.update(dataRef.current)

            requestAnimationFrame(runGame)
        }
        runGame()
    }, [])
    return (
        <div className="flex">
            <div className="assets">
                <img src={PlayArea} id="play-area" />
                <img src={Instruct} id="instruct" />
                <img src={Heads1} id="heads1" />
                <img src={Heads2} id="heads2" />
                <img src={Player} id="player" />
                <img src={Blood} id="blood" />
                <img src={PlayerDead} id="player-dead" />
                <img src={Shooter} id="shooter" />
                <img src={Doll} id="doll" />
                <img src={DollBack} id="doll-back" />
                <img src={Tree} id="tree" />
                <img src={Branch} id="branch" />
                <audio src={Pistol} id="pistol" />
                <audio src={Walk} id="walk" />
                <audio src={RedLight} id="red-light" />
                <audio src={GreenLight} id="green-light" />
                <audio src={Buzzer} id="buzzer" />
                <audio src={DollSong} id="doll-song" />
            </div>
            <canvas
                id="canvas"
                width={width}
                height={height}
                ref={ref}
            ></canvas>
        </div>
    )
}
