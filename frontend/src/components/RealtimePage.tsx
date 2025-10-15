import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import VideoPreview from './VideoPreview'
import EmotionBadge from './EmotionBadge'
import StatusChip from './StatusChip'
import Controls from './Controls'
import EmotionEffects from './EmotionEffects'
import { useCamera } from '../hooks/useCamera'
import { useStore } from '../state/useStore'
import type { Detection, ModelAdapter } from '../adapters/ModelAdapter'
import { MockModelAdapter } from '../adapters/MockModelAdapter'
import RealModelAdapter from '../adapters/RealModelAdapter'

const HistoryPanel = React.lazy(() => import('./HistoryPanel'))

export default function RealtimePage() {
  const navigate = useNavigate()
  const { videoRef, stream, error, request } = useCamera()
  const {
    setStatus,
    addDetection,
    status,
    showFaceBox,
    running,
    setRunning,
    threshold,
    modelSource,
  } = useStore()

  const [adapter, setAdapter] = React.useState<ModelAdapter | null>(null)
  const [faceBox, setFaceBox] = React.useState<Detection['bbox']>()
  const [latest, setLatest] = React.useState<Detection | null>(null)

  // Choose adapter based on source
  React.useEffect(() => {
    if (modelSource === 'remote') {
      setAdapter(new RealModelAdapter('http://localhost:8000'))
    } else if (modelSource === 'local') {
      // For now, use mock for local WASM (can be implemented later)
      setAdapter(new MockModelAdapter())
    } else {
      // Mock model for demo
      setAdapter(new MockModelAdapter())
    }
  }, [modelSource])

  // Wire adapter events
  React.useEffect(() => {
    if (!adapter) return
    adapter.onStatus((s) => setStatus(s === 'ready' ? 'ready' : s))
    adapter.onDetection((d) => {
      setFaceBox(d.bbox)
      if (d.confidence >= threshold) {
        setLatest(d)
        addDetection(d)
      }
    })
    adapter.load()
  }, [adapter, threshold, setStatus, addDetection])

  const handleStart = async () => {
    if (!stream) await request()
    if (videoRef.current && stream && adapter) {
      adapter.start(stream)
      setRunning(true)
    }
  }

  const handleStop = () => {
    adapter?.stop()
    setRunning(false)
  }

  const screenshot = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
    canvas?.toBlob((b) => {
      if (!b) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(b)
      a.download = `moodcam_${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(a.href)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <Header />

      {/* Emotion Effects Overlay */}
      <EmotionEffects 
        emotion={latest?.emotion || null} 
        confidence={latest?.confidence || 0} 
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Mode Selection</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <section className="lg:col-span-2 space-y-6">
            {/* Status and Controls */}
            <div className="card-glass">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center">
                  {latest ? (
                    <EmotionBadge
                      emotion={latest.emotion}
                      confidence={latest.confidence}
                    />
                  ) : (
                    <StatusChip text={status === 'idle' ? 'Ready to Start' : status} />
                  )}
                </div>
                <Controls
                  onStart={handleStart}
                  onStop={handleStop}
                  onScreenshot={screenshot}
                />
              </div>
            </div>

            {/* Video Preview */}
            <div className="card-glass p-0 overflow-hidden">
              <VideoPreview
                videoRef={videoRef}
                faceBox={showFaceBox ? faceBox : undefined}
                emotion={latest?.emotion}
              />
            </div>

            {/* Status Messages */}
            <div className="space-y-4">
              {error && (
                <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-red-700 dark:text-red-300 font-medium" role="alert">
                      {error}
                    </p>
                  </div>
                </div>
              )}
              
              {!stream && (
                <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300">
                      Camera access required. Click "Start Detection" to begin.
                    </p>
                  </div>
                </div>
              )}
              
              {running && status !== 'ready' && (
                <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse-soft"></div>
                    </div>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      AI model is loading...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <section className="space-y-6">
            <React.Suspense
              fallback={
                <div className="card">
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-neutral-600 dark:text-neutral-400">Loading...</span>
                    </div>
                  </div>
                </div>
              }
            >
              <HistoryPanel />
            </React.Suspense>
          </section>
        </div>
      </main>
    </div>
  )
}
