import { useEffect } from 'react'

export const useBgAudio = (name) => {
    useEffect(() => {
        const audio = document.getElementById(name)
        audio.volume = 0.4
        audio?.play?.()
        return () => {
            audio.currentTime = 0
            audio?.pause?.()
        }
    }, [])
}
