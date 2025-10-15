import type {
  Detection,
  Emotion,
  ModelAdapter,
  ModelStatus,
} from "./ModelAdapter";

const EMOTIONS: Emotion[] = [
  "angry",
  "disgust",
  "fear",
  "happy",
  "sad",
  "surprise",
  "neutral",
];

export class MockModelAdapter implements ModelAdapter {
  private detCb: ((d: Detection) => void) | null = null;
  private statusCb: ((s: ModelStatus) => void) | null = null;
  private timer?: number;

  async load() {
    this.statusCb?.("loading");
    await new Promise((r) => setTimeout(r, 600));
    this.statusCb?.("ready");
  }
  start(_stream: MediaStream) {
    this.stop();
    this.timer = window.setInterval(() => {
      const emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      const confidence = Math.max(
        0.05,
        Math.min(0.99, Math.random() * 0.6 + 0.3)
      );
      this.detCb?.({
        emotion,
        confidence,
        timestamp: Date.now(),
        bbox: { x: 0.3, y: 0.2, w: 0.4, h: 0.5 },
      });
    }, 900);
  }
  stop() {
    if (this.timer) window.clearInterval(this.timer);
  }
  onDetection(cb: (d: Detection) => void) {
    this.detCb = cb;
  }
  onStatus(cb: (s: ModelStatus) => void) {
    this.statusCb = cb;
  }
  
  async processImage(base64Image: string): Promise<Detection | null> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]
    const confidence = Math.max(0.05, Math.min(0.99, Math.random() * 0.6 + 0.3))
    
    return {
      emotion,
      confidence,
      timestamp: Date.now(),
      bbox: { x: 0.3, y: 0.2, w: 0.4, h: 0.5 }
    }
  }
}
