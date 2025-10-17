import type { Detection, Emotion, ModelAdapter, ModelStatus } from './ModelAdapter'

export default class RealModelAdapter implements ModelAdapter {
  private baseUrl: string
  private clientId: string
  private statusCallbacks: ((status: ModelStatus) => void)[] = []
  private detectionCallbacks: ((detection: Detection) => void)[] = []
  private isLoaded = false
  private isRunning = false
  private stream: MediaStream | null = null
  private videoElement: HTMLVideoElement | null = null
  private animationFrame: number | null = null

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl
    this.clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  onStatus(callback: (status: ModelStatus) => void): void {
    this.statusCallbacks.push(callback)
  }

  onDetection(callback: (detection: Detection) => void): void {
    this.detectionCallbacks.push(callback)
  }

  async load(): Promise<void> {
    try {
      this.notifyStatus('loading')
      
      // Test backend connection
      const response = await fetch(`${this.baseUrl}/healthz`)
      if (!response.ok) {
        throw new Error(`Backend not available: ${response.status}`)
      }
      
      const health = await response.json()
      console.log('Backend health check:', health)
      
      this.isLoaded = true
      this.notifyStatus('ready')
    } catch (error) {
      console.error('Failed to connect to backend:', error)
      this.notifyStatus('error')
      throw error
    }
  }

  start(stream: MediaStream): void {
    if (!this.isLoaded) {
      throw new Error('Model not loaded')
    }

    this.stream = stream
    this.isRunning = true
    // Keep status as 'ready' per ModelStatus type; UI reflects running via separate state
    this.notifyStatus('ready')

    // Create video element for processing
    this.videoElement = document.createElement('video')
    this.videoElement.srcObject = stream
    this.videoElement.play()
    
    // Start processing loop
    this.processFrame()
  }

  stop(): void {
    this.isRunning = false
    this.stream = null
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
    
    if (this.videoElement) {
      this.videoElement.srcObject = null
      this.videoElement = null
    }
    
    this.notifyStatus('ready')
  }

  private async processFrame(): Promise<void> {
    if (!this.isRunning || !this.videoElement) return

    try {
      // Capture frame from video
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = this.videoElement.videoWidth
      canvas.height = this.videoElement.videoHeight
      ctx.drawImage(this.videoElement, 0, 0)

      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      const base64Data = imageData.split(',')[1]

      // Send to backend
      const detection = await this.predictImage(base64Data)
      if (detection) {
        this.notifyDetection(detection)
      }
    } catch (error) {
      console.error('Frame processing error:', error)
    }

    // Continue processing
    this.animationFrame = requestAnimationFrame(() => this.processFrame())
  }

  async processImage(base64Image: string): Promise<Detection | null> {
    try {
      const response = await fetch(`${this.baseUrl}/predict/base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': this.clientId
        },
        body: JSON.stringify({
          image_base64: base64Image,
          client_id: this.clientId
        })
      })

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.status}`)
      }

      const result = await response.json()
      
      // Convert backend response to frontend Detection format
      const detection: Detection = {
        emotion: result.label as Emotion,
        confidence: result.probability,
        bbox: result.face_found && result.bbox ? {
          x: result.bbox[0] / this.videoElement!.videoWidth,
          y: result.bbox[1] / this.videoElement!.videoHeight,
          w: result.bbox[2] / this.videoElement!.videoWidth,
          h: result.bbox[3] / this.videoElement!.videoHeight
        } : undefined,
        timestamp: Date.now()
      }

      return detection
    } catch (error) {
      console.error('Image processing error:', error)
      return null
    }
  }

  private async predictImage(base64Image: string): Promise<Detection | null> {
    return this.processImage(base64Image)
  }

  private notifyStatus(status: ModelStatus): void {
    this.statusCallbacks.forEach(callback => callback(status))
  }

  private notifyDetection(detection: Detection): void {
    this.detectionCallbacks.forEach(callback => callback(detection))
  }

  // Utility method to convert file to base64
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1]) // Remove data:image/...;base64, prefix
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}
