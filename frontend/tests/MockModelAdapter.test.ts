import { MockModelAdapter } from '../src/adapters/MockModelAdapter'


it('emits detections after load+start', async () => {
const mock = new MockModelAdapter()
let got = 0
mock.onDetection(()=>{ got++ })
mock.onStatus(()=>{})
await mock.load()
const ms = new MediaStream()
mock.start(ms)
await new Promise(r => setTimeout(r, 1000))
mock.stop()
expect(got).toBeGreaterThan(0)
})