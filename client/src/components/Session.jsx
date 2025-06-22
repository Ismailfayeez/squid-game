import React, { useEffect, useReducer, useRef } from "react";
import { Game } from "./Game";
import { gameReducer } from "../reducer";
import { handleGesture } from "../gesture-recognizer/handleGesture";
import { Room } from "./Room";
import { Score } from "./Score";
import ThemeSong from "../assets/sgTheme.mp3";
import FlyMoon from "../assets/flyMoon.mp3";
import Notify from "../assets/notify.mp3";
import {
  FINISHED,
  GAME_STATUSES,
  MOVE,
  REMOVE_TOKEN,
  SCORE_BOARD,
  START_GAME,
} from "../constants";
import { useInputSource } from "../hooks/useInputSource";

export const Session = ({ setLocation }) => {
  const [data, dispatch] = useReducer(gameReducer, {});
  const { status, gameStat: { players = {} } = {}, code, me } = data;

  const socketRef = useRef(null);

  const playersStatus = Object.keys(players).map((name) => ({
    name,
    status: players[name]?.status,
  }));
  const currentPlayerStatus = players?.[me?.name]?.status;

  const { inputMode, isInputSrcConfirmed, videoRef } = useInputSource(
    status,
    currentPlayerStatus
  );
  const { MODE, VITE_API_URL } = import.meta.env;

  const protocol = MODE === "production" ? "wss" : "ws";
  const domain = MODE === "production" ? VITE_API_URL : "localhost:3000";
  const baseUrl = `${protocol}://${domain}`;

  useEffect(() => {
    socketRef.current = new WebSocket(`${baseUrl}/game`);

    socketRef.current.onmessage = ({ data }) =>
      dispatch({ data: JSON.parse(data) });

    socketRef.current.onopen = () => {
      console.log("open");
    };
    socketRef.current.onclose = () => {
      document.cookie = REMOVE_TOKEN;
    };
    socketRef.current.onerror = () => {
      document.cookie = REMOVE_TOKEN;
      setLocation("login");
    };

    return () => socketRef.current.close();
  }, []);

  const handleStartGame = () =>
    socketRef.current.send(JSON.stringify({ action: START_GAME }));

  const handleMove = () => {
    socketRef.current.send(JSON.stringify({ action: MOVE }));
    const walkSound = document.getElementById("walk");
    walkSound.playbackRate = 16;
    walkSound.play();
    return 1;
  };

  const handleFinish = () =>
    socketRef.current.send(JSON.stringify({ action: FINISHED }));

  const handleInput = (inputMode) => {
    if (inputMode === "camera")
      return handleGesture(videoRef.current, handleMove);
    else return handleMove();
  };
  const handleExit = () => {
    document.cookie = REMOVE_TOKEN;
    setLocation("login");
  };
  const render = () => {
    if (status === SCORE_BOARD)
      return <Score players={players} handleExit={handleExit} />;
    else if (isInputSrcConfirmed != null && GAME_STATUSES.includes(status))
      return (
        <Game
          data={data}
          inputMode={inputMode}
          handleInput={handleInput}
          handleFinish={handleFinish}
        />
      );
    else
      return (
        <Room
          players={playersStatus}
          status={status}
          code={code}
          handleStart={handleStartGame}
          handleExit={handleExit}
        />
      );
  };
  return (
    <>
      <audio src={ThemeSong} id="theme" loop />
      <audio src={FlyMoon} id="fly-moon" loop />
      <audio src={Notify} id="notify" />
      {render()}
    </>
  );
};
