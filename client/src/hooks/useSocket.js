import { useEffect, useRef } from 'react';
import { REMOVE_TOKEN } from '../constants';

export const useSocket = ({ dispatch, handleExit }) => {
    const { MODE, VITE_API_URL } = import.meta.env;
    const protocol = MODE === 'production' ? 'wss' : 'ws';
    const domain = MODE === 'production' ? VITE_API_URL : 'localhost:3000';
    const baseUrl = `${protocol}://${domain}`;
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket(`${baseUrl}/game`);

        socketRef.current.onmessage = ({ data }) =>
            dispatch({ data: JSON.parse(data) });

        socketRef.current.onopen = () => {
            console.log('open');
        };
        socketRef.current.onclose = () => {
            document.cookie = REMOVE_TOKEN;
        };
        socketRef.current.onerror = () => handleExit();

        return () => socketRef.current.close();
    }, []);

    return { socketRef };
};
