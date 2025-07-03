import React from 'react';
import { Game } from './Game';
import { Room } from './Room';
import { Score } from './Score';
import { useSession } from '../hooks/useSession';
import { GAME_STATUSES, SCORE_BOARD, ROOM, GAME } from '../constants';
import { SessionMedia } from './media/SessionMedia';

export const Session = ({ setLocation }) => {
    const { data, input, game, handlers, currentPlayer, players } = useSession({
        setLocation,
    });

    const { handleStart, handleInput, handleFinish, handleExit } = handlers;

    const pages = {
        [ROOM]: {
            component: Room,
            props: {
                players,
                isLeader: currentPlayer.isLeader,
                handleStart,
                handleExit,
                ...game,
            },
        },
        [GAME]: {
            component: Game,
            props: {
                data,
                inputMode: input.mode,
                handleInput,
                handleFinish,
            },
        },
        [SCORE_BOARD]: { component: Score, props: { players, handleExit } },
    };

    let currentPage = pages[game.status] ? game.status : ROOM;

    if (input.isSrcConfirmed != null && GAME_STATUSES.includes(game.status)) {
        currentPage = GAME;
    }

    const { component: Component, props } = pages[currentPage] || {};

    return (
        <>
            <SessionMedia />
            <Component {...props} />
        </>
    );
};
