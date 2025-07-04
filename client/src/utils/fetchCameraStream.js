export const fetchCameraStream = async (video) => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: { exact: 'user' },
        },
        audio: false,
    });
    video.srcObject = stream;
    video.play();
    return stream;
};
