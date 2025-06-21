import React, { useEffect, useRef } from 'react'
import { Timer } from '../game-objects/timer'

export const Playground = () => {
    const ref = useRef(null)
    const totalTimer = 60000
    const status = 'STARTED'

    useEffect(() => {
        const ctx = ref.current?.getContext('2d')
        const timer = new Timer(ctx, totalTimer)
        const drawTimer = () => {
            ctx.clearRect(0, 0, 280, 280)
            timer.draw()
            timer.update(status)
            requestAnimationFrame(drawTimer)
        }

        drawTimer()
    }, [])
    return <canvas width={1000} height={1000} ref={ref} />
}
