import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl shadow-xl mb-8">
            <span className="text-white font-bold text-4xl">M</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            MoodCam
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered emotion detection. Choose your preferred mode to get started with real-time analysis or image upload.
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Real-time Tracking Mode */}
          <div className="group">
            <div className="card-glass hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer h-full"
                 onClick={() => navigate('/realtime')}>
              <div className="text-center p-10">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                
                {/* Content */}
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  Real-time Tracking
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                  Use your camera for live emotion detection. Perfect for real-time analysis, 
                  video calls, or continuous monitoring.
                </p>
                
                {/* Features */}
                <div className="space-y-4 mb-10">
                  <div className="flex items-center space-x-4 text-base text-neutral-600 dark:text-neutral-400">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>Live camera feed</span>
                  </div>
                  <div className="flex items-center space-x-4 text-base text-neutral-600 dark:text-neutral-400">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>Real-time face detection</span>
                  </div>
                  <div className="flex items-center space-x-4 text-base text-neutral-600 dark:text-neutral-400">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>Continuous emotion analysis</span>
                  </div>
                  <div className="flex items-center space-x-4 text-base text-neutral-600 dark:text-neutral-400">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>Screenshot capture</span>
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 font-semibold group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                  <span>Start Real-time Detection</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Mode */}
          <div className="group">
            <div className="card-glass hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer h-full"
                 onClick={() => navigate('/upload')}>
              <div className="text-center p-10">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                {/* Content */}
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  Image Upload
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                  Upload and analyze static images for emotion detection. Great for 
                  batch processing, photo analysis, or one-time assessments.
                </p>
                
                {/* Features */}
                <div className="space-y-4 mb-10">
                  <div className="flex items-center space-x-4 text-base text-neutral-600 dark:text-neutral-400">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span>Drag & drop upload</span>
                  </div>
                  <div className="flex items-center space-x-4 text-base text-neutral-600 dark:text-neutral-400">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span>Multiple image formats</span>
                  </div>
                  <div className="flex items-center space-x-4 text-base text-neutral-600 dark:text-neutral-400">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span>Instant analysis</span>
                  </div>
                  <div className="flex items-center space-x-4 text-base text-neutral-600 dark:text-neutral-400">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span>Detailed results</span>
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  <span>Upload & Analyze</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="card-glass max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Powered by Advanced AI
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Our emotion detection model supports 7 different emotions: Happy, Sad, Angry, Fear, Disgust, Surprise, and Neutral
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
