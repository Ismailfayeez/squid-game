import React, { useEffect, useRef } from 'react';
import PlayArea from '../assets/playArea.svg';
import Instruct from '../assets/instruct.png';
import Heads1 from '../assets/heads1.png';
import Heads2 from '../assets/heads2.png';
import Player from '../assets/bodyCycle.png';
import Blood from '../assets/bloodCycle.png';
import PlayerDead from '../assets/deadCycle.png';
import Doll from '../assets/doll.png';
import DollBack from '../assets/dollBack.png';
import Tree from '../assets/tree.png';
import Branch from '../assets/branch.png';
import Shooter from '../assets/shooter.png';
import Walk from '../assets/walk.mp3';
import Buzzer from '../assets/buzzer.mp3';
import DollSong from '../assets/dollSong.mp3';
import { GameArena } from '../game-objects/game';

export const Game = ({ data, inputMode, handleInput, handleFinish }) => {
    const ref = useRef(null);
    const dataRef = useRef(data);
    const timeRef = useRef(0);
    const frameRef = useRef(1);
    const width = 1520;
    const height = 855;
    const isMobileDevice = window.innerWidth <= 480;
    const canvasWidth = isMobileDevice ? height : width;
    const canvasHeight = isMobileDevice ? width : height;

    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    useEffect(() => {
        const ctx = ref.current?.getContext('2d');
        if (isMobileDevice) {
            ctx.translate(height, 0);
            ctx.rotate((90 * Math.PI) / 180);
        }

        const game = new GameArena(
            ctx,
            frameRef.current,
            width,
            height,
            dataRef.current,
            inputMode,
            handleInput,
            handleFinish
        );

        function runGame(timestamp) {
            let refreshTime =
                timestamp - timeRef.current == 0
                    ? 1
                    : timestamp - timeRef.current;
            let currentFps = Math.floor(1000 / refreshTime);
            currentFps = currentFps >= 30 ? currentFps : 30;
            const frameRate = 1 / (Math.round((currentFps / 60) * 2) / 2);
            frameRef.current = frameRate || frameRef.current;
            timeRef.current = timestamp;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            game.draw();
            game.update(frameRef.current, dataRef.current);

            requestAnimationFrame(runGame);
        }
        runGame();
    }, []);
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
                <audio src={Walk} id="walk" />
                <audio src={Buzzer} id="buzzer" />
                <audio src={DollSong} id="doll-song" />
            </div>
            <canvas
                id="canvas"
                width={canvasWidth}
                height={canvasHeight}
                ref={ref}
            ></canvas>
        </div>
    );
};
