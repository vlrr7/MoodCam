import { useStore } from '../state/useStore'
import { useState } from 'react'

export default function Controls({ onStart, onStop, onScreenshot }: { 
  onStart(): void; 
  onStop(): void; 
  onScreenshot(): void 
}) {
  const { 
    muted, setMuted, 
    running, 
    threshold, setThreshold,
    smoothing, setSmoothing,
    effects, setEffects,
    modelSource, setModelSource,
    showFaceBox, setShowFaceBox
  } = useStore()
  const [showSettings, setShowSettings] = useState(false)
  
  return (
    <div className="space-y-4">
      {/* Main Control Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Main Action Button */}
        <button 
          onClick={onStart}
          disabled={running}
          className={`px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            running 
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
          }`}
        >
          {running ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Running</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
              </svg>
              <span>Start Detection</span>
            </div>
          )}
        </button>

        {/* Stop Button */}
        <button 
          onClick={onStop}
          disabled={!running}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            <span>Stop</span>
          </div>
        </button>

        {/* Screenshot Button */}
        <button 
          onClick={onScreenshot}
          className="btn-secondary"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Screenshot</span>
          </div>
        </button>

        {/* Settings Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn-secondary"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </div>
        </button>
      </div>

      {/* Comprehensive Settings Panel */}
      {showSettings && (
        <div className="card-glass space-y-6 animate-slide-down">
          <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            All Settings
          </h4>
          
          {/* Detection Settings */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-neutral-800 dark:text-neutral-200">Detection Settings</h5>
            
            {/* Confidence Threshold */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Confidence Threshold: {Math.round(threshold * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>Low (10%)</span>
                <span>High (90%)</span>
              </div>
            </div>

            {/* Smoothing */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Smoothing: {Math.round(smoothing * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={smoothing}
                onChange={(e) => setSmoothing(parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>None (0%)</span>
                <span>Maximum (100%)</span>
              </div>
            </div>

            {/* Show Face Box */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Show Face Detection Box
              </span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={showFaceBox} 
                    onChange={e => setShowFaceBox(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                    showFaceBox ? 'bg-blue-500' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-0.5 ${
                      showFaceBox ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {showFaceBox ? '👁️ Visible' : '👁️‍🗨️ Hidden'}
                </span>
              </label>
            </div>
          </div>

          {/* Audio & Effects Settings */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-neutral-800 dark:text-neutral-200">Audio & Effects</h5>
            
            {/* Audio Controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Audio Feedback
              </span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={!muted} 
                    onChange={e => setMuted(!e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                    muted ? 'bg-neutral-300 dark:bg-neutral-600' : 'bg-blue-500'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-0.5 ${
                      muted ? 'translate-x-0.5' : 'translate-x-6'
                    }`}></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {muted ? '🔇 Muted' : '🔊 Enabled'}
                </span>
              </label>
            </div>

            {/* Effects */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Visual Effects</span>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={effects.bounce} 
                    onChange={e => setEffects({ ...effects, bounce: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Icon Bounce Animation</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={effects.glow} 
                    onChange={e => setEffects({ ...effects, glow: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Color Glow Effects</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={effects.beep} 
                    onChange={e => setEffects({ ...effects, beep: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Beep Sounds</span>
                </label>
              </div>
            </div>
          </div>

          {/* Model Settings */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-neutral-800 dark:text-neutral-200">Model Settings</h5>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Model Source
              </label>
              <select 
                value={modelSource} 
                onChange={e => setModelSource(e.target.value as any)} 
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mock">Mock Model (Demo)</option>
                <option value="local">Local WASM</option>
                <option value="remote">Remote API</option>
              </select>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {running ? '●' : '○'}
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Detection Status
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(threshold * 100)}%
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                Confidence Threshold
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}