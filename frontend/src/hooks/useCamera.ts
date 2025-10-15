import { useEffect, useRef, useState } from 'react'


export function useCamera() {
const videoRef = useRef<HTMLVideoElement | null>(null)
const [stream, setStream] = useState<MediaStream | null>(null)
const [error, setError] = useState<string | null>(null)


useEffect(() => () => {
stream?.getTracks().forEach(t => t.stop())
}, [stream])


const request = async () => {
try {
const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
setStream(s)
if (videoRef.current) videoRef.current.srcObject = s
} catch (e) {
setError((e as Error).message)
}
}


return { videoRef, stream, error, request }
}