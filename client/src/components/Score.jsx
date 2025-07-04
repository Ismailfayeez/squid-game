import React from 'react';
import ScoreBg from '../assets/scoreBg.webp';
import { PlayersTile } from './players-tile/PlayersTile';
import { useBgAudio } from '../hooks/useBgAudio';
import { Table } from './ui/Table';
import { PRIZES } from '../constants';

export const Score = ({ players, handleExit }) => {
    const initialPlayers = players.map(({ name }) => ({
        name,
        status: 'ALIVE',
    }));

    const rankingPlayers = players
        .filter((player) => player.status === 'FINISHED')
        .sort((a, b) => a.timeStamp - b.timeStamp)
        .slice(0, 3)
        .map(({ name }, index) => [index + 1, name, `${PRIZES[index]} usd`]);

    useBgAudio('fly-moon');

    return (
        <>
            <div
                className="background flex--center"
                style={{
                    backgroundImage: `url(${ScoreBg})`,
                }}
            >
                <div className="black-tile">
                    <h2 style={{ textAlign: 'center' }}>
                        W<span className="highlight">i</span>nner
                        <span className="highlight">s</span> of th
                        <span className="highlight">e</span> R
                        <span className="highlight">o</span>und{' '}
                        <span className="highlight">1</span>
                    </h2>

                    <div style={{ padding: '0 50px' }}>
                        <div className="player-tiles-container">
                            <PlayersTile
                                players={players}
                                initialPlayers={initialPlayers}
                            />
                        </div>
                    </div>
                    {rankingPlayers.length ? (
                        <Table
                            headers={['Rank', 'Players', 'Prize']}
                            rows={rankingPlayers}
                        />
                    ) : (
                        <div className="flex--center dead-font">All Dead</div>
                    )}
                    <button className="btn btn--secondary" onClick={handleExit}>
                        Exit
                    </button>
                </div>
            </div>
        </>
    );
};
