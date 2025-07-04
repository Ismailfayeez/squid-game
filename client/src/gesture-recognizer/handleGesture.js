import { gestureRecognizer } from './gestureRecognizer';

export const handleGesture = (video, handler) => {
    const results = gestureRecognizer.recognizeForVideo(video, Date.now());

    if (results?.gestures?.length > 0) {
        const categoryName = results.gestures[0][0].categoryName;
        const categoryScore = parseFloat(
            results.gestures[0][0].score * 100
        ).toFixed(2);
        if (categoryName == 'Open_Palm' && categoryScore > 60) return handler();
    }
};
