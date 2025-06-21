export const fetchCameraStream = async (video) => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
    })
    video.srcObject = stream
    video.play()
    return stream
}
