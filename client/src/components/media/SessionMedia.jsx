import React from 'react';
import ThemeSong from '../../assets/sgTheme.mp3';
import FlyMoon from '../../assets/flyMoon.mp3';

export const SessionMedia = () => {
    return (
        <>
            <canvas
                id="camera-canvas"
                className="webcam"
                width={480}
                height={640}
            />
            <video
                id="camera-video"
                className="webcam"
                autoPlay
                playsInline
                muted
            />

            <audio src={ThemeSong} id="theme" loop />
            <audio src={FlyMoon} id="fly-moon" loop />
        </>
    );
};
