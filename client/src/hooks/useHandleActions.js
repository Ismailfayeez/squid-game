import { FINISHED, MOVE, REMOVE_TOKEN, START_GAME } from '../constants';
import { handleGesture } from '../gesture-recognizer/handleGesture';
import { useSocket } from './useSocket';

export const useHandleActions = ({ dispatch, setLocation, videoRef }) => {
    const handleExit = () => {
        document.cookie = REMOVE_TOKEN;
        setLocation('login');
    };
    const { socketRef } = useSocket({ dispatch, handleExit });

    const handleStart = () =>
        socketRef.current.send(JSON.stringify({ action: START_GAME }));

    const handleMove = () => {
        dispatch({ action: 'PREDICT_MOVE' });
        socketRef.current.send(JSON.stringify({ action: MOVE }));
        const walkSound = document.getElementById('walk');
        walkSound.playbackRate = 16;
        walkSound.play();
        return 1;
    };

    const handleFinish = () =>
        socketRef.current.send(JSON.stringify({ action: FINISHED }));

    const handleInput = (inputMode) => {
        if (inputMode === 'camera')
            return handleGesture(videoRef.current, handleMove);
        else return handleMove();
    };

    return {
        handleStart,
        handleInput,
        handleMove,
        handleFinish,
        handleExit,
    };
};
