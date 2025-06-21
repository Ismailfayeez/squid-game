import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision'

const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
)
export const gestureRecognizer = await GestureRecognizer.createFromOptions(
    vision,
    {
        baseOptions: {
            modelAssetPath:
                'https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task',
            delegate: 'GPU',
        },
        runningMode: { video: true },
    }
)
