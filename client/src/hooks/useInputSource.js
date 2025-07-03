import { useEffect, useRef, useState } from 'react';
import { fetchCameraStream } from '../utils/fetchCameraStream';
import {
    ACTIVE_GAME_STATUSES,
    ALIVE,
    CLOSED_GAME_STATUSES,
} from '../constants';

export const useInputSource = (gameStatus, playerStatus) => {
    const [mode, setMode] = useState('keys');
    const [isSrcConfirmed, setIsSrcConfirmed] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animeFrameRef = useRef(null);

    const getInputSourceConfirmation = async () => {
        try {
            videoRef.current = document.getElementById('camera-video');
            canvasRef.current = document.getElementById('camera-canvas');
            streamRef.current = await fetchCameraStream(videoRef.current);
            const handleLoaddedData = () => {
                setMode('camera');
                setIsSrcConfirmed(true);
                videoRef.current.removeEventListener(
                    'loadeddata',
                    handleLoaddedData
                );
            };

            videoRef.current.addEventListener('loadeddata', handleLoaddedData);

            // create canvas
            const { width, height } = canvasRef.current;
            const ctx = canvasRef.current.getContext('2d');

            const createCanvasVideo = () => {
                ctx.clearRect(0, 0, width, height);
                ctx.save();
                if (window.innerWidth <= 480) {
                    ctx.translate(width, 0);
                    ctx.rotate((90 * Math.PI) / 180);
                }
                ctx.drawImage(videoRef.current, 0, 0, height, width);
                ctx.restore();
                animeFrameRef.current =
                    requestAnimationFrame(createCanvasVideo);
            };

            createCanvasVideo();
        } catch {
            setMode('keys');
            setIsSrcConfirmed(true);
        }
    };

    const removeVideoCapture = () => {
        streamRef.current?.getTracks()?.forEach((track) => track.stop());
        cancelAnimationFrame(animeFrameRef.current);
    };

    useEffect(() => {
        if (gameStatus === undefined || playerStatus === undefined) return;

        if (ACTIVE_GAME_STATUSES.includes(gameStatus))
            if (playerStatus === ALIVE)
                !isSrcConfirmed && getInputSourceConfirmation();
            else {
                setIsSrcConfirmed(false);
                removeVideoCapture();
            }
        else if (CLOSED_GAME_STATUSES.includes(gameStatus)) {
            setIsSrcConfirmed(false);
            removeVideoCapture();
        }
    }, [gameStatus, playerStatus, isSrcConfirmed]);

    return {
        input: { mode, isSrcConfirmed },
        canvasRef,
    };
};
