import { create } from 'zustand'
import type { Detection, Emotion } from '../adapters/ModelAdapter'


export type Theme = 'light'|'dark'|'system'
export type ModelSource = 'mock'|'local'|'remote'


interface State {
locale: 'en'|'fr'
theme: Theme
muted: boolean
running: boolean
threshold: number
smoothing: number
effects: { bounce: boolean; glow: boolean; beep: boolean }
showFaceBox: boolean
modelSource: ModelSource
status: 'loading'|'ready'|'error'|'idle'
history: Detection[]
filter: Emotion | 'all'
setLocale(l: 'en'|'fr'): void
setTheme(t: Theme): void
setMuted(v: boolean): void
setRunning(v: boolean): void
setThreshold(v: number): void
setSmoothing(v: number): void
setEffects(p: Partial<State['effects']>): void
setShowFaceBox(v: boolean): void
setModelSource(m: ModelSource): void
setStatus(s: State['status']): void
addDetection(d: Detection): void
setFilter(f: State['filter']): void
clearHistory(): void
}


export const useStore = create<State>((set, get) => ({
locale: (localStorage.getItem('locale') as 'en'|'fr') || 'en',
theme: (localStorage.getItem('theme') as Theme) || 'system',
muted: false,
running: false,
threshold: 0.4,
smoothing: 0.5,
effects: { bounce: true, glow: true, beep: false },
showFaceBox: true,
modelSource: 'mock',
status: 'idle',
history: [],
filter: 'all',
setLocale: (l) => { localStorage.setItem('locale', l); set({ locale: l }) },
setTheme: (t) => { localStorage.setItem('theme', t); set({ theme: t }) },
setMuted: (v) => set({ muted: v }),
setRunning: (v) => set({ running: v }),
setThreshold: (v) => set({ threshold: Math.max(0, Math.min(1, v)) }),
setSmoothing: (v) => set({ smoothing: Math.max(0, Math.min(1, v)) }),
setEffects: (p) => set({ effects: { ...get().effects, ...p } }),
setShowFaceBox: (v) => set({ showFaceBox: v }),
setModelSource: (m) => set({ modelSource: m }),
setStatus: (s) => set({ status: s }),
addDetection: (d) => set(state => ({ history: [d, ...state.history].slice(0,50) })),
setFilter: (f) => set({ filter: f }),
clearHistory: () => set({ history: [] })
}))