export type Emotion =
  | "angry"
  | "disgust"
  | "fear"
  | "happy"
  | "sad"
  | "surprise"
  | "neutral";

export interface Detection {
  emotion: Emotion;
  confidence: number; // 0–1
  bbox?: { x: number; y: number; w: number; h: number };
  timestamp: number;
}

export type ModelStatus = "loading" | "ready" | "error";

export interface ModelAdapter {
  load(): Promise<void>;
  start(stream: MediaStream): void;
  stop(): void;
  onDetection(cb: (d: Detection) => void): void;
  onStatus(cb: (s: ModelStatus) => void): void;
  processImage?(base64Image: string): Promise<Detection | null>;
}
