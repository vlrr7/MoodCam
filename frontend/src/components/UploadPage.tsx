import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import ImageUpload from './ImageUpload'
import EmotionBadge from './EmotionBadge'
import type { Detection, ModelAdapter } from '../adapters/ModelAdapter'
import { MockModelAdapter } from '../adapters/MockModelAdapter'
import RealModelAdapter from '../adapters/RealModelAdapter'
import { useStore } from '../state/useStore'

const HistoryPanel = React.lazy(() => import('./HistoryPanel'))

export default function UploadPage() {
  const navigate = useNavigate()
  const { modelSource } = useStore()
  const [adapter, setAdapter] = React.useState<ModelAdapter | null>(null)
  const [latest, setLatest] = React.useState<Detection | null>(null)
  const [detections, setDetections] = useState<Detection[]>([])

  // Initialize adapter based on model source
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

  const handleImageDetection = (detection: Detection) => {
    setLatest(detection)
    setDetections(prev => [detection, ...prev])
  }

  const clearResults = () => {
    setLatest(null)
    setDetections([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <Header />

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
            {/* Current Result */}
            {latest && (
              <div className="card-glass">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Latest Detection
                  </h3>
                  <button
                    onClick={clearResults}
                    className="text-sm text-neutral-500 hover:text-red-500 transition-colors"
                  >
                    Clear Results
                  </button>
                </div>
                <div className="flex items-center justify-center">
                  <EmotionBadge
                    emotion={latest.emotion}
                    confidence={latest.confidence}
                  />
                </div>
              </div>
            )}

            {/* Image Upload Section */}
            <ImageUpload 
              adapter={adapter}
              onDetection={handleImageDetection}
            />

            {/* Instructions */}
            <div className="card-glass">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                How to Use
              </h3>
              <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <p>Upload an image by dragging and dropping or clicking to browse</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <p>Our AI will analyze the image and detect emotions in faces</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">3</span>
                  </div>
                  <p>View the detected emotion with confidence score</p>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <section className="space-y-6">
            {/* Detection History */}
            {detections.length > 0 && (
              <div className="card-glass">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Detection History
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {detections.map((detection, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          detection.emotion === 'happy' ? 'bg-yellow-500' :
                          detection.emotion === 'sad' ? 'bg-blue-500' :
                          detection.emotion === 'angry' ? 'bg-red-500' :
                          detection.emotion === 'fear' ? 'bg-purple-500' :
                          detection.emotion === 'disgust' ? 'bg-green-500' :
                          detection.emotion === 'surprise' ? 'bg-cyan-500' :
                          'bg-gray-500'
                        }`}></div>
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 capitalize">
                          {detection.emotion}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {Math.round(detection.confidence * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings are now consolidated in the Controls component */}
          </section>
        </div>
      </main>
    </div>
  )
}
