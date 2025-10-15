import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useStore } from '../state/useStore'

export default function VideoPreview({ 
  videoRef, 
  faceBox,
  emotion 
}: { 
  videoRef: MutableRefObject<HTMLVideoElement|null>, 
  faceBox?: {x:number;y:number;w:number;h:number},
  emotion?: string
}) {
  const { effects } = useStore()
  const canvasRef = useRef<HTMLCanvasElement|null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [smoothedBox, setSmoothedBox] = useState<{x:number;y:number;w:number;h:number} | null>(null)
  const [stableSize, setStableSize] = useState<{w:number;h:number} | null>(null)
  const smoothingFactor = 0.1 // Lower = more smoothing
  const minMovementThreshold = 0.05 // Minimum movement to update (5% of screen)
  const sizeChangeThreshold = 0.1 // Minimum size change to update (10% of screen)

  // Smooth face box coordinates with stable size
  useEffect(() => {
    if (faceBox) {
      setSmoothedBox(prev => {
        if (!prev) {
          // Initialize with stable size
          const stableW = Math.max(0.15, Math.min(0.25, faceBox.w)) // 15-25% of screen
          const stableH = Math.max(0.15, Math.min(0.25, faceBox.h))
          setStableSize({ w: stableW, h: stableH })
          return { ...faceBox, w: stableW, h: stableH }
        }
        
        // Calculate movement distance
        const dx = Math.abs(faceBox.x - prev.x)
        const dy = Math.abs(faceBox.y - prev.y)
        
        // Only update position if movement is significant
        const positionChanged = dx >= minMovementThreshold || dy >= minMovementThreshold
        
        // Use stable size from initial detection
        const currentStableSize = stableSize || { w: 0.2, h: 0.2 }
        
        if (!positionChanged) {
          return prev // Keep previous position for stability
        }
        
        // Only smooth position, keep size stable
        return {
          x: prev.x + (faceBox.x - prev.x) * smoothingFactor,
          y: prev.y + (faceBox.y - prev.y) * smoothingFactor,
          w: currentStableSize.w,
          h: currentStableSize.h
        }
      })
    } else {
      setSmoothedBox(null)
      setStableSize(null)
    }
  }, [faceBox, minMovementThreshold, smoothingFactor, stableSize])

  useEffect(() => {
    const v = videoRef.current
    const c = canvasRef.current
    if (!v || !c) return
    
    const ctx = c.getContext('2d')!
    let raf = 0
    
    const loop = () => {
      if (v.readyState >= 2 && v.videoWidth > 0 && v.videoHeight > 0) {
        setVideoLoaded(true)
        
        // Set canvas size to match video
        c.width = v.videoWidth
        c.height = v.videoHeight
        
        // Clear canvas
        ctx.clearRect(0, 0, c.width, c.height)
        
        // Draw video frame
        ctx.drawImage(v, 0, 0, c.width, c.height)
        
        if (smoothedBox) {
          // Enhanced face detection box with smoothed coordinates
          const x = smoothedBox.x * c.width
          const y = smoothedBox.y * c.height
          const w = smoothedBox.w * c.width
          const h = smoothedBox.h * c.height
          
          // Ensure minimum size for visibility
          const minPixelSize = 50
          const finalW = Math.max(w, minPixelSize)
          const finalH = Math.max(h, minPixelSize)
          
          // Get emotion-based colors
          const getEmotionColor = (emotion?: string) => {
            switch (emotion) {
              case 'happy': return { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' }
              case 'sad': return { color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.5)' }
              case 'angry': return { color: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' }
              case 'fear': return { color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.5)' }
              case 'disgust': return { color: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)' }
              case 'surprise': return { color: '#14b8a6', glow: 'rgba(20, 184, 166, 0.5)' }
              case 'neutral': return { color: '#6b7280', glow: 'rgba(107, 114, 128, 0.5)' }
              default: return { color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.5)' }
            }
          }
          
          const { color, glow } = getEmotionColor(emotion)
          
          // Outer glow
          ctx.shadowColor = glow
          ctx.shadowBlur = 20
          ctx.strokeStyle = color
          ctx.lineWidth = 4
          ctx.strokeRect(x, y, finalW, finalH)
          
          // Inner highlight
          ctx.shadowBlur = 0
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 2
          ctx.strokeRect(x + 2, y + 2, finalW - 4, finalH - 4)
          
          // Corner indicators
          const cornerSize = 20
          ctx.strokeStyle = color
          ctx.lineWidth = 3
          
          // Top-left
          ctx.beginPath()
          ctx.moveTo(x, y + cornerSize)
          ctx.lineTo(x, y)
          ctx.lineTo(x + cornerSize, y)
          ctx.stroke()
          
          // Top-right
          ctx.beginPath()
          ctx.moveTo(x + finalW - cornerSize, y)
          ctx.lineTo(x + finalW, y)
          ctx.lineTo(x + finalW, y + cornerSize)
          ctx.stroke()
          
          // Bottom-left
          ctx.beginPath()
          ctx.moveTo(x, y + finalH - cornerSize)
          ctx.lineTo(x, y + finalH)
          ctx.lineTo(x + cornerSize, y + finalH)
          ctx.stroke()
          
          // Bottom-right
          ctx.beginPath()
          ctx.moveTo(x + finalW - cornerSize, y + finalH)
          ctx.lineTo(x + finalW, y + finalH)
          ctx.lineTo(x + finalW, y + finalH - cornerSize)
          ctx.stroke()
        }
      } else {
        setVideoLoaded(false)
      }
      raf = requestAnimationFrame(loop)
    }
    
    loop()
    return () => cancelAnimationFrame(raf)
  }, [videoRef, smoothedBox])

  return (
    <div className="relative group">
      {/* Main video container */}
      <div className={`particle-wrap rounded-3xl overflow-hidden shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 transition-all duration-300 ${
        effects.glow ? 'hover:shadow-xl' : ''
      }`}>
        <canvas 
          ref={canvasRef} 
          className="hidden w-full aspect-video block bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900" 
        />
        <video 
          ref={videoRef as any} 
          className="w-full aspect-video block bg-black" 
          autoPlay 
          playsInline 
          muted 
        />
      </div>
      
      {/* Overlay info */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${videoLoaded ? 'bg-green-500 animate-pulse-soft' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {videoLoaded ? 'Live Detection' : 'Waiting for Camera'}
          </span>
        </div>
      </div>
      
      {/* Face detection indicator */}
      {smoothedBox && (
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg animate-slide-up">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-soft"></div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Face Detected
            </span>
          </div>
        </div>
      )}
    </div>
  )
}