import React from "react";
import wrBg from "../assets/wrBg.webp";
import { PlayersTile } from "./players-tile/PlayersTile";
import { NOT_STARTED, PREPARING } from "../constants";
import { useBgAudio } from "../hooks/useBgAudio";

export const Room = ({ players = [], status, code, handleStart }) => {
  const allowStart = status === NOT_STARTED && players.length >= 2;

  useBgAudio("theme");

  return (
    <div
      className="background flex flex--column"
      style={{
        backgroundImage: `url(${wrBg})`,
        alignItems: "center",
      }}
    >
      <div className="black-tile">
        <h2 style={{ textAlign: "center" }}>
          P<span className="highlight">l</span>ayer
          <span className="highlight">s</span>
        </h2>
        <div style={{ padding: "0 50px" }}>
          <div className="player-tiles-container">
            <PlayersTile players={players} />
          </div>
          <div className="flex flex--gap">
            <p className="margin--zero">game code :</p>{" "}
            <span className="margin--zero">{code}</span>
          </div>

          <button className="btn" disabled={!allowStart} onClick={handleStart}>
            {status === PREPARING ? "Preparing game....." : "Start game"}
          </button>
        </div>
      </div>
    </div>
  );
};
