import type { Detection } from '../adapters/ModelAdapter'


export function detectionsToCsv(rows: Detection[]): string {
const header = 'timestamp,emotion,confidence\n'
const body = rows.map(r => `${new Date(r.timestamp).toISOString()},${r.emotion},${r.confidence.toFixed(3)}`).join('\n')
return header + body
}