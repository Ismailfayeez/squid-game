import { useReducer } from 'react';
import { useHandleActions } from './useHandleActions';
import { useInputSource } from './useInputSource';
import { gameReducer } from '../reducer';

export const useSession = ({ setLocation }) => {
    const [data, dispatch] = useReducer(gameReducer, {});

    const { status, gameStat: { players = {} } = {}, code, me } = data;

    const currentPlayerData = players?.[me?.name];

    const { input, canvasRef: videoRef } = useInputSource(
        status,
        currentPlayerData?.status
    );

    const handlers = useHandleActions({ dispatch, setLocation, videoRef });
    const isLeader = currentPlayerData?.role == 'LEADER';

    const game = { status, code };
    const currentPlayer = { isLeader, ...currentPlayerData };
    const playerList = Object.keys(players).map((name) => ({
        name,
        ...players[name],
    }));

    return { data, input, game, handlers, currentPlayer, players: playerList };
};
