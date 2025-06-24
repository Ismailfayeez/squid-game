import { useEffect, useRef, useState } from 'react';
import { fetchCameraStream } from '../utils/fetchCameraStream';
import { ACTIVE_GAME_STATUSES, CLOSED_GAME_STATUSES } from '../constants';

export const useInputSource = (gameStatus, playerStatus) => {
    const [inputMode, setInputMode] = useState('keys');
    const [isInputSrcConfirmed, setIsInputSrcConfirmed] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animeFrameRef = useRef(null);

    const getInputSourceConfirmation = async () => {
        try {
            // get elements
            videoRef.current = document.getElementById('camera-video');
            canvasRef.current = document.getElementById('camera-canvas');
            streamRef.current = await fetchCameraStream(videoRef.current);

            videoRef.current.addEventListener('loadeddata', () => {
                setInputMode('camera');
                setIsInputSrcConfirmed(true);
            });

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
            setInputMode('keys');
            setIsInputSrcConfirmed(true);
        }
    };
    const removeVideoCapture = () => {
        streamRef.current?.getTracks()?.forEach((track) => track.stop());
        cancelAnimationFrame(animeFrameRef.current);
    };

    useEffect(() => {
        if (gameStatus === undefined || playerStatus === undefined) return;

        if (ACTIVE_GAME_STATUSES.includes(gameStatus))
            if (playerStatus === 'ALIVE')
                !isInputSrcConfirmed && getInputSourceConfirmation();
            else {
                setIsInputSrcConfirmed(false);
                removeVideoCapture();
            }
        else if (CLOSED_GAME_STATUSES.includes(gameStatus)) {
            setIsInputSrcConfirmed(false);
            removeVideoCapture();
        }

        return () => removeVideoCapture;
    }, [gameStatus, playerStatus, isInputSrcConfirmed]);

    return { inputMode, isInputSrcConfirmed, canvasRef };
};
