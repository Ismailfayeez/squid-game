import { useEffect, useRef, useState } from 'react'
import { fetchCameraStream } from '../utils/fetchCameraStream'
import { ACTIVE_GAME_STATUSES, CLOSED_GAME_STATUSES } from '../constants'

export const useInputSource = (gameStatus, playerStatus) => {
    const [inputMode, setInputMode] = useState('keys')
    const [isInputSrcConfirmed, setIsInputSrcConfirmed] = useState(null)
    const videoRef = useRef(null)
    const streamRef = useRef(null)

    const getInputSourceConfirmation = async () => {
        try {
            videoRef.current = document.createElement('video')
            videoRef.current.classname = 'webcam'
            videoRef.current.autoPlay = true
            videoRef.current.playsInline = true
            streamRef.current = await fetchCameraStream(videoRef.current)

            videoRef.current.addEventListener('loadeddata', () => {
                setInputMode('camera')
                setIsInputSrcConfirmed(true)
            })
        } catch {
            setInputMode('keys')
            setIsInputSrcConfirmed(true)
        }
    }

    const removeInputSrc = () =>
        streamRef.current?.getTracks()?.forEach((track) => track.stop())

    useEffect(() => {
        if (gameStatus === undefined || playerStatus === undefined) return

        if (ACTIVE_GAME_STATUSES.includes(gameStatus))
            if (playerStatus === 'ALIVE')
                !isInputSrcConfirmed && getInputSourceConfirmation()
            else {
                setIsInputSrcConfirmed(false)
                removeInputSrc()
            }
        else if (CLOSED_GAME_STATUSES.includes(gameStatus)) {
            setIsInputSrcConfirmed(false)
            removeInputSrc()
        }

        const removeEvent = () => {
            videoRef.current.removeEventListener('loadeddata')
        }

        return () => removeEvent
    }, [gameStatus, playerStatus, isInputSrcConfirmed])

    return { inputMode, isInputSrcConfirmed, videoRef }
}
